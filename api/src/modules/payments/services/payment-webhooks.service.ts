import { Injectable, Logger } from '@nestjs/common';
import { Prisma, PayoutExecutionStatus, PayoutStatus, TipStatus } from 'generated/prisma';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { TipsService } from '@/modules/tips/services/tips.service';
import { VivaTransactionsService } from '@/integrations/viva/services/viva-transactions.service';
import { VivaTransaction } from '@/integrations/viva/interfaces/viva-transactions.interface';
import { PlatformFinanceConfig } from '@/shared/config/platform-finance/platform-finance.config';
import {
  calculateTipDistribution,
  RuleRecipientInput,
} from '@/shared/utils/distribution/distribution-calculator.util';
import { VivaWebhookPayloadDto } from '../dto/viva-webhook-payload.dto';
import {
  VIVA_TRANSACTION_STATUS_SUCCESS,
  VivaWebhookEventTypeId,
} from '../interfaces/viva-webhook-event-types.interface';

@Injectable()
export class PaymentWebhooksService {
  private readonly logger = new Logger(PaymentWebhooksService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly vivaTransactions: VivaTransactionsService,
    private readonly platformFinanceConfig: PlatformFinanceConfig,
    private readonly tipsService: TipsService,
  ) {}

  async process(payload: VivaWebhookPayloadDto): Promise<void> {
    let event;
    try {
      event = await this.prisma.webhookEvent.create({
        data: {
          message_id: payload.MessageId,
          event_type_id: payload.EventTypeId,
          payload: payload as unknown as Prisma.InputJsonValue,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        // Already recorded — Viva's at-least-once delivery (up to 24 hourly
        // retries) means this is expected, not an error.
        return;
      }
      throw error;
    }

    try {
      await this.dispatch(payload);
      await this.prisma.webhookEvent.update({
        where: { id: event.id },
        data: { processed_at: new Date() },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Webhook processing failed for ${payload.MessageId}: ${message}`);
      await this.prisma.webhookEvent.update({
        where: { id: event.id },
        data: { processing_error: message },
      });
    }
  }

  private async dispatch(payload: VivaWebhookPayloadDto): Promise<void> {
    switch (payload.EventTypeId) {
      case VivaWebhookEventTypeId.TRANSACTION_PAYMENT_CREATED:
        return this.handlePaymentCreated(payload.EventData);
      case VivaWebhookEventTypeId.TRANSACTION_FAILED:
        return this.handleTransactionFailed(payload.EventData);
      case VivaWebhookEventTypeId.TRANSACTION_PRICE_CALCULATED:
        return this.handlePriceCalculated(payload.EventData);
      case VivaWebhookEventTypeId.TRANSACTION_REVERSAL_CREATED:
        return this.handleReversalCreated(payload.EventData);
      case VivaWebhookEventTypeId.COMMAND_BANK_TRANSFER_EXECUTED:
        return this.handleBankTransferExecuted(payload.EventData);
      case VivaWebhookEventTypeId.COMMAND_BANK_TRANSFER_CREATED:
        // Already recorded synchronously when the transfer was initiated
        // (payouts.service sets provider_transfer_id from the :send
        // response) — nothing further to do here.
        return;
      case VivaWebhookEventTypeId.ORDER_UPDATED:
        return this.handleOrderUpdated(payload.EventData);
      default:
        this.logger.log(`Unhandled Viva webhook EventTypeId ${payload.EventTypeId}`);
        return;
    }
  }

  private extractTransactionId(eventData?: Record<string, unknown>): string | undefined {
    if (!eventData) return undefined;
    const candidate = eventData.TransactionId ?? eventData.transactionId ?? eventData.Id;
    return typeof candidate === 'string' ? candidate : undefined;
  }

  private async handlePaymentCreated(eventData?: Record<string, unknown>): Promise<void> {
    const transactionId = this.extractTransactionId(eventData);
    if (!transactionId) {
      this.logger.warn('Payment-created webhook missing TransactionId in EventData');
      return;
    }

    // Never trust the webhook payload for the actual state transition —
    // Viva's own docs require re-fetching the transaction server-side.
    const transaction = await this.vivaTransactions.getTransaction(transactionId);
    await this.applyVerifiedTransaction(transaction);
  }

  // Shared by the 1796 webhook handler and the reconciliation sweep — both
  // must apply the exact same verified-success logic.
  async applyVerifiedTransaction(transaction: VivaTransaction): Promise<void> {
    const tipId = transaction.merchantTrns;
    if (!tipId) {
      this.logger.warn('Verified Viva transaction has no merchantTrns to match against a Tip');
      return;
    }

    const tip = await this.prisma.tip.findUnique({
      where: { id: tipId },
      include: { payment_transaction: true },
    });

    if (!tip || !tip.payment_transaction) {
      this.logger.warn(`No Tip/PaymentTransaction found for merchantTrns=${tipId}`);
      return;
    }

    if (tip.status === TipStatus.COMPLETED) {
      // Already applied (e.g. webhook + reconciliation sweep raced) — no-op.
      return;
    }

    if (transaction.statusId !== VIVA_TRANSACTION_STATUS_SUCCESS) {
      this.logger.warn(`Transaction ${transaction.orderCode} statusId=${transaction.statusId} is not a success state`);
      return;
    }

    if (transaction.amount !== tip.payment_transaction.gross_amount) {
      this.logger.error(
        `Amount mismatch for tip ${tip.id}: expected ${tip.payment_transaction.gross_amount}, Viva reports ${transaction.amount}`,
      );
      return;
    }

    const selectedEmployeeIds = Array.isArray(tip.selected_employee_ids)
      ? (tip.selected_employee_ids as unknown[]).filter((id): id is string => typeof id === 'string')
      : tip.employee_id
        ? [tip.employee_id]
        : [];

    const recipients: RuleRecipientInput[] = tip.distribution_rule_id
      ? (
          await this.prisma.distributionRuleRecipient.findMany({
            where: { distribution_rule_id: tip.distribution_rule_id },
          })
        ).map((r) => ({
          recipient_type: r.recipient_type,
          employee_id: r.employee_id,
          percentage: Number(r.percentage),
          sort_order: r.sort_order,
        }))
      : [];

    const grossAmount = tip.payment_transaction.gross_amount;
    const commissionAmount = tip.payment_transaction.commission_amount;
    const processorFeeEstimated = Math.round(
      (grossAmount * this.platformFinanceConfig.getProcessorFeeEstimatePercentage()) / 100,
    );
    const netDistributableAmount = Math.max(
      grossAmount - commissionAmount - processorFeeEstimated,
      0,
    );

    const distributionLines = calculateTipDistribution(recipients, selectedEmployeeIds, netDistributableAmount);

    await this.prisma.$transaction(async (tx) => {
      await tx.tip.update({
        where: { id: tip.id },
        data: {
          status: TipStatus.COMPLETED,
          paid_at: new Date(),
          payment_reference: transaction.authorizationId ?? String(transaction.orderCode ?? ''),
        },
      });

      await tx.paymentTransaction.update({
        where: { id: tip.payment_transaction!.id },
        data: {
          provider_transaction_id: this.transactionIdOf(transaction),
          status: 'SUCCEEDED',
          confirmed_at: new Date(),
          processor_fee_estimated: processorFeeEstimated,
          net_distributable_amount: netDistributableAmount,
          payment_method: transaction.cardTypeId ? String(transaction.cardTypeId) : undefined,
        },
      });

      await tx.tipDistribution.createMany({
        data: distributionLines.map((line) => ({
          tip_id: tip.id,
          recipient_type: line.recipient_type,
          employee_id: line.employee_id,
          amount: line.amount,
          percentage: line.percentage,
        })),
      });
    });

    this.tipsService.triggerPerformanceChangeAlert(tip.store_id).catch(() => {});
  }

  private transactionIdOf(transaction: VivaTransaction): string | undefined {
    // VivaTransaction doesn't expose its own id field directly in the
    // documented response shape — authorizationId is the closest stable
    // per-transaction reference returned by GET .../transactions/{id}.
    return transaction.authorizationId;
  }

  private async handleTransactionFailed(eventData?: Record<string, unknown>): Promise<void> {
    const transactionId = this.extractTransactionId(eventData);
    if (!transactionId) {
      this.logger.warn('Transaction-failed webhook missing TransactionId in EventData');
      return;
    }

    const transaction = await this.vivaTransactions.getTransaction(transactionId);
    const tipId = transaction.merchantTrns;
    if (!tipId) return;

    const tip = await this.prisma.tip.findUnique({
      where: { id: tipId },
      include: { payment_transaction: true },
    });
    if (!tip || !tip.payment_transaction) return;
    if (tip.status === TipStatus.COMPLETED || tip.status === TipStatus.FAILED) return;

    await this.prisma.$transaction([
      this.prisma.tip.update({ where: { id: tip.id }, data: { status: TipStatus.FAILED } }),
      this.prisma.paymentTransaction.update({
        where: { id: tip.payment_transaction.id },
        data: { status: 'FAILED', failure_reason: `Viva transaction status ${transaction.statusId ?? 'unknown'}` },
      }),
    ]);
  }

  // The one case Viva's docs say produces no webhook at all elsewhere — a
  // customer backing out via Smart Checkout's cancel/back button. No money
  // ever moved for this order, so unlike the payment/failure handlers above
  // there's nothing to re-verify against a transaction lookup; MerchantTrns
  // in the payload is trusted only as a lookup key, and the status write is
  // itself guarded to only ever downgrade a still-in-flight tip.
  private async handleOrderUpdated(eventData?: Record<string, unknown>): Promise<void> {
    if (eventData?.IsCancelled !== true) return;

    const merchantTrns = eventData?.MerchantTrns;
    const orderCode = eventData?.OrderCode;

    const tip =
      typeof merchantTrns === 'string'
        ? await this.prisma.tip.findUnique({
            where: { id: merchantTrns },
            include: { payment_transaction: true },
          })
        : orderCode !== undefined
          ? await this.prisma.tip.findFirst({
              where: { payment_transaction: { provider_order_code: String(orderCode) } },
              include: { payment_transaction: true },
            })
          : null;

    if (!tip || !tip.payment_transaction) {
      this.logger.warn(
        `Order-updated (cancelled) webhook could not be matched to a Tip (merchantTrns=${merchantTrns}, orderCode=${orderCode})`,
      );
      return;
    }

    // Never override a tip that already resolved some other way (completed,
    // failed, or a duplicate/out-of-order delivery of this same event).
    if (tip.status !== TipStatus.CREATED && tip.status !== TipStatus.PROCESSING) return;

    await this.prisma.$transaction([
      this.prisma.tip.update({ where: { id: tip.id }, data: { status: TipStatus.CANCELLED } }),
      this.prisma.paymentTransaction.update({
        where: { id: tip.payment_transaction.id },
        data: { status: 'CANCELLED' },
      }),
    ]);
  }

  private async handlePriceCalculated(eventData?: Record<string, unknown>): Promise<void> {
    const transactionId = this.extractTransactionId(eventData);
    if (!transactionId) {
      this.logger.warn('Price-calculated webhook missing TransactionId in EventData');
      return;
    }

    // The exact field carrying Viva's real fee isn't documented publicly —
    // try the plausible candidates before giving up (§19 of the payment plan).
    const feeCandidate =
      eventData?.CommissionAmount ?? eventData?.FeeAmount ?? eventData?.Amount ?? eventData?.Fee;
    const confirmedFee = typeof feeCandidate === 'number' ? Math.round(feeCandidate) : undefined;

    const paymentTransaction = await this.prisma.paymentTransaction.findFirst({
      where: { provider_transaction_id: transactionId },
    });
    if (!paymentTransaction) {
      this.logger.warn(`No PaymentTransaction found for provider_transaction_id=${transactionId}`);
      return;
    }

    if (confirmedFee === undefined) {
      this.logger.error(
        `Could not extract confirmed processor fee from 1799 payload for transaction ${transactionId} — leaving processor_fee_confirmed=false`,
      );
      return;
    }

    const netDistributableAmount = Math.max(
      paymentTransaction.gross_amount - paymentTransaction.commission_amount - confirmedFee,
      0,
    );

    await this.prisma.paymentTransaction.update({
      where: { id: paymentTransaction.id },
      data: {
        processor_fee_confirmed_amount: confirmedFee,
        processor_fee_confirmed: true,
        net_distributable_amount: netDistributableAmount,
      },
    });
  }

  private async handleReversalCreated(eventData?: Record<string, unknown>): Promise<void> {
    const merchantTrns = eventData?.MerchantTrns ?? eventData?.merchantTrns;
    if (typeof merchantTrns !== 'string') {
      this.logger.warn('Reversal-created webhook missing MerchantTrns to match a Refund');
      return;
    }

    const refund = await this.prisma.refund.findUnique({ where: { id: merchantTrns } });
    if (!refund) {
      this.logger.warn(`No local Refund found for reversal MerchantTrns=${merchantTrns}`);
      return;
    }

    await this.prisma.refund.update({
      where: { id: refund.id },
      data: { provider_status: 'CONFIRMED' },
    });
  }

  private async handleBankTransferExecuted(eventData?: Record<string, unknown>): Promise<void> {
    const commandId = eventData?.BankCommandId ?? eventData?.bankCommandId ?? eventData?.CommandId;
    if (typeof commandId !== 'string') {
      this.logger.warn('Bank-transfer-executed webhook missing a command id to match a Payout');
      return;
    }

    const payout = await this.prisma.payout.findFirst({ where: { provider_transfer_id: commandId } });
    if (!payout) {
      this.logger.warn(`No Payout found for provider_transfer_id=${commandId}`);
      return;
    }
    if (payout.status !== PayoutExecutionStatus.PROCESSING) return;

    const succeeded = eventData?.Success !== false && eventData?.StatusId !== 'FAILED';

    await this.prisma.$transaction(async (tx) => {
      if (succeeded) {
        await tx.payout.update({
          where: { id: payout.id },
          data: { status: PayoutExecutionStatus.COMPLETED, executed_at: new Date() },
        });
        await tx.tipDistribution.updateMany({
          where: { payout_id: payout.id },
          data: { payout_status: PayoutStatus.PAID, paid_out_at: new Date() },
        });
      } else {
        await tx.payout.update({
          where: { id: payout.id },
          data: { status: PayoutExecutionStatus.FAILED, failure_reason: 'Viva reported bank transfer failure' },
        });
        await tx.tipDistribution.updateMany({
          where: { payout_id: payout.id },
          data: { payout_status: PayoutStatus.PENDING, payout_id: null },
        });
      }
    });
  }
}
