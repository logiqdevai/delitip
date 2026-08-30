import { ForbiddenException } from '@nestjs/common';
import { AuthRole, TipStatus } from 'generated/prisma';
import { AnalyticsService } from './analytics.service';
import { bucketKey } from '../utils/period.utils';

describe('AnalyticsService', () => {
    let service: AnalyticsService;
    let prisma: any;
    let accessControl: any;

    const user = { id: 'u1', role: AuthRole.USER };

    beforeEach(() => {
        prisma = {
            tip: { aggregate: jest.fn(), findMany: jest.fn(), count: jest.fn() },
            review: { aggregate: jest.fn(), findMany: jest.fn(), count: jest.fn() },
            employee: { findMany: jest.fn() },
            store: { findMany: jest.fn().mockResolvedValue([]) },
        };
        accessControl = {
            assertOrgAccess: jest.fn(),
            getAccessibleStoreIds: jest.fn().mockResolvedValue(['store1', 'store2']),
        };
        service = new AnalyticsService(prisma, accessControl);
    });

    describe('resolveStoreIds (exercised via overview)', () => {
        it('checks org access and uses every accessible store when no store_id filter is given', async () => {
            prisma.tip.aggregate.mockResolvedValue({ _sum: { amount: null }, _count: { _all: 0 } });
            prisma.review.aggregate.mockResolvedValue({ _avg: { rating: null }, _count: { _all: 0 } });
            prisma.tip.findMany.mockResolvedValue([]);
            prisma.review.findMany.mockResolvedValue([]);

            await service.overview(user, 'org1', { period: '7d' } as any);

            expect(accessControl.assertOrgAccess).toHaveBeenCalledWith(user, 'org1');
            expect(accessControl.getAccessibleStoreIds).toHaveBeenCalledWith(user, 'org1');
            expect(prisma.tip.aggregate).toHaveBeenCalledWith(
                expect.objectContaining({ where: expect.objectContaining({ store_id: { in: ['store1', 'store2'] } }) }),
            );
        });

        it('narrows to a single store_id when provided and accessible', async () => {
            prisma.tip.aggregate.mockResolvedValue({ _sum: { amount: null }, _count: { _all: 0 } });
            prisma.review.aggregate.mockResolvedValue({ _avg: { rating: null }, _count: { _all: 0 } });
            prisma.tip.findMany.mockResolvedValue([]);
            prisma.review.findMany.mockResolvedValue([]);

            await service.overview(user, 'org1', { period: '7d', store_id: 'store1' } as any);

            expect(prisma.tip.aggregate).toHaveBeenCalledWith(
                expect.objectContaining({ where: expect.objectContaining({ store_id: { in: ['store1'] } }) }),
            );
        });

        it('throws ForbiddenException when store_id is not in the accessible set', async () => {
            await expect(
                service.overview(user, 'org1', { period: '7d', store_id: 'store-not-mine' } as any),
            ).rejects.toThrow(ForbiddenException);
        });
    });

    describe('overview', () => {
        it('aggregates tips/reviews and counts distinct recognized employees across both', async () => {
            prisma.tip.aggregate.mockResolvedValue({ _sum: { amount: 5000 }, _count: { _all: 3 } });
            prisma.review.aggregate.mockResolvedValue({ _avg: { rating: 4.5 }, _count: { _all: 2 } });
            prisma.tip.findMany.mockResolvedValue([{ employee_id: 'e1' }, { employee_id: 'e2' }]);
            prisma.review.findMany.mockResolvedValue([{ employee_id: 'e2' }, { employee_id: 'e3' }]);

            const result = await service.overview(user, 'org1', { period: '7d' } as any);

            expect(result).toEqual({
                tips_total_amount: 5000,
                transactions_count: 3,
                reviews_count: 2,
                average_rating: 4.5,
                employees_recognized: 3, // e1, e2, e3 — deduplicated
            });
        });

        it('defaults sums/averages to 0 when there is no data', async () => {
            prisma.tip.aggregate.mockResolvedValue({ _sum: { amount: null }, _count: { _all: 0 } });
            prisma.review.aggregate.mockResolvedValue({ _avg: { rating: null }, _count: { _all: 0 } });
            prisma.tip.findMany.mockResolvedValue([]);
            prisma.review.findMany.mockResolvedValue([]);

            const result = await service.overview(user, 'org1', { period: '7d' } as any);

            expect(result.tips_total_amount).toBe(0);
            expect(result.average_rating).toBe(0);
            expect(result.employees_recognized).toBe(0);
        });

        it('scopes the tip aggregate to COMPLETED tips only', async () => {
            prisma.tip.aggregate.mockResolvedValue({ _sum: { amount: null }, _count: { _all: 0 } });
            prisma.review.aggregate.mockResolvedValue({ _avg: { rating: null }, _count: { _all: 0 } });
            prisma.tip.findMany.mockResolvedValue([]);
            prisma.review.findMany.mockResolvedValue([]);

            await service.overview(user, 'org1', { period: '7d' } as any);

            expect(prisma.tip.aggregate).toHaveBeenCalledWith(
                expect.objectContaining({ where: expect.objectContaining({ status: TipStatus.COMPLETED }) }),
            );
        });
    });

    describe('trends', () => {
        const now = new Date('2026-06-15T12:00:00Z');

        beforeEach(() => {
            jest.useFakeTimers().setSystemTime(now);
        });

        afterEach(() => {
            jest.useRealTimers();
        });

        it('buckets tip amounts by day for metric=tips', async () => {
            const d1 = new Date('2026-06-14T08:00:00Z');
            const d2 = new Date('2026-06-14T20:00:00Z');
            const d3 = new Date('2026-06-15T09:00:00Z');
            prisma.tip.findMany.mockResolvedValue([
                { amount: 100, created_at: d1 },
                { amount: 200, created_at: d2 },
                { amount: 50, created_at: d3 },
            ]);

            const result = await service.trends(user, 'org1', {
                period: '7d',
                metric: 'tips',
                group_by: 'day',
            } as any);

            expect(result).toEqual([
                { bucket: bucketKey(d1, 'day'), value: 300 },
                { bucket: bucketKey(d3, 'day'), value: 50 },
            ]);
            expect(prisma.tip.findMany).toHaveBeenCalledWith(
                expect.objectContaining({ where: expect.objectContaining({ status: TipStatus.COMPLETED }) }),
            );
        });

        it('buckets review counts by day for metric=reviews', async () => {
            const d1 = new Date('2026-06-15T09:00:00Z');
            prisma.review.findMany.mockResolvedValue([{ created_at: d1 }, { created_at: d1 }]);

            const result = await service.trends(user, 'org1', {
                period: '7d',
                metric: 'reviews',
                group_by: 'day',
            } as any);

            expect(result).toEqual([{ bucket: bucketKey(d1, 'day'), value: 2 }]);
        });

        it('buckets average rating by day for any other metric (rating)', async () => {
            const d1 = new Date('2026-06-15T09:00:00Z');
            prisma.review.findMany.mockResolvedValue([
                { rating: 4, created_at: d1 },
                { rating: 5, created_at: d1 },
            ]);

            const result = await service.trends(user, 'org1', {
                period: '7d',
                metric: 'rating',
                group_by: 'day',
            } as any);

            expect(result).toEqual([{ bucket: bucketKey(d1, 'day'), value: 4.5 }]);
        });
    });

    describe('employeesPerformance', () => {
        it('returns per-employee stats sorted by tips_total descending', async () => {
            prisma.employee.findMany.mockResolvedValue([
                { id: 'e1', full_name: { en: 'Alice' }, store_id: 'store1' },
                { id: 'e2', full_name: { en: 'Bob' }, store_id: 'store1' },
            ]);
            prisma.store.findMany.mockResolvedValue([{ id: 'store1', primary_language: 'EN' }]);
            prisma.tip.aggregate
                .mockResolvedValueOnce({ _sum: { amount: 100 } }) // e1
                .mockResolvedValueOnce({ _sum: { amount: 900 } }); // e2
            prisma.review.aggregate
                .mockResolvedValueOnce({ _avg: { rating: 4 }, _count: { _all: 1 } })
                .mockResolvedValueOnce({ _avg: { rating: 5 }, _count: { _all: 2 } });

            const result = await service.employeesPerformance(user, 'org1', { period: '7d' } as any);

            expect(result.map((r) => r.employee_id)).toEqual(['e2', 'e1']);
            expect(result[0]).toMatchObject({ employee_id: 'e2', employee_name: 'Bob', tips_total: 900 });
        });

        it('only queries active employees in the accessible stores', async () => {
            prisma.employee.findMany.mockResolvedValue([]);

            await service.employeesPerformance(user, 'org1', { period: '7d' } as any);

            expect(prisma.employee.findMany).toHaveBeenCalledWith({
                where: { store_id: { in: ['store1', 'store2'] }, is_active: true },
            });
        });
    });

    describe('storesPerformance', () => {
        it('checks org access directly (not via resolveStoreIds/store_id filtering) and rolls up every accessible store', async () => {
            prisma.store.findMany.mockResolvedValue([{ id: 'store1', name: 'Main St' }]);
            prisma.tip.aggregate.mockResolvedValue({ _sum: { amount: 500 } });
            prisma.review.aggregate.mockResolvedValue({ _avg: { rating: 3.5 } });

            const result = await service.storesPerformance(user, 'org1', { period: '7d' } as any);

            expect(accessControl.assertOrgAccess).toHaveBeenCalledWith(user, 'org1');
            expect(result).toEqual([{ store_id: 'store1', store_name: 'Main St', tips_total: 500, average_rating: 3.5 }]);
        });
    });

    describe('experienceScore', () => {
        it('computes a weighted 0-100 score with a breakdown and explanation', async () => {
            prisma.tip.count.mockResolvedValue(10); // full marks tip activity component
            prisma.review.aggregate.mockResolvedValue({ _avg: { rating: 5 }, _count: { _all: 4 } });
            prisma.review.count.mockResolvedValue(4); // all 4 reviews are >= 4 stars

            const result = await service.experienceScore(user, 'org1', { period: '7d' } as any);

            // ratingComponent = 100 (5/5*100), tipActivityComponent = 100 (10/10*100), positiveReviewRatioComponent = 100
            // score = 100*0.5 + 100*0.2 + 100*0.3 = 100
            expect(result.score).toBe(100);
            expect(result.breakdown).toEqual({
                rating_component: 100,
                tip_activity_component: 100,
                positive_review_ratio_component: 100,
            });
            expect(result.explanation).toContain('5.0/5 average rating');
            expect(result.explanation).toContain('4 reviews');
            expect(result.explanation).toContain('10 completed tips');
        });

        it('zeroes out the rating and positive-review components when there are no reviews', async () => {
            prisma.tip.count.mockResolvedValue(0);
            prisma.review.aggregate.mockResolvedValue({ _avg: { rating: null }, _count: { _all: 0 } });
            prisma.review.count.mockResolvedValue(0);

            const result = await service.experienceScore(user, 'org1', { period: '7d' } as any);

            expect(result.score).toBe(0);
            expect(result.breakdown).toEqual({
                rating_component: 0,
                tip_activity_component: 0,
                positive_review_ratio_component: 0,
            });
        });

        it('caps the tip activity component at 100 even with more than 10 completed tips', async () => {
            prisma.tip.count.mockResolvedValue(50);
            prisma.review.aggregate.mockResolvedValue({ _avg: { rating: null }, _count: { _all: 0 } });
            prisma.review.count.mockResolvedValue(0);

            const result = await service.experienceScore(user, 'org1', { period: '7d' } as any);

            expect(result.breakdown.tip_activity_component).toBe(100);
        });

        it('singularizes "review"/"tip" in the explanation when the count is exactly 1', async () => {
            prisma.tip.count.mockResolvedValue(1);
            prisma.review.aggregate.mockResolvedValue({ _avg: { rating: 4 }, _count: { _all: 1 } });
            prisma.review.count.mockResolvedValue(1);

            const result = await service.experienceScore(user, 'org1', { period: '7d' } as any);

            expect(result.explanation).toContain('1 review this period');
            expect(result.explanation).toContain('1 completed tip.');
        });
    });
});
