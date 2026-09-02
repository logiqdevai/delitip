import { TipStatus, PaymentTransactionStatus } from 'generated/prisma';
import { PaymentsReconciliationService } from './payments-reconciliation.service';
import { VivaApiException } from '@/integrations/viva/http/viva-api.exception';

describe('PaymentsReconciliationService', () => {
    let service: PaymentsReconciliationService;
    let prisma: any;
    let vivaCheckout: any;
    let paymentWebhooksService: any;

    const stuckTip = (overrides: Partial<any> = {}) => ({
        id: 'tip1',
        status: TipStatus.CREATED,
        payment_transaction: { id: 'pt1', provider_order_code: '123456' },
        ...overrides,
    });

    beforeEach(() => {
        prisma = {
            tip: { findMany: jest.fn(), findUnique: jest.fn(), update: jest.fn() },
            paymentTransaction: { update: jest.fn() },
            $transaction: jest.fn((arg) => (Array.isArray(arg) ? Promise.all(arg) : arg(prisma))),
        };
        vivaCheckout = { getOrder: jest.fn() };
        paymentWebhooksService = { applyVerifiedTransaction: jest.fn().mockResolvedValue(undefined) };

        service = new PaymentsReconciliationService(prisma, vivaCheckout, paymentWebhooksService);
    });

    describe('sweep', () => {
        it('only looks at CREATED/PROCESSING tips older than the grace period', async () => {
            prisma.tip.findMany.mockResolvedValue([]);

            await service.sweep();

            expect(prisma.tip.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({
                        status: { in: [TipStatus.CREATED, TipStatus.PROCESSING] },
                    }),
                }),
            );
        });

        it('skips a tip with no provider_order_code and does not count it as corrected', async () => {
            prisma.tip.findMany.mockResolvedValue([stuckTip({ payment_transaction: null })]);

            const result = await service.sweep();

            expect(vivaCheckout.getOrder).not.toHaveBeenCalled();
            expect(result).toEqual({ corrected: 0 });
        });

        it('applies a PAID order directly from the order GET, converting major-unit amounts to minor units', async () => {
            prisma.tip.findMany.mockResolvedValue([stuckTip()]);
            vivaCheckout.getOrder.mockResolvedValue({
                OrderCode: 123456,
                MerchantTrns: 'tip1',
                StateId: 3, // PAID — numeric on the wire, per Viva's actual response
                RequestAmount: 10.5,
                TipAmount: 10.5,
            });

            const result = await service.sweep();

            expect(paymentWebhooksService.applyVerifiedTransaction).toHaveBeenCalledWith(
                expect.objectContaining({
                    merchantTrns: 'tip1',
                    orderCode: 123456,
                    statusId: 'F',
                    amount: 1050,
                    tipAmount: 1050,
                }),
            );
            expect(result).toEqual({ corrected: 1 });
        });

        it('marks the tip FAILED when the order no longer exists at Viva (404)', async () => {
            prisma.tip.findMany.mockResolvedValue([stuckTip()]);
            prisma.tip.findUnique.mockResolvedValue(stuckTip());
            vivaCheckout.getOrder.mockRejectedValue(new VivaApiException(404, 'OrdersOrderCodeNotFound'));

            const result = await service.sweep();

            expect(prisma.tip.update).toHaveBeenCalledWith(
                expect.objectContaining({ where: { id: 'tip1' }, data: { status: TipStatus.FAILED } }),
            );
            expect(prisma.paymentTransaction.update).toHaveBeenCalledWith(
                expect.objectContaining({ data: { status: PaymentTransactionStatus.FAILED } }),
            );
            expect(result).toEqual({ corrected: 1 });
        });

        it('marks the tip CANCELLED when the order is EXPIRED or CANCELED at Viva', async () => {
            prisma.tip.findMany.mockResolvedValue([stuckTip()]);
            prisma.tip.findUnique.mockResolvedValue(stuckTip());
            vivaCheckout.getOrder.mockResolvedValue({ StateId: 1 }); // EXPIRED

            const result = await service.sweep();

            expect(prisma.tip.update).toHaveBeenCalledWith(
                expect.objectContaining({ where: { id: 'tip1' }, data: { status: TipStatus.CANCELLED } }),
            );
            expect(result).toEqual({ corrected: 1 });
        });

        it('leaves a still-PENDING order untouched and uncorrected', async () => {
            prisma.tip.findMany.mockResolvedValue([stuckTip()]);
            vivaCheckout.getOrder.mockResolvedValue({ StateId: 0 }); // PENDING

            const result = await service.sweep();

            expect(paymentWebhooksService.applyVerifiedTransaction).not.toHaveBeenCalled();
            expect(prisma.tip.update).not.toHaveBeenCalled();
            expect(result).toEqual({ corrected: 0 });
        });

        it('logs and continues when one tip fails to reconcile, without aborting the sweep', async () => {
            prisma.tip.findMany.mockResolvedValue([stuckTip({ id: 'tip1' }), stuckTip({ id: 'tip2' })]);
            vivaCheckout.getOrder
                .mockRejectedValueOnce(new Error('Viva is down'))
                .mockResolvedValueOnce({ StateId: 3, OrderCode: 1, MerchantTrns: 'tip2', RequestAmount: 1, TipAmount: 1 });

            const result = await service.sweep();

            expect(result).toEqual({ corrected: 1 });
        });
    });
});
