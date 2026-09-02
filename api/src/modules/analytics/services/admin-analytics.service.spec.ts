import { AdminAnalyticsService } from './admin-analytics.service';

describe('AdminAnalyticsService', () => {
    let service: AdminAnalyticsService;
    let prisma: any;

    beforeEach(() => {
        prisma = {
            tip: { groupBy: jest.fn().mockResolvedValue([]) },
            paymentTransaction: {
                groupBy: jest.fn().mockResolvedValue([]),
                findMany: jest.fn().mockResolvedValue([]),
            },
            tipDistribution: { findMany: jest.fn().mockResolvedValue([]) },
            payout: { groupBy: jest.fn().mockResolvedValue([]) },
            user: { count: jest.fn().mockResolvedValue(0) },
            store: { count: jest.fn().mockResolvedValue(0) },
            organization: { count: jest.fn().mockResolvedValue(0) },
            payoutAccount: { count: jest.fn().mockResolvedValue(0) },
        };

        service = new AdminAnalyticsService(prisma);
    });

    describe('overview — processing_fees_total', () => {
        it('falls back to the estimated fee when Viva never confirmed it (the common case)', async () => {
            prisma.tip.groupBy.mockResolvedValue([
                { currency: 'EUR', _sum: { amount: 1000 }, _count: { _all: 1 }, _avg: { amount: 1000 } },
            ]);
            prisma.paymentTransaction.findMany.mockResolvedValue([
                { currency: 'EUR', processor_fee_confirmed: false, processor_fee_confirmed_amount: null, processor_fee_estimated: 15 },
            ]);

            const result = await service.overview({ period: '30d' });

            expect(prisma.paymentTransaction.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({
                        OR: [{ processor_fee_confirmed: true }, { processor_fee_estimated: { not: null } }],
                    }),
                }),
            );
            expect(result.totals.processing_fees_total).toBe(15);
        });

        it('uses the confirmed amount instead of the estimate once Viva confirms it', async () => {
            prisma.tip.groupBy.mockResolvedValue([
                { currency: 'EUR', _sum: { amount: 1000 }, _count: { _all: 1 }, _avg: { amount: 1000 } },
            ]);
            prisma.paymentTransaction.findMany.mockResolvedValue([
                { currency: 'EUR', processor_fee_confirmed: true, processor_fee_confirmed_amount: 12, processor_fee_estimated: 15 },
            ]);

            const result = await service.overview({ period: '30d' });

            expect(result.totals.processing_fees_total).toBe(12);
        });

        it('sums per currency across multiple transactions instead of overwriting', async () => {
            prisma.tip.groupBy.mockResolvedValue([
                { currency: 'EUR', _sum: { amount: 2000 }, _count: { _all: 2 }, _avg: { amount: 1000 } },
            ]);
            prisma.paymentTransaction.findMany.mockResolvedValue([
                { currency: 'EUR', processor_fee_confirmed: false, processor_fee_confirmed_amount: null, processor_fee_estimated: 15 },
                { currency: 'EUR', processor_fee_confirmed: true, processor_fee_confirmed_amount: 12, processor_fee_estimated: 15 },
            ]);

            const result = await service.overview({ period: '30d' });

            expect(result.totals.processing_fees_total).toBe(27);
        });

        it('treats a null estimate on an unconfirmed row as zero, not a crash', async () => {
            prisma.tip.groupBy.mockResolvedValue([
                { currency: 'EUR', _sum: { amount: 1000 }, _count: { _all: 1 }, _avg: { amount: 1000 } },
            ]);
            prisma.paymentTransaction.findMany.mockResolvedValue([
                { currency: 'EUR', processor_fee_confirmed: false, processor_fee_confirmed_amount: null, processor_fee_estimated: null },
            ]);

            const result = await service.overview({ period: '30d' });

            expect(result.totals.processing_fees_total).toBe(0);
        });
    });
});
