"use client";

import { type FC, useState } from "react";
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
import { RevenueSplitCard } from "@/app/dashboard/admin/analytics/components/revenue-split-card";
import { RevenueTrendChart } from "@/app/dashboard/admin/analytics/components/revenue-trend-chart";
import { StatTile } from "@/app/dashboard/admin/analytics/components/stat-tile";
import { UsersTrendChart } from "@/app/dashboard/admin/analytics/components/users-trend-chart";
import { useAdminOverview } from "@/features/analytics/hooks/use-analytics";
import type { AdminOverviewPeriod } from "@/features/analytics/interfaces/analytics.interfaces";
import type { Currency } from "@/features/stores/interfaces/stores.interfaces";
import { formatMoney } from "@/lib/money";

const compact = (value: number) =>
  new Intl.NumberFormat(undefined, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

export const AdminAnalyticsPageContent: FC = () => {
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
        title="Analytics"
        description="Platform-wide usage and revenue, across every business on delitip."
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
        <p className="text-xs text-red-600">{overviewQuery.error.message}</p>
      ) : overview && totals ? (
        <div className="space-y-6">
          <section className="space-y-2.5">
            <h2 className="text-caption font-bold tracking-wider text-zinc-400 uppercase">
              Platform
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatTile
                label="Total users"
                value={compact(overview.total_users)}
                icon={<Users />}
                tone="brand"
                helpText={`+${compact(overview.new_users_in_period)} in this range`}
              />
              <StatTile
                label="New users"
                value={compact(overview.new_users_in_period)}
                icon={<UserPlus />}
              />
              <StatTile
                label="Total stores"
                value={compact(overview.total_stores)}
                icon={<Store />}
              />
              <StatTile
                label="Total organizations"
                value={compact(overview.total_organizations)}
                icon={<Building2 />}
              />
            </div>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-caption font-bold tracking-wider text-zinc-400 uppercase">
              Revenue &middot; {currency}
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatTile
                label="Gross tips revenue"
                value={formatMoney(totals.tips_gross_revenue, currency)}
                icon={<Wallet />}
                tone="brand"
                helpText={`${compact(totals.completed_tips_count)} completed tips`}
              />
              <StatTile
                label="Average tip amount"
                value={formatMoney(totals.average_tip_amount, currency)}
                icon={<Percent />}
              />
              <StatTile
                label="Platform net revenue"
                value={formatMoney(totals.platform_net_revenue, currency)}
                icon={<Landmark />}
              />
              <StatTile
                label="Processing fees"
                value={formatMoney(totals.processing_fees_total, currency)}
                icon={<CreditCard />}
              />
            </div>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-caption font-bold tracking-wider text-zinc-400 uppercase">
              Distribution &middot; {currency}
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatTile
                label="Employee net revenue"
                value={formatMoney(totals.employee_net_revenue, currency)}
                icon={<HandCoins />}
              />
              <StatTile
                label="Store net revenue"
                value={formatMoney(totals.store_net_revenue, currency)}
                icon={<Store />}
              />
              <StatTile
                label="Payouts completed"
                value={formatMoney(totals.payouts_completed_total, currency)}
                icon={<Banknote />}
              />
              <StatTile
                label="Pending payout accounts"
                value={compact(overview.pending_payout_accounts)}
                icon={<AlertTriangle />}
                tone={overview.pending_payout_accounts > 0 ? "attention" : "neutral"}
                helpText="Awaiting verification"
              />
            </div>
          </section>

          {otherCurrencies.length > 0 ? (
            <p className="text-[11px] text-zinc-400">
              Also active in {otherCurrencies.map((entry) => entry.currency).join(", ")}
              {" — "}figures above show {currency} only, the platform&apos;s
              largest currency by tip volume in this range.
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <UsersTrendChart />
        <RevenueTrendChart />
      </div>

      <RevenueSplitCard
        platform={totals?.platform_net_revenue ?? 0}
        employee={totals?.employee_net_revenue ?? 0}
        store={totals?.store_net_revenue ?? 0}
        currency={currency}
      />
    </>
  );
};
