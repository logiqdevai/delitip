import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { AccessControlService, AuthUser } from '@/shared/services/access-control/access-control.service';
import { paginate, PaginationQueryType } from '@/shared/utils/pagination/pagination-query.schema';
import { AlertType, OrganizationRole, ReviewSentiment } from 'generated/prisma';
import { GenerateInsightDto } from './dto/generate-insight.dto';

const DEFAULT_PERIOD_DAYS = 7;
const SATISFACTION_DROP_ALERT_THRESHOLD_PERCENT = -10;

@Injectable()
export class InsightsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly accessControl: AccessControlService,
    ) { }

    async findAll(user: AuthUser, storeId: string, query: PaginationQueryType) {
        await this.accessControl.assertStoreAccess(user, storeId);

        const where = { store_id: storeId };

        const [items, total] = await Promise.all([
            this.prisma.insightSummary.findMany({
                where,
                orderBy: { period_end: 'desc' },
                skip: (query.page - 1) * query.limit,
                take: query.limit,
            }),
            this.prisma.insightSummary.count({ where }),
        ]);

        return paginate(items, total, query);
    }

    // NOTE: "AI Feedback Analysis" (§20) here is purely deterministic, rule-based
    // aggregation over the database — there is no call to any LLM/AI provider.
    // The summary text is templated from computed numbers.
    async generate(user: AuthUser, storeId: string, dto: GenerateInsightDto) {
        await this.accessControl.assertStoreAccess(user, storeId, [
            OrganizationRole.OWNER,
            OrganizationRole.STORE_MANAGER,
        ]);

        const periodEnd = dto.period_end ? new Date(dto.period_end) : new Date();
        const periodStart = dto.period_start
            ? new Date(dto.period_start)
            : new Date(periodEnd.getTime() - DEFAULT_PERIOD_DAYS * 24 * 60 * 60 * 1000);

        const periodLengthMs = periodEnd.getTime() - periodStart.getTime();
        const previousPeriodEnd = new Date(periodStart.getTime());
        const previousPeriodStart = new Date(periodStart.getTime() - periodLengthMs);

        const [currentAgg, previousAgg] = await Promise.all([
            this.prisma.review.aggregate({
                where: { store_id: storeId, created_at: { gte: periodStart, lte: periodEnd } },
                _avg: { rating: true },
            }),
            this.prisma.review.aggregate({
                where: { store_id: storeId, created_at: { gte: previousPeriodStart, lte: previousPeriodEnd } },
                _avg: { rating: true },
            }),
        ]);

        const currentAvg = currentAgg._avg.rating;
        const previousAvg = previousAgg._avg.rating;

        const satisfactionChangePercent =
            previousAvg && currentAvg !== null
                ? Math.round(((currentAvg - previousAvg) / previousAvg) * 10000) / 100
                : null;

        const reviewsInPeriod = await this.prisma.review.findMany({
            where: { store_id: storeId, created_at: { gte: periodStart, lte: periodEnd } },
            select: { id: true },
        });
        const reviewIds = reviewsInPeriod.map((r) => r.id);

        const { topPraise, topComplaint } = await this.findTopTags(reviewIds);
        const topEmployeeName = await this.findTopEmployee(storeId, periodStart, periodEnd);

        const summary = this.buildSummary(satisfactionChangePercent, topPraise, topComplaint, topEmployeeName);

        const insight = await this.prisma.insightSummary.create({
            data: {
                store_id: storeId,
                period_start: periodStart,
                period_end: periodEnd,
                summary,
                satisfaction_change_percent: satisfactionChangePercent,
                top_praise: topPraise,
                top_complaint: topComplaint,
            },
        });

        if (satisfactionChangePercent !== null && satisfactionChangePercent < SATISFACTION_DROP_ALERT_THRESHOLD_PERCENT) {
            try {
                await this.maybeCreateDropAlert(storeId, satisfactionChangePercent);
            } catch {
                // Never fail insight generation over a best-effort side-effect alert.
            }
        }

        return insight;
    }

    private async findTopTags(reviewIds: string[]): Promise<{ topPraise: string | null; topComplaint: string | null }> {
        if (reviewIds.length === 0) return { topPraise: null, topComplaint: null };

        const assignments = await this.prisma.reviewTagAssignment.findMany({
            where: { review_id: { in: reviewIds } },
            include: { review_tag: true },
        });

        const positiveCounts = new Map<string, number>();
        const negativeCounts = new Map<string, number>();

        for (const assignment of assignments) {
            const tag = assignment.review_tag;
            if (tag.sentiment === ReviewSentiment.POSITIVE) {
                positiveCounts.set(tag.name, (positiveCounts.get(tag.name) ?? 0) + 1);
            } else if (tag.sentiment === ReviewSentiment.NEGATIVE) {
                negativeCounts.set(tag.name, (negativeCounts.get(tag.name) ?? 0) + 1);
            }
        }

        return {
            topPraise: this.topEntry(positiveCounts),
            topComplaint: this.topEntry(negativeCounts),
        };
    }

    private topEntry(counts: Map<string, number>): string | null {
        let top: string | null = null;
        let max = 0;
        for (const [name, count] of counts.entries()) {
            if (count > max) {
                max = count;
                top = name;
            }
        }
        return top;
    }

    private async findTopEmployee(storeId: string, periodStart: Date, periodEnd: Date): Promise<string | null> {
        const grouped = await this.prisma.review.groupBy({
            by: ['employee_id'],
            where: {
                store_id: storeId,
                created_at: { gte: periodStart, lte: periodEnd },
                rating: { gte: 4 },
                employee_id: { not: null },
            },
            _count: { _all: true },
        });

        let topEmployeeId: string | null = null;
        let maxCount = 0;
        for (const group of grouped) {
            if (group._count._all > maxCount) {
                maxCount = group._count._all;
                topEmployeeId = group.employee_id;
            }
        }
        if (!topEmployeeId) return null;

        const employee = await this.prisma.employee.findUnique({
            where: { id: topEmployeeId },
            select: { full_name: true },
        });

        return employee?.full_name ?? null;
    }

    private buildSummary(
        changePercent: number | null,
        topPraise: string | null,
        topComplaint: string | null,
        topEmployeeName: string | null,
    ): string {
        const sentences: string[] = [];

        if (changePercent === null) {
            sentences.push('Not enough data yet to compare against the previous period.');
        } else {
            const direction = changePercent >= 0 ? 'increased' : 'decreased';
            sentences.push(`Customer satisfaction ${direction} by ${Math.abs(changePercent)}%.`);
        }

        if (topPraise) sentences.push(`Customers particularly praised ${topPraise}.`);
        if (topComplaint) sentences.push(`The most common complaint was ${topComplaint}.`);
        if (topEmployeeName) sentences.push(`${topEmployeeName} received the highest number of positive mentions.`);

        return sentences.join(' ').trim();
    }

    private async maybeCreateDropAlert(storeId: string, changePercent: number) {
        const preference = await this.prisma.alertPreference.findFirst({
            where: { store_id: storeId, alert_type: AlertType.NEGATIVE_SATISFACTION_DROP },
        });
        const isEnabled = preference ? preference.is_enabled : true;
        if (!isEnabled) return;

        const store = await this.prisma.store.findUnique({ where: { id: storeId }, select: { name: true } });
        if (!store) return;

        await this.prisma.alert.create({
            data: {
                store_id: storeId,
                type: AlertType.NEGATIVE_SATISFACTION_DROP,
                title: 'Customer satisfaction dropped',
                message: `Customer satisfaction at ${store.name} has dropped ${Math.abs(changePercent)}% below the previous period.`,
            },
        });
    }
}
