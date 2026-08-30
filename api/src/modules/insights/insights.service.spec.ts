import { AlertType, OrganizationRole, ReviewSentiment } from 'generated/prisma';
import { InsightsService } from './insights.service';

describe('InsightsService', () => {
    let service: InsightsService;
    let prisma: any;
    let accessControl: any;

    const user = { id: 'u1', role: 'USER' } as any;

    beforeEach(() => {
        prisma = {
            insightSummary: { findMany: jest.fn(), count: jest.fn(), create: jest.fn() },
            review: { aggregate: jest.fn(), findMany: jest.fn(), groupBy: jest.fn() },
            reviewTagAssignment: { findMany: jest.fn() },
            employee: { findUnique: jest.fn() },
            alertPreference: { findFirst: jest.fn() },
            alert: { create: jest.fn() },
            store: { findUnique: jest.fn() },
        };
        accessControl = { assertStoreAccess: jest.fn() };
        service = new InsightsService(prisma, accessControl);
    });

    describe('findAll', () => {
        it('asserts store access and paginates', async () => {
            prisma.insightSummary.findMany.mockResolvedValue([{ id: 'i1' }]);
            prisma.insightSummary.count.mockResolvedValue(1);

            const result = await service.findAll(user, 'store1', { page: 1, limit: 20 } as any);

            expect(accessControl.assertStoreAccess).toHaveBeenCalledWith(user, 'store1');
            expect(prisma.insightSummary.findMany).toHaveBeenCalledWith({
                where: { store_id: 'store1' },
                orderBy: { period_end: 'desc' },
                skip: 0,
                take: 20,
            });
            expect(result.data).toEqual([{ id: 'i1' }]);
            expect(result.pagination.total).toBe(1);
        });
    });

    describe('generate', () => {
        const emptyDefaults = () => {
            prisma.review.aggregate.mockResolvedValue({ _avg: { rating: null } });
            prisma.review.findMany.mockResolvedValue([]);
            prisma.review.groupBy.mockResolvedValue([]);
            prisma.insightSummary.create.mockImplementation(({ data }: any) => Promise.resolve({ id: 'insight1', ...data }));
        };

        beforeEach(() => {
            jest.useFakeTimers().setSystemTime(new Date('2026-01-08T00:00:00.000Z'));
        });

        afterEach(() => {
            jest.useRealTimers();
        });

        it('asserts store access with OWNER/STORE_MANAGER roles', async () => {
            emptyDefaults();

            await service.generate(user, 'store1', {});

            expect(accessControl.assertStoreAccess).toHaveBeenCalledWith(user, 'store1', [
                OrganizationRole.OWNER,
                OrganizationRole.STORE_MANAGER,
            ]);
        });

        it('defaults the period to the last 7 days ending now when neither bound is given', async () => {
            emptyDefaults();

            await service.generate(user, 'store1', {});

            expect(prisma.review.aggregate).toHaveBeenNthCalledWith(1, {
                where: {
                    store_id: 'store1',
                    created_at: { gte: new Date('2026-01-01T00:00:00.000Z'), lte: new Date('2026-01-08T00:00:00.000Z') },
                },
                _avg: { rating: true },
            });
        });

        it('uses explicit period_start/period_end when provided, and derives an equal-length previous period', async () => {
            emptyDefaults();

            await service.generate(user, 'store1', {
                period_start: '2026-01-01T00:00:00.000Z',
                period_end: '2026-01-03T00:00:00.000Z',
            });

            expect(prisma.review.aggregate).toHaveBeenNthCalledWith(1, {
                where: {
                    store_id: 'store1',
                    created_at: { gte: new Date('2026-01-01T00:00:00.000Z'), lte: new Date('2026-01-03T00:00:00.000Z') },
                },
                _avg: { rating: true },
            });
            // previous period is the same 2-day length, immediately preceding
            expect(prisma.review.aggregate).toHaveBeenNthCalledWith(2, {
                where: {
                    store_id: 'store1',
                    created_at: { gte: new Date('2025-12-30T00:00:00.000Z'), lte: new Date('2026-01-01T00:00:00.000Z') },
                },
                _avg: { rating: true },
            });
        });

        it('computes satisfaction_change_percent as a rounded percentage when both averages exist', async () => {
            emptyDefaults();
            prisma.review.aggregate.mockResolvedValueOnce({ _avg: { rating: 4.4 } }).mockResolvedValueOnce({ _avg: { rating: 4.0 } });

            await service.generate(user, 'store1', {});

            expect(prisma.insightSummary.create).toHaveBeenCalledWith(
                expect.objectContaining({ data: expect.objectContaining({ satisfaction_change_percent: 10 }) }),
            );
        });

        it('sets satisfaction_change_percent to null when there is no previous-period average', async () => {
            emptyDefaults();
            prisma.review.aggregate.mockResolvedValueOnce({ _avg: { rating: 4.4 } }).mockResolvedValueOnce({ _avg: { rating: null } });

            await service.generate(user, 'store1', {});

            expect(prisma.insightSummary.create).toHaveBeenCalledWith(
                expect.objectContaining({ data: expect.objectContaining({ satisfaction_change_percent: null }) }),
            );
        });

        it('sets satisfaction_change_percent to null when there is no current-period average', async () => {
            emptyDefaults();
            prisma.review.aggregate.mockResolvedValueOnce({ _avg: { rating: null } }).mockResolvedValueOnce({ _avg: { rating: 4.0 } });

            await service.generate(user, 'store1', {});

            expect(prisma.insightSummary.create).toHaveBeenCalledWith(
                expect.objectContaining({ data: expect.objectContaining({ satisfaction_change_percent: null }) }),
            );
        });

        it('leaves top_praise/top_complaint null and skips the tag-assignment query when there are no reviews in the period', async () => {
            emptyDefaults();

            await service.generate(user, 'store1', {});

            expect(prisma.reviewTagAssignment.findMany).not.toHaveBeenCalled();
            expect(prisma.insightSummary.create).toHaveBeenCalledWith(
                expect.objectContaining({ data: expect.objectContaining({ top_praise: null, top_complaint: null }) }),
            );
        });

        it('picks the most-assigned positive tag as top_praise and negative tag as top_complaint', async () => {
            emptyDefaults();
            prisma.review.findMany.mockResolvedValue([{ id: 'r1' }, { id: 'r2' }]);
            prisma.reviewTagAssignment.findMany.mockResolvedValue([
                { review_tag: { name: 'Friendly', sentiment: ReviewSentiment.POSITIVE } },
                { review_tag: { name: 'Friendly', sentiment: ReviewSentiment.POSITIVE } },
                { review_tag: { name: 'Fast', sentiment: ReviewSentiment.POSITIVE } },
                { review_tag: { name: 'Slow', sentiment: ReviewSentiment.NEGATIVE } },
                { review_tag: { name: 'Slow', sentiment: ReviewSentiment.NEGATIVE } },
                { review_tag: { name: 'Cold food', sentiment: ReviewSentiment.NEGATIVE } },
            ]);

            await service.generate(user, 'store1', {});

            expect(prisma.insightSummary.create).toHaveBeenCalledWith(
                expect.objectContaining({ data: expect.objectContaining({ top_praise: 'Friendly', top_complaint: 'Slow' }) }),
            );
        });

        it('finds the top-reviewed employee (rating >= 4) by grouped review count', async () => {
            emptyDefaults();
            prisma.review.groupBy.mockResolvedValue([
                { employee_id: 'e1', _count: { _all: 2 } },
                { employee_id: 'e2', _count: { _all: 5 } },
            ]);
            prisma.employee.findUnique.mockResolvedValue({
                full_name: { en: 'Nikos' },
                store: { primary_language: 'EN' },
            });

            const result = await service.generate(user, 'store1', {});

            expect(prisma.employee.findUnique).toHaveBeenCalledWith({
                where: { id: 'e2' },
                select: { full_name: true, store: { select: { primary_language: true } } },
            });
            expect(result.summary).toContain('Nikos received the highest number of positive mentions.');
        });

        it('omits the top-employee sentence when there are no qualifying grouped reviews', async () => {
            emptyDefaults();

            const result = await service.generate(user, 'store1', {});

            expect(prisma.employee.findUnique).not.toHaveBeenCalled();
            expect(result.summary).not.toContain('received the highest number');
        });

        it('builds the "not enough data" sentence when satisfaction_change_percent is null', async () => {
            emptyDefaults();

            const result = await service.generate(user, 'store1', {});

            expect(result.summary).toContain('Not enough data yet to compare against the previous period.');
        });

        it('builds an "increased" sentence for a positive change and a "decreased" sentence for a negative one', async () => {
            emptyDefaults();
            prisma.review.aggregate.mockResolvedValueOnce({ _avg: { rating: 4.4 } }).mockResolvedValueOnce({ _avg: { rating: 4.0 } });
            const up = await service.generate(user, 'store1', {});
            expect(up.summary).toContain('Customer satisfaction increased by 10%.');

            emptyDefaults();
            prisma.review.aggregate.mockResolvedValueOnce({ _avg: { rating: 3.6 } }).mockResolvedValueOnce({ _avg: { rating: 4.0 } });
            const down = await service.generate(user, 'store1', {});
            expect(down.summary).toContain('Customer satisfaction decreased by 10%.');
        });

        describe('drop alert side effect', () => {
            it('does not attempt a drop alert when the change is null or above the -10% threshold', async () => {
                emptyDefaults();

                await service.generate(user, 'store1', {}); // null change

                expect(prisma.alertPreference.findFirst).not.toHaveBeenCalled();
            });

            it('creates a drop alert when the change is below -10% and no preference row exists (default enabled)', async () => {
                emptyDefaults();
                prisma.review.aggregate.mockResolvedValueOnce({ _avg: { rating: 3.0 } }).mockResolvedValueOnce({ _avg: { rating: 4.0 } }); // -25%
                prisma.alertPreference.findFirst.mockResolvedValue(null);
                prisma.store.findUnique.mockResolvedValue({ name: 'My Store' });

                await service.generate(user, 'store1', {});

                expect(prisma.alert.create).toHaveBeenCalledWith({
                    data: expect.objectContaining({
                        store_id: 'store1',
                        type: AlertType.NEGATIVE_SATISFACTION_DROP,
                        title: 'Customer satisfaction dropped',
                    }),
                });
            });

            it('skips the alert when the preference is explicitly disabled', async () => {
                emptyDefaults();
                prisma.review.aggregate.mockResolvedValueOnce({ _avg: { rating: 3.0 } }).mockResolvedValueOnce({ _avg: { rating: 4.0 } });
                prisma.alertPreference.findFirst.mockResolvedValue({ is_enabled: false });

                await service.generate(user, 'store1', {});

                expect(prisma.alert.create).not.toHaveBeenCalled();
            });

            it('skips the alert when the store no longer exists', async () => {
                emptyDefaults();
                prisma.review.aggregate.mockResolvedValueOnce({ _avg: { rating: 3.0 } }).mockResolvedValueOnce({ _avg: { rating: 4.0 } });
                prisma.alertPreference.findFirst.mockResolvedValue(null);
                prisma.store.findUnique.mockResolvedValue(null);

                await service.generate(user, 'store1', {});

                expect(prisma.alert.create).not.toHaveBeenCalled();
            });

            it('still returns the generated insight even if the drop-alert side effect throws', async () => {
                emptyDefaults();
                prisma.review.aggregate.mockResolvedValueOnce({ _avg: { rating: 3.0 } }).mockResolvedValueOnce({ _avg: { rating: 4.0 } });
                prisma.alertPreference.findFirst.mockRejectedValue(new Error('db down'));

                await expect(service.generate(user, 'store1', {})).resolves.toEqual(expect.objectContaining({ id: 'insight1' }));
            });
        });
    });
});
