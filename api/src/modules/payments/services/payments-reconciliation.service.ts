import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { VivaCheckoutService } from '@/integrations/viva/services/viva-checkout.service';
import { VivaDataServicesService } from '@/integrations/viva/services/viva-data-services.service';
import { VivaOrderState } from '@/integrations/viva/interfaces/viva-checkout.interface';
import { VivaTransaction } from '@/integrations/viva/interfaces/viva-transactions.interface';
import { TipStatus, PaymentTransactionStatus } from 'generated/prisma';
import { PaymentWebhooksService } from './payment-webhooks.service';

// Viva fires no webhook for a cancelled checkout or an expired/abandoned
// order — this sweep is the only way those ever get resolved.
const RECONCILE_GRACE_MS = 15 * 60 * 1000; // paymentTimeout (10 min) + buffer

@Injectable()
export class PaymentsReconciliationService {
  private readonly logger = new Logger(PaymentsReconciliationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly vivaCheckout: VivaCheckoutService,
    private readonly vivaDataServices: VivaDataServicesService,
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

    const order = await this.vivaCheckout.getOrder(orderCode);

    if (order.StateId === VivaOrderState.PAID) {
      const transaction = await this.findTransactionForOrder(orderCode, tipId);
      if (!transaction) {
        this.logger.warn(`Order ${orderCode} is PAID at Viva but no matching transaction could be found for reconciliation`);
        return false;
      }
      await this.paymentWebhooksService.applyVerifiedTransaction(transaction);
      return true;
    }

    if (order.StateId === VivaOrderState.EXPIRED || order.StateId === VivaOrderState.CANCELED) {
      await this.markCancelled(tipId);
      return true;
    }

    return false;
  }

  private async findTransactionForOrder(orderCode: string, tipId: string): Promise<VivaTransaction | null> {
    const result = await this.vivaDataServices.searchTransactions({
      OrderCode: orderCode,
      MerchantTrns: tipId,
    });

    const match = (result.data ?? [])[0] as VivaTransaction | undefined;
    return match ?? null;
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
}
