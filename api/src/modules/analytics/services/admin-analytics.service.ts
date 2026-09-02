import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { Currency, DistributionRecipientType, PayoutAccountStatus, PayoutExecutionStatus, TipStatus } from 'generated/prisma';
import { bucketCount, bucketSum, resolvePeriod } from '../utils/period.utils';
import { AdminOverviewQueryType, AdminTrendsQueryType } from '../dto/admin-analytics-query.schema';

export interface CurrencyBreakdown {
    currency: string;
    tips_gross_revenue: number;
    completed_tips_count: number;
    average_tip_amount: number;
    platform_net_revenue: number;
    employee_net_revenue: number;
    store_net_revenue: number;
    processing_fees_total: number;
    payouts_completed_total: number;
}

const emptyBreakdown = (currency: string): CurrencyBreakdown => ({
    currency,
    tips_gross_revenue: 0,
    completed_tips_count: 0,
    average_tip_amount: 0,
    platform_net_revenue: 0,
    employee_net_revenue: 0,
    store_net_revenue: 0,
    processing_fees_total: 0,
    payouts_completed_total: 0,
});

@Injectable()
export class AdminAnalyticsService {
    constructor(private readonly prisma: PrismaService) { }

    // Platform-wide top-line stats. Revenue is grouped per currency (summing
    // raw amounts across currencies would be meaningless) — `totals` mirrors
    // whichever currency carried the most tip volume in the period, and
    // `by_currency` holds the full breakdown for stores operating in others.
    async overview(query: AdminOverviewQueryType) {
        const { gte, lte } = resolvePeriod(query.period);

        const [
            tipRevenueByCurrency,
            platformRevenueByCurrency,
            feeTransactions,
            distributions,
            payoutsByCurrency,
            totalUsers,
            newUsersInPeriod,
            totalStores,
            totalOrganizations,
            pendingPayoutAccounts,
        ] = await Promise.all([
            this.prisma.tip.groupBy({
                by: ['currency'],
                where: { status: TipStatus.COMPLETED, created_at: { gte, lte } },
                _sum: { amount: true },
                _count: { _all: true },
                _avg: { amount: true },
            }),
            this.prisma.paymentTransaction.groupBy({
                by: ['currency'],
                where: { created_at: { gte, lte }, tip: { status: TipStatus.COMPLETED } },
                _sum: { commission_amount: true },
            }),
            // Viva only confirms the real fee via a separate, best-effort
            // webhook (1799) that parses an undocumented payload field — most
            // transactions never get processor_fee_confirmed=true even though
            // a perfectly good processor_fee_estimated was stamped at payment
            // time (payment-webhooks.service.ts). A confirmed-only sum here
            // would read ~0 in practice, so this display stat falls back to
            // the estimate per row — unlike payout eligibility, which must
            // stay confirmed-only (payouts.service.ts).
            this.prisma.paymentTransaction.findMany({
                where: {
                    created_at: { gte, lte },
                    OR: [{ processor_fee_confirmed: true }, { processor_fee_estimated: { not: null } }],
                },
                select: {
                    currency: true,
                    processor_fee_confirmed: true,
                    processor_fee_confirmed_amount: true,
                    processor_fee_estimated: true,
                },
            }),
            this.prisma.tipDistribution.findMany({
                where: { created_at: { gte, lte }, tip: { status: TipStatus.COMPLETED } },
                select: { recipient_type: true, amount: true, tip: { select: { currency: true } } },
            }),
            this.prisma.payout.groupBy({
                by: ['currency'],
                where: { created_at: { gte, lte }, status: PayoutExecutionStatus.COMPLETED },
                _sum: { amount: true },
            }),
            this.prisma.user.count(),
            this.prisma.user.count({ where: { created_at: { gte, lte } } }),
            this.prisma.store.count(),
            this.prisma.organization.count(),
            this.prisma.payoutAccount.count({ where: { status: PayoutAccountStatus.PENDING } }),
        ]);

        const byCurrency = new Map<string, CurrencyBreakdown>();
        const ensure = (currency: string) => {
            let entry = byCurrency.get(currency);
            if (!entry) {
                entry = emptyBreakdown(currency);
                byCurrency.set(currency, entry);
            }
            return entry;
        };

        for (const row of tipRevenueByCurrency) {
            const entry = ensure(row.currency);
            entry.tips_gross_revenue = row._sum.amount ?? 0;
            entry.completed_tips_count = row._count._all;
            entry.average_tip_amount = Math.round(row._avg.amount ?? 0);
        }
        for (const row of platformRevenueByCurrency) {
            ensure(row.currency).platform_net_revenue = row._sum.commission_amount ?? 0;
        }
        for (const row of feeTransactions) {
            const fee = row.processor_fee_confirmed ? (row.processor_fee_confirmed_amount ?? 0) : (row.processor_fee_estimated ?? 0);
            ensure(row.currency).processing_fees_total += fee;
        }
        for (const row of payoutsByCurrency) {
            ensure(row.currency).payouts_completed_total = row._sum.amount ?? 0;
        }
        for (const distribution of distributions) {
            const entry = ensure(distribution.tip.currency);
            if (distribution.recipient_type === DistributionRecipientType.EMPLOYEE) {
                entry.employee_net_revenue += distribution.amount;
            } else {
                entry.store_net_revenue += distribution.amount;
            }
        }

        const breakdown = [...byCurrency.values()].sort((a, b) => b.tips_gross_revenue - a.tips_gross_revenue);
        const totals = breakdown[0] ?? emptyBreakdown('EUR');

        return {
            period: query.period,
            primary_currency: totals.currency,
            totals,
            by_currency: breakdown,
            total_users: totalUsers,
            new_users_in_period: newUsersInPeriod,
            total_stores: totalStores,
            total_organizations: totalOrganizations,
            pending_payout_accounts: pendingPayoutAccounts,
        };
    }

    // Time-bucketed series for one metric at a time (mirrors the org-level
    // trends endpoint's metric/period/group_by shape). Revenue metrics are
    // scoped to a single currency — the platform's dominant one by default.
    async trends(query: AdminTrendsQueryType) {
        const { gte, lte } = resolvePeriod(query.period);

        if (query.metric === 'users') {
            const users = await this.prisma.user.findMany({
                where: { created_at: { gte, lte } },
                select: { created_at: true },
            });
            return { metric: query.metric, currency: null, data: bucketCount(users, query.group_by) };
        }

        const currency = (query.currency as Currency | undefined) ?? (await this.resolvePrimaryCurrency());

        if (query.metric === 'tips_revenue') {
            const tips = await this.prisma.tip.findMany({
                where: { status: TipStatus.COMPLETED, currency, created_at: { gte, lte } },
                select: { amount: true, created_at: true },
            });
            return { metric: query.metric, currency, data: bucketSum(tips, query.group_by) };
        }

        if (query.metric === 'platform_revenue') {
            const transactions = await this.prisma.paymentTransaction.findMany({
                where: { currency, created_at: { gte, lte }, tip: { status: TipStatus.COMPLETED } },
                select: { commission_amount: true, created_at: true },
            });
            return {
                metric: query.metric,
                currency,
                data: bucketSum(
                    transactions.map((t) => ({ amount: t.commission_amount, created_at: t.created_at })),
                    query.group_by,
                ),
            };
        }

        const recipientType =
            query.metric === 'employee_revenue' ? DistributionRecipientType.EMPLOYEE : DistributionRecipientType.STORE;
        const distributions = await this.prisma.tipDistribution.findMany({
            where: { recipient_type: recipientType, created_at: { gte, lte }, tip: { status: TipStatus.COMPLETED, currency } },
            select: { amount: true, created_at: true },
        });
        return { metric: query.metric, currency, data: bucketSum(distributions, query.group_by) };
    }

    private async resolvePrimaryCurrency(): Promise<Currency> {
        const grouped = await this.prisma.tip.groupBy({
            by: ['currency'],
            where: { status: TipStatus.COMPLETED },
            _sum: { amount: true },
        });
        if (grouped.length === 0) return Currency.EUR;
        return grouped.sort((a, b) => (b._sum.amount ?? 0) - (a._sum.amount ?? 0))[0].currency;
    }
}
