import { Prisma, PayoutExecutionStatus, PayoutStatus, TipStatus } from 'generated/prisma';
import { PaymentWebhooksService } from './payment-webhooks.service';
import { VivaWebhookEventTypeId } from '../interfaces/viva-webhook-event-types.interface';

function uniqueConstraintError() {
    return new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        clientVersion: '7.0.0',
        meta: { target: ['message_id'] },
    });
}

describe('PaymentWebhooksService', () => {
    let service: PaymentWebhooksService;
    let prisma: any;
    let vivaTransactions: any;
    let platformFinanceConfig: any;
    let tipsService: any;

    beforeEach(() => {
        prisma = {
            webhookEvent: { create: jest.fn(), update: jest.fn() },
            tip: { findUnique: jest.fn(), findFirst: jest.fn(), update: jest.fn() },
            paymentTransaction: { update: jest.fn(), findFirst: jest.fn() },
            distributionRuleRecipient: { findMany: jest.fn().mockResolvedValue([]) },
            tipDistribution: { createMany: jest.fn(), updateMany: jest.fn() },
            refund: { findUnique: jest.fn(), update: jest.fn() },
            payout: { findFirst: jest.fn(), update: jest.fn() },
            $transaction: jest.fn((arg) => (Array.isArray(arg) ? Promise.all(arg) : arg(prisma))),
        };
        vivaTransactions = { getTransaction: jest.fn() };
        platformFinanceConfig = {
            getProcessorFeeEstimatePercentage: jest.fn().mockReturnValue(1.5),
            getProcessorFeeEstimateFixedAmount: jest.fn().mockReturnValue(24),
        };
        tipsService = { triggerPerformanceChangeAlert: jest.fn().mockResolvedValue(undefined) };

        service = new PaymentWebhooksService(prisma, vivaTransactions, platformFinanceConfig, tipsService);
        prisma.webhookEvent.create.mockResolvedValue({ id: 'we1' });
    });

    describe('process (idempotency)', () => {
        it('records a new WebhookEvent and dispatches processing', async () => {
            const payload = { EventTypeId: 99999, MessageId: 'm1', EventData: {} };

            await service.process(payload as any);

            expect(prisma.webhookEvent.create).toHaveBeenCalledWith(
                expect.objectContaining({ data: expect.objectContaining({ message_id: 'm1', event_type_id: 99999 }) }),
            );
            expect(prisma.webhookEvent.update).toHaveBeenCalledWith(
                expect.objectContaining({ where: { id: 'we1' }, data: expect.objectContaining({ processed_at: expect.any(Date) }) }),
            );
        });

        it('no-ops silently when the MessageId was already recorded', async () => {
            prisma.webhookEvent.create.mockRejectedValue(uniqueConstraintError());

            await service.process({ EventTypeId: 1796, MessageId: 'duplicate', EventData: {} } as any);

            expect(vivaTransactions.getTransaction).not.toHaveBeenCalled();
            expect(prisma.webhookEvent.update).not.toHaveBeenCalled();
        });

        it('rethrows non-P2002 errors from the WebhookEvent insert', async () => {
            prisma.webhookEvent.create.mockRejectedValue(new Error('db down'));

            await expect(service.process({ EventTypeId: 1796, MessageId: 'm1' } as any)).rejects.toThrow('db down');
        });

        it('records a processing_error instead of throwing when dispatch fails', async () => {
            vivaTransactions.getTransaction.mockRejectedValue(new Error('viva unreachable'));

            await service.process({ EventTypeId: 1796, MessageId: 'm1', EventData: { TransactionId: 't1' } } as any);

            expect(prisma.webhookEvent.update).toHaveBeenCalledWith(
                expect.objectContaining({ data: expect.objectContaining({ processing_error: 'viva unreachable' }) }),
            );
        });
    });

    describe('applyVerifiedTransaction (1796 payment created)', () => {
        // Viva's checkout v2 GET /transactions/{id} reports `amount` in major
        // currency units (confirmed against a real response: 20.00 for a
        // €20.00 tip) — 10 here represents a €10.00 charge against a 1000
        // (minor-unit) gross_amount.
        const transaction = {
            merchantTrns: 'tip1',
            statusId: 'F',
            amount: 10,
            orderCode: 123,
            authorizationId: 'auth1',
        };

        it('is a no-op when no matching Tip/PaymentTransaction is found', async () => {
            prisma.tip.findUnique.mockResolvedValue(null);

            await service.applyVerifiedTransaction(transaction as any);

            expect(prisma.$transaction).not.toHaveBeenCalled();
        });

        it('is a no-op when the tip is already COMPLETED (duplicate delivery / sweep race)', async () => {
            prisma.tip.findUnique.mockResolvedValue({
                id: 'tip1',
                status: TipStatus.COMPLETED,
                payment_transaction: { gross_amount: 1000 },
            });

            await service.applyVerifiedTransaction(transaction as any);

            expect(prisma.$transaction).not.toHaveBeenCalled();
        });

        it('does not transition state when the Viva status is not a success state', async () => {
            prisma.tip.findUnique.mockResolvedValue({
                id: 'tip1',
                status: TipStatus.CREATED,
                payment_transaction: { id: 'pt1', gross_amount: 1000 },
            });

            await service.applyVerifiedTransaction({ ...transaction, statusId: 'A' } as any);

            expect(prisma.tip.update).not.toHaveBeenCalled();
        });

        it('does not transition state on an amount mismatch', async () => {
            prisma.tip.findUnique.mockResolvedValue({
                id: 'tip1',
                status: TipStatus.CREATED,
                payment_transaction: { id: 'pt1', gross_amount: 2000 },
            });

            await service.applyVerifiedTransaction(transaction as any);

            expect(prisma.tip.update).not.toHaveBeenCalled();
        });

        it('completes the tip, finalizes the PaymentTransaction, and freezes distributions on the net amount', async () => {
            prisma.tip.findUnique.mockResolvedValue({
                id: 'tip1',
                status: TipStatus.CREATED,
                distribution_rule_id: null,
                selected_employee_ids: null,
                employee_id: null,
                payment_transaction: { id: 'pt1', gross_amount: 1000, commission_amount: 50 },
            });

            await service.applyVerifiedTransaction(transaction as any);

            expect(prisma.tip.update).toHaveBeenCalledWith(
                expect.objectContaining({ where: { id: 'tip1' }, data: expect.objectContaining({ status: TipStatus.COMPLETED }) }),
            );
            expect(prisma.paymentTransaction.update).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: { id: 'pt1' },
                    data: expect.objectContaining({ status: 'SUCCEEDED', processor_fee_estimated: 39, net_distributable_amount: 911 }),
                }),
            );
            // no recipients configured -> falls back to 100% STORE
            expect(prisma.tipDistribution.createMany).toHaveBeenCalledWith({
                data: [expect.objectContaining({ recipient_type: 'STORE', amount: 911 })],
            });
            expect(tipsService.triggerPerformanceChangeAlert).toHaveBeenCalled();
        });

        it('converts major-unit transaction.amount to minor units before comparing (regression: was never matching any real payment)', async () => {
            prisma.tip.findUnique.mockResolvedValue({
                id: 'tip1',
                status: TipStatus.CREATED,
                distribution_rule_id: null,
                selected_employee_ids: null,
                employee_id: null,
                payment_transaction: { id: 'pt1', gross_amount: 2000, commission_amount: 100 },
            });

            await service.applyVerifiedTransaction({ ...transaction, amount: 20 } as any);

            expect(prisma.tip.update).toHaveBeenCalledWith(
                expect.objectContaining({ where: { id: 'tip1' }, data: expect.objectContaining({ status: TipStatus.COMPLETED }) }),
            );
        });
    });

    describe('1798 transaction failed', () => {
        it('marks the Tip and PaymentTransaction FAILED', async () => {
            vivaTransactions.getTransaction.mockResolvedValue({ merchantTrns: 'tip1', statusId: 'E' });
            prisma.tip.findUnique.mockResolvedValue({
                id: 'tip1',
                status: TipStatus.CREATED,
                payment_transaction: { id: 'pt1' },
            });

            await service.process({
                EventTypeId: VivaWebhookEventTypeId.TRANSACTION_FAILED,
                MessageId: 'm2',
                EventData: { TransactionId: 't1' },
            } as any);

            expect(prisma.tip.update).toHaveBeenCalledWith({ where: { id: 'tip1' }, data: { status: TipStatus.FAILED } });
        });
    });

    describe('1799 transaction price calculated', () => {
        it('records the confirmed processor fee and net amount', async () => {
            prisma.paymentTransaction.findFirst.mockResolvedValue({
                id: 'pt1',
                gross_amount: 1000,
                commission_amount: 50,
                platform_fee_percentage: 5,
            });

            await service.process({
                EventTypeId: VivaWebhookEventTypeId.TRANSACTION_PRICE_CALCULATED,
                MessageId: 'm3',
                EventData: { TransactionId: 't1', CommissionAmount: 20 },
            } as any);

            expect(prisma.paymentTransaction.update).toHaveBeenCalledWith({
                where: { id: 'pt1' },
                data: {
                    processor_fee_confirmed_amount: 20,
                    processor_fee_confirmed: true,
                    payment_fee_percentage: 2,
                    total_fee_amount: 70,
                    total_fee_percentage: 7,
                    total_fee_percentage_sum: 7,
                    net_distributable_amount: 930,
                },
            });
        });

        it('leaves processor_fee_confirmed unset when no fee field can be extracted', async () => {
            prisma.paymentTransaction.findFirst.mockResolvedValue({ id: 'pt1', gross_amount: 1000, commission_amount: 50 });

            await service.process({
                EventTypeId: VivaWebhookEventTypeId.TRANSACTION_PRICE_CALCULATED,
                MessageId: 'm4',
                EventData: { TransactionId: 't1' },
            } as any);

            expect(prisma.paymentTransaction.update).not.toHaveBeenCalled();
        });
    });

    describe('1797 reversal created', () => {
        it('confirms the matching local Refund', async () => {
            prisma.refund.findUnique.mockResolvedValue({ id: 'refund1' });

            await service.process({
                EventTypeId: VivaWebhookEventTypeId.TRANSACTION_REVERSAL_CREATED,
                MessageId: 'm5',
                EventData: { MerchantTrns: 'refund1' },
            } as any);

            expect(prisma.refund.update).toHaveBeenCalledWith({ where: { id: 'refund1' }, data: { provider_status: 'CONFIRMED' } });
        });
    });

    describe('4865 order updated (customer cancelled checkout)', () => {
        it('cancels a still-in-flight tip found via MerchantTrns', async () => {
            prisma.tip.findUnique.mockResolvedValue({
                id: 'tip1',
                status: TipStatus.CREATED,
                payment_transaction: { id: 'pt1' },
            });

            await service.process({
                EventTypeId: VivaWebhookEventTypeId.ORDER_UPDATED,
                MessageId: 'm8',
                EventData: { MerchantTrns: 'tip1', OrderCode: 123, IsCancelled: true },
            } as any);

            expect(prisma.tip.findUnique).toHaveBeenCalledWith(
                expect.objectContaining({ where: { id: 'tip1' } }),
            );
            expect(prisma.tip.update).toHaveBeenCalledWith({ where: { id: 'tip1' }, data: { status: TipStatus.CANCELLED } });
            expect(prisma.paymentTransaction.update).toHaveBeenCalledWith({
                where: { id: 'pt1' },
                data: { status: 'CANCELLED' },
            });
        });

        it('falls back to looking the tip up by order code when MerchantTrns is missing', async () => {
            prisma.tip.findFirst.mockResolvedValue({
                id: 'tip1',
                status: TipStatus.PROCESSING,
                payment_transaction: { id: 'pt1' },
            });

            await service.process({
                EventTypeId: VivaWebhookEventTypeId.ORDER_UPDATED,
                MessageId: 'm9',
                EventData: { OrderCode: 456, IsCancelled: true },
            } as any);

            expect(prisma.tip.findFirst).toHaveBeenCalledWith(
                expect.objectContaining({ where: { payment_transaction: { provider_order_code: '456' } } }),
            );
            expect(prisma.tip.update).toHaveBeenCalledWith({ where: { id: 'tip1' }, data: { status: TipStatus.CANCELLED } });
        });

        it('is a no-op when IsCancelled is not true', async () => {
            await service.process({
                EventTypeId: VivaWebhookEventTypeId.ORDER_UPDATED,
                MessageId: 'm10',
                EventData: { MerchantTrns: 'tip1', IsCancelled: false },
            } as any);

            expect(prisma.tip.update).not.toHaveBeenCalled();
        });

        it('never overrides a tip that already reached a terminal status', async () => {
            prisma.tip.findUnique.mockResolvedValue({
                id: 'tip1',
                status: TipStatus.COMPLETED,
                payment_transaction: { id: 'pt1' },
            });

            await service.process({
                EventTypeId: VivaWebhookEventTypeId.ORDER_UPDATED,
                MessageId: 'm11',
                EventData: { MerchantTrns: 'tip1', IsCancelled: true },
            } as any);

            expect(prisma.tip.update).not.toHaveBeenCalled();
        });
    });

    describe('769 bank transfer executed', () => {
        it('completes the Payout and marks its distributions PAID on success', async () => {
            prisma.payout.findFirst.mockResolvedValue({ id: 'payout1', status: PayoutExecutionStatus.PROCESSING });

            await service.process({
                EventTypeId: VivaWebhookEventTypeId.COMMAND_BANK_TRANSFER_EXECUTED,
                MessageId: 'm6',
                EventData: { BankCommandId: 'cmd1', Success: true },
            } as any);

            expect(prisma.payout.update).toHaveBeenCalledWith(
                expect.objectContaining({ where: { id: 'payout1' }, data: expect.objectContaining({ status: PayoutExecutionStatus.COMPLETED }) }),
            );
            expect(prisma.tipDistribution.updateMany).toHaveBeenCalledWith(
                expect.objectContaining({ where: { payout_id: 'payout1' }, data: expect.objectContaining({ payout_status: PayoutStatus.PAID }) }),
            );
        });

        it('fails the Payout and releases its distributions back to PENDING on failure', async () => {
            prisma.payout.findFirst.mockResolvedValue({ id: 'payout1', status: PayoutExecutionStatus.PROCESSING });

            await service.process({
                EventTypeId: VivaWebhookEventTypeId.COMMAND_BANK_TRANSFER_EXECUTED,
                MessageId: 'm7',
                EventData: { BankCommandId: 'cmd1', Success: false },
            } as any);

            expect(prisma.payout.update).toHaveBeenCalledWith(
                expect.objectContaining({ data: expect.objectContaining({ status: PayoutExecutionStatus.FAILED }) }),
            );
            expect(prisma.tipDistribution.updateMany).toHaveBeenCalledWith(
                expect.objectContaining({ data: expect.objectContaining({ payout_status: PayoutStatus.PENDING, payout_id: null }) }),
            );
        });
    });
});
