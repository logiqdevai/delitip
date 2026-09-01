import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { AccessControlService, AuthUser } from '@/shared/services/access-control/access-control.service';
import { resolveTranslatedText, TranslatedText } from '@/shared/utils/translation/translation.utils';
import { Language, TipStatus } from 'generated/prisma';
import { bucketCount, bucketKey, bucketSum, resolvePeriod, sortedBucketEntries } from '../utils/period.utils';
import { DashboardQueryType, PeriodQueryType } from '../dto/dashboard-query.schema';
import { TrendsQueryType } from '../dto/trends-query.schema';

@Injectable()
export class AnalyticsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly accessControl: AccessControlService,
    ) { }

    private async resolveStoreIds(user: AuthUser, organizationId: string, storeIdParam?: string): Promise<string[]> {
        await this.accessControl.assertOrgAccess(user, organizationId);
        const accessibleIds = await this.accessControl.getAccessibleStoreIds(user, organizationId);

        if (storeIdParam) {
            if (!accessibleIds.includes(storeIdParam)) {
                throw new ForbiddenException('You do not have access to this store');
            }
            return [storeIdParam];
        }

        return accessibleIds;
    }

    // §14 — top-line dashboard overview across the accessible store(s).
    async overview(user: AuthUser, organizationId: string, query: DashboardQueryType) {
        const storeIds = await this.resolveStoreIds(user, organizationId, query.store_id);
        const { gte, lte } = resolvePeriod(query.period);

        const tipWhere = { store_id: { in: storeIds }, status: TipStatus.COMPLETED, created_at: { gte, lte } };
        const reviewWhere = { store_id: { in: storeIds }, created_at: { gte, lte } };

        const [tipAgg, reviewAgg, tippedEmployees, reviewedEmployees] = await Promise.all([
            this.prisma.tip.aggregate({ where: tipWhere, _sum: { amount: true }, _count: { _all: true } }),
            this.prisma.review.aggregate({ where: reviewWhere, _avg: { rating: true }, _count: { _all: true } }),
            this.prisma.tip.findMany({
                where: { ...tipWhere, employee_id: { not: null } },
                select: { employee_id: true },
                distinct: ['employee_id'],
            }),
            this.prisma.review.findMany({
                where: { ...reviewWhere, employee_id: { not: null } },
                select: { employee_id: true },
                distinct: ['employee_id'],
            }),
        ]);

        const employeeIds = new Set<string>();
        tippedEmployees.forEach((t) => t.employee_id && employeeIds.add(t.employee_id));
        reviewedEmployees.forEach((r) => r.employee_id && employeeIds.add(r.employee_id));

        return {
            tips_total_amount: tipAgg._sum.amount ?? 0,
            transactions_count: tipAgg._count._all,
            reviews_count: reviewAgg._count._all,
            average_rating: reviewAgg._avg.rating ?? 0,
            employees_recognized: employeeIds.size,
        };
    }

    // §14 — tips/reviews/rating over time, bucketed in application code.
    async trends(user: AuthUser, organizationId: string, query: TrendsQueryType) {
        const storeIds = await this.resolveStoreIds(user, organizationId, query.store_id);
        const { gte, lte } = resolvePeriod(query.period);

        if (query.metric === 'tips') {
            const tips = await this.prisma.tip.findMany({
                where: { store_id: { in: storeIds }, status: TipStatus.COMPLETED, created_at: { gte, lte } },
                select: { amount: true, created_at: true },
            });
            return bucketSum(tips, query.group_by);
        }

        if (query.metric === 'reviews') {
            const reviews = await this.prisma.review.findMany({
                where: { store_id: { in: storeIds }, created_at: { gte, lte } },
                select: { created_at: true },
            });
            return bucketCount(reviews, query.group_by);
        }

        const reviews = await this.prisma.review.findMany({
            where: { store_id: { in: storeIds }, created_at: { gte, lte } },
            select: { rating: true, created_at: true },
        });
        return this.bucketAvg(reviews, query.group_by);
    }

    // §16 — per-employee informational stats (not a ranking); direct Tip.employee_id
    // attribution is used rather than TipDistribution for simplicity and clarity.
    async employeesPerformance(user: AuthUser, organizationId: string, query: DashboardQueryType) {
        const storeIds = await this.resolveStoreIds(user, organizationId, query.store_id);
        const { gte, lte } = resolvePeriod(query.period);

        const employees = await this.prisma.employee.findMany({
            where: { store_id: { in: storeIds }, is_active: true },
        });

        const stores = await this.prisma.store.findMany({
            where: { id: { in: storeIds } },
            select: { id: true, primary_language: true },
        });
        const languageByStore = new Map<string, Language>(stores.map((s) => [s.id, s.primary_language]));

        return Promise.all(
            employees.map(async (employee) => {
                const [tipAgg, reviewAgg] = await Promise.all([
                    this.prisma.tip.aggregate({
                        where: { employee_id: employee.id, status: TipStatus.COMPLETED, created_at: { gte, lte } },
                        _sum: { amount: true },
                    }),
                    this.prisma.review.aggregate({
                        where: { employee_id: employee.id, created_at: { gte, lte } },
                        _avg: { rating: true },
                        _count: { _all: true },
                    }),
                ]);

                return {
                    employee_id: employee.id,
                    employee_name: resolveTranslatedText(
                        employee.full_name as TranslatedText,
                        undefined,
                        languageByStore.get(employee.store_id) ?? Language.EN,
                    ),
                    store_id: employee.store_id,
                    tips_total: tipAgg._sum.amount ?? 0,
                    average_rating: reviewAgg._avg.rating ?? 0,
                    reviews_count: reviewAgg._count._all,
                };
            }),
        ).then((results) => results.sort((a, b) => b.tips_total - a.tips_total));
    }

    // §17 — per-store rollup across every accessible store.
    async storesPerformance(user: AuthUser, organizationId: string, query: PeriodQueryType) {
        await this.accessControl.assertOrgAccess(user, organizationId);
        const storeIds = await this.accessControl.getAccessibleStoreIds(user, organizationId);
        const { gte, lte } = resolvePeriod(query.period);

        const stores = await this.prisma.store.findMany({ where: { id: { in: storeIds } } });

        return Promise.all(
            stores.map(async (store) => {
                const [tipAgg, reviewAgg] = await Promise.all([
                    this.prisma.tip.aggregate({
                        where: { store_id: store.id, status: TipStatus.COMPLETED, created_at: { gte, lte } },
                        _sum: { amount: true },
                    }),
                    this.prisma.review.aggregate({
                        where: { store_id: store.id, created_at: { gte, lte } },
                        _avg: { rating: true },
                    }),
                ]);

                return {
                    store_id: store.id,
                    store_name: store.name,
                    tips_total: tipAgg._sum.amount ?? 0,
                    average_rating: reviewAgg._avg.rating ?? 0,
                };
            }),
        );
    }

    // §18 — composite 0-100 experience score plus an explanation of what's driving it.
    async experienceScore(user: AuthUser, organizationId: string, query: DashboardQueryType) {
        const storeIds = await this.resolveStoreIds(user, organizationId, query.store_id);
        const { gte, lte } = resolvePeriod(query.period);

        const [tipCount, reviewAgg, positiveReviewCount] = await Promise.all([
            this.prisma.tip.count({
                where: { store_id: { in: storeIds }, status: TipStatus.COMPLETED, created_at: { gte, lte } },
            }),
            this.prisma.review.aggregate({
                where: { store_id: { in: storeIds }, created_at: { gte, lte } },
                _avg: { rating: true },
                _count: { _all: true },
            }),
            this.prisma.review.count({
                where: { store_id: { in: storeIds }, created_at: { gte, lte }, rating: { gte: 4 } },
            }),
        ]);

        const avgRating = reviewAgg._avg.rating ?? 0;
        const reviewsCount = reviewAgg._count._all;

        const ratingComponent = reviewsCount > 0 ? (avgRating / 5) * 100 : 0;
        // 10+ completed tips in the period is treated as "full marks" for tip
        // activity — an arbitrary but reasonable baseline for a healthy period.
        const tipActivityComponent = Math.min(100, (tipCount / 10) * 100);
        const positiveReviewRatioComponent = reviewsCount > 0 ? (positiveReviewCount / reviewsCount) * 100 : 0;

        const score = Math.round(
            ratingComponent * 0.5 + tipActivityComponent * 0.2 + positiveReviewRatioComponent * 0.3,
        );

        const explanation = `Driven mainly by a ${avgRating.toFixed(1)}/5 average rating and ${reviewsCount} review${reviewsCount === 1 ? '' : 's'} this period, alongside ${tipCount} completed tip${tipCount === 1 ? '' : 's'}.`;

        return {
            score,
            breakdown: {
                rating_component: Math.round(ratingComponent * 100) / 100,
                tip_activity_component: Math.round(tipActivityComponent * 100) / 100,
                positive_review_ratio_component: Math.round(positiveReviewRatioComponent * 100) / 100,
            },
            explanation,
        };
    }

    private bucketAvg(rows: { rating: number; created_at: Date }[], groupBy: 'day' | 'week' | 'month') {
        const sums = new Map<string, number>();
        const counts = new Map<string, number>();
        for (const row of rows) {
            const key = bucketKey(row.created_at, groupBy);
            sums.set(key, (sums.get(key) ?? 0) + row.rating);
            counts.set(key, (counts.get(key) ?? 0) + 1);
        }
        return sortedBucketEntries(sums).map(([bucket, sum]) => ({
            bucket,
            value: Math.round((sum / (counts.get(bucket) ?? 1)) * 100) / 100,
        }));
    }
}
