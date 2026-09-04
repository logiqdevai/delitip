import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { VivaCheckoutService } from '@/integrations/viva/services/viva-checkout.service';
import { VivaOrder, VivaOrderState } from '@/integrations/viva/interfaces/viva-checkout.interface';
import { VivaTransaction } from '@/integrations/viva/interfaces/viva-transactions.interface';
import { VivaApiException } from '@/integrations/viva/http/viva-api.exception';
import { TipStatus, PaymentTransactionStatus } from 'generated/prisma';
import { PaymentWebhooksService } from './payment-webhooks.service';
import { VIVA_TRANSACTION_STATUS_SUCCESS } from '../interfaces/viva-webhook-event-types.interface';

// Viva fires no webhook for a cancelled checkout or an expired/abandoned
// order — this sweep is the only way those ever get resolved.
const RECONCILE_GRACE_MS = 15 * 60 * 1000; // paymentTimeout (10 min) + buffer

@Injectable()
export class PaymentsReconciliationService {
  private readonly logger = new Logger(PaymentsReconciliationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly vivaCheckout: VivaCheckoutService,
    private readonly paymentWebhooksService: PaymentWebhooksService,
  ) {}

  @Cron(CronExpression.EVERY_10_MINUTES)
  async sweep(): Promise<{ corrected: number }> {
    const stuckTips = await this.prisma.tip.findMany({
      where: {
        status: { in: [TipStatus.CREATED, TipStatus.PROCESSING] },
        created_at: { lt: new Date(Date.now() - RECONCILE_GRACE_MS) },
      },
      include: { payment_transaction: true },
    });

    let corrected = 0;
    for (const tip of stuckTips) {
      try {
        const wasCorrected = await this.reconcileTip(tip.id, tip.payment_transaction?.provider_order_code ?? null);
        if (wasCorrected) corrected += 1;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        this.logger.error(`Reconciliation failed for tip ${tip.id}: ${message}`);
      }
    }

    if (corrected > 0) {
      this.logger.log(`Reconciliation sweep corrected ${corrected} stuck tip(s)`);
    }
    return { corrected };
  }

  private async reconcileTip(tipId: string, orderCode: string | null): Promise<boolean> {
    if (!orderCode) return false;

    let order;
    try {
      order = await this.vivaCheckout.getOrder(orderCode);
    } catch (error) {
      if (error instanceof VivaApiException && error.getStatus() === 404) {
        this.logger.warn(`Order ${orderCode} no longer exists at Viva; marking tip ${tipId} as failed`);
        await this.markFailed(tipId);
        return true;
      }
      throw error;
    }

    if (order.StateId === VivaOrderState.PAID) {
      // Would ideally be the Data Services "Search Transactions" API, but
      // that requires an OAuth2 scope this merchant's clients aren't
      // provisioned for (confirmed 401 — neither the Checkout nor Account
      // Transactions client carries a dataservices scope). The order GET
      // above is itself an authoritative Viva-side re-fetch (native API,
      // Basic auth, not a trusted webhook payload), so a PAID StateId from
      // it is enough to apply — it just carries less detail (no
      // authorizationId/cardTypeId) than a real transaction lookup would.
      await this.paymentWebhooksService.applyVerifiedTransaction(this.buildTransactionFromOrder(order));
      return true;
    }

    if (order.StateId === VivaOrderState.EXPIRED || order.StateId === VivaOrderState.CANCELED) {
      await this.markCancelled(tipId);
      return true;
    }

    return false;
  }

  // Both the native v1 orders API and the checkout v2 transactions API
  // report amounts in major currency units (e.g. 5.00) — confirmed against
  // Viva's real responses. applyVerifiedTransaction is the single place
  // that converts to minor units, so this passes the raw major-unit values
  // through unchanged, same as a real getTransaction() response would.
  private buildTransactionFromOrder(order: VivaOrder): VivaTransaction {
    return {
      merchantTrns: order.MerchantTrns,
      orderCode: order.OrderCode,
      statusId: VIVA_TRANSACTION_STATUS_SUCCESS,
      amount: order.RequestAmount,
      tipAmount: order.TipAmount,
    };
  }

  private async markCancelled(tipId: string): Promise<void> {
    const tip = await this.prisma.tip.findUnique({ where: { id: tipId }, include: { payment_transaction: true } });
    if (!tip || tip.status === TipStatus.COMPLETED) return;

    await this.prisma.$transaction([
      this.prisma.tip.update({ where: { id: tipId }, data: { status: TipStatus.CANCELLED } }),
      ...(tip.payment_transaction
        ? [
            this.prisma.paymentTransaction.update({
              where: { id: tip.payment_transaction.id },
              data: { status: PaymentTransactionStatus.EXPIRED },
            }),
          ]
        : []),
    ]);
  }

  private async markFailed(tipId: string): Promise<void> {
    const tip = await this.prisma.tip.findUnique({ where: { id: tipId }, include: { payment_transaction: true } });
    if (!tip || tip.status === TipStatus.COMPLETED) return;

    await this.prisma.$transaction([
      this.prisma.tip.update({ where: { id: tipId }, data: { status: TipStatus.FAILED } }),
      ...(tip.payment_transaction
        ? [
            this.prisma.paymentTransaction.update({
              where: { id: tip.payment_transaction.id },
              data: { status: PaymentTransactionStatus.FAILED },
            }),
          ]
        : []),
    ]);
  }
}
