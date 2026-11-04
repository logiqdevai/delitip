"use client";

import { type FC, useState } from "react";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import {
  AlertTriangle,
  Banknote,
  Building2,
  CreditCard,
  HandCoins,
  Landmark,
  Percent,
  Store,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react";
import { DashboardPageHeader } from "@/app/dashboard/components/dashboard-shared";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminAnalyticsPeriodSelect } from "@/app/dashboard/admin/analytics/components/admin-analytics-period-select";
import { FeeBreakdownCard } from "@/app/dashboard/admin/analytics/components/fee-breakdown-card";
import { RevenueSplitCard } from "@/app/dashboard/admin/analytics/components/revenue-split-card";
import { RevenueTrendChart } from "@/app/dashboard/admin/analytics/components/revenue-trend-chart";
import { StatTile } from "@/app/dashboard/admin/analytics/components/stat-tile";
import { UsersTrendChart } from "@/app/dashboard/admin/analytics/components/users-trend-chart";
import { useAdminOverview } from "@/features/analytics/hooks/use-analytics";
import type { AdminOverviewPeriod } from "@/features/analytics/interfaces/analytics.interfaces";
import type { Currency } from "@/features/stores/interfaces/stores.interfaces";
import { formatMoney } from "@/lib/money";
import { getErrorMessage } from "@/lib/api-error";

export const AdminAnalyticsPageContent: FC = () => {
  const t = useTranslations("dashboard.adminSystem.analytics");
  const format = useFormatter();
  const locale = useLocale();
  const compact = (value: number) =>
    format.number(value, { notation: "compact", maximumFractionDigits: 1 });
  const money = (value: number, currency: Currency) =>
    formatMoney(value, currency, locale);
  const [period, setPeriod] = useState<AdminOverviewPeriod>("30d");
  const overviewQuery = useAdminOverview({ period });
  const overview = overviewQuery.data;
  const totals = overview?.totals;
  const currency = (overview?.primary_currency ?? "EUR") as Currency;
  const otherCurrencies = (overview?.by_currency ?? []).filter(
    (entry) => entry.currency !== currency,
  );

  return (
    <>
      <DashboardPageHeader
        title={t("title")}
        description={t("description")}
        actions={
          <AdminAnalyticsPeriodSelect value={period} onChange={setPeriod} />
        }
      />

      {overviewQuery.isPending ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-xs"
            >
              <Skeleton className="h-3 w-20" />
              <Skeleton className="mt-2 h-7 w-28" />
            </div>
          ))}
        </div>
      ) : overviewQuery.isError ? (
        <p className="text-xs text-red-600">{getErrorMessage(overviewQuery.error)}</p>
      ) : overview && totals ? (
        <div className="space-y-6">
          <section className="space-y-2.5">
            <h2 className="text-base font-bold tracking-wider text-zinc-400 uppercase">
              {t("sections.platform")}
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatTile
                label={t("tiles.totalUsers")}
                value={compact(overview.total_users)}
                icon={<Users />}
                tone="brand"
                helpText={t("help.newUsersInRange", {
                  count: compact(overview.new_users_in_period),
                })}
              />
              <StatTile
                label={t("tiles.newUsers")}
                value={compact(overview.new_users_in_period)}
                icon={<UserPlus />}
              />
              <StatTile
                label={t("tiles.totalStores")}
                value={compact(overview.total_stores)}
                icon={<Store />}
              />
              <StatTile
                label={t("tiles.totalOrganizations")}
                value={compact(overview.total_organizations)}
                icon={<Building2 />}
              />
            </div>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-base font-bold tracking-wider text-zinc-400 uppercase">
              {t("sections.revenue", { currency })}
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatTile
                label={t("tiles.grossTipsRevenue")}
                value={money(totals.tips_gross_revenue, currency)}
                icon={<Wallet />}
                tone="brand"
                helpText={t("help.completedTips", {
                  count: compact(totals.completed_tips_count),
                })}
              />
              <StatTile
                label={t("tiles.averageTipAmount")}
                value={money(totals.average_tip_amount, currency)}
                icon={<Percent />}
              />
              <StatTile
                label={t("tiles.platformNetRevenue")}
                value={money(totals.platform_net_revenue, currency)}
                icon={<Landmark />}
              />
              <StatTile
                label={t("tiles.processingFees")}
                value={money(totals.processing_fees_total, currency)}
                icon={<CreditCard />}
              />
            </div>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-base font-bold tracking-wider text-zinc-400 uppercase">
              {t("sections.distribution", { currency })}
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatTile
                label={t("tiles.employeeNetRevenue")}
                value={money(totals.employee_net_revenue, currency)}
                icon={<HandCoins />}
              />
              <StatTile
                label={t("tiles.storeNetRevenue")}
                value={money(totals.store_net_revenue, currency)}
                icon={<Store />}
              />
              <StatTile
                label={t("tiles.payoutsCompleted")}
                value={money(totals.payouts_completed_total, currency)}
                icon={<Banknote />}
              />
              <StatTile
                label={t("tiles.pendingPayoutAccounts")}
                value={compact(overview.pending_payout_accounts)}
                icon={<AlertTriangle />}
                tone={overview.pending_payout_accounts > 0 ? "attention" : "neutral"}
                helpText={t("help.awaitingVerification")}
              />
            </div>
          </section>

          {otherCurrencies.length > 0 ? (
            <p className="text-base text-zinc-400">
              {t("otherCurrencies", {
                currencies: otherCurrencies.map((entry) => entry.currency).join(", "),
                currency,
              })}
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <UsersTrendChart />
        <RevenueTrendChart />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <FeeBreakdownCard
          currency={currency}
          tipsGrossRevenue={totals?.tips_gross_revenue ?? 0}
          platformFee={totals?.platform_net_revenue ?? 0}
          platformFeePercentage={totals?.platform_fee_percentage ?? 0}
          paymentFee={totals?.processing_fees_total ?? 0}
          paymentFeePercentage={totals?.payment_fee_percentage ?? 0}
          totalFee={totals?.total_fee_total ?? 0}
          totalFeePercentage={totals?.total_fee_percentage ?? 0}
          netDistributable={totals?.net_distributable_total ?? 0}
        />
        <RevenueSplitCard
          platform={totals?.platform_net_revenue ?? 0}
          employee={totals?.employee_net_revenue ?? 0}
          store={totals?.store_net_revenue ?? 0}
          currency={currency}
        />
      </div>
    </>
  );
};
