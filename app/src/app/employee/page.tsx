"use client";

import { type FC } from "react";
import { format, isSameDay, startOfDay, subDays } from "date-fns";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatMoney } from "@/lib/money";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  useCurrentEmployee,
  useEmployeeDashboard,
} from "@/features/employees/hooks/use-employees";
import { useEmployeeTips } from "@/features/tips/hooks/use-tips";
import {
  EmployeeBalanceCard,
  EmployeeDepositNotice,
} from "./components/employee-balance-card";
import { EmployeePayoutHistoryCard } from "./components/employee-payout-history-card";

const TREND_DAYS = 7;
const TIPS_QUERY = { limit: 200 };

const EarningsPage: FC = () => {
  const { employeeId, store, isPending: identityPending } =
    useCurrentEmployee();
  const dashboardQuery = useEmployeeDashboard(employeeId ?? "");
  const tipsQuery = useEmployeeTips(employeeId ?? "", TIPS_QUERY);

  if (identityPending || dashboardQuery.isPending || tipsQuery.isPending) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton
              key={index}
              className={cn(
                "h-40 rounded-3xl",
                index === 0 && "sm:col-span-2 lg:col-span-1",
              )}
            />
          ))}
        </div>
        <Skeleton className="h-64 rounded-3xl" />
      </div>
    );
  }

  if (dashboardQuery.isError || tipsQuery.isError) {
    return (
      <Empty className="border border-dashed border-zinc-200 bg-white py-16">
        <EmptyHeader>
          <EmptyTitle>Could not load your earnings</EmptyTitle>
          <EmptyDescription>
            {dashboardQuery.error?.message ?? tipsQuery.error?.message}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  const currency = store?.currency ?? "EUR";
  const dashboard = dashboardQuery.data;
  const distributions = tipsQuery.data?.data ?? [];
  const now = new Date();

  const monthDistributions = distributions.filter((distribution) => {
    const created = new Date(distribution.created_at);
    return (
      created.getFullYear() === now.getFullYear() &&
      created.getMonth() === now.getMonth()
    );
  });

  const todayDistributions = distributions.filter((distribution) =>
    isSameDay(new Date(distribution.created_at), now),
  );

  const trendDays = Array.from({ length: TREND_DAYS }).map((_, index) => {
    const day = startOfDay(subDays(now, TREND_DAYS - 1 - index));
    const total = distributions
      .filter((distribution) =>
        isSameDay(new Date(distribution.created_at), day),
      )
      .reduce((sum, distribution) => sum + distribution.amount, 0);
    return { day, total };
  });
  const trendMax = Math.max(1, ...trendDays.map((entry) => entry.total));

  return (
    <div className="auth-fade-enter space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="sm:col-span-2 lg:col-span-1">
          <EmployeeBalanceCard />
        </div>

        <div className="flex flex-col justify-between rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-xs sm:p-6">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-zinc-500">
              <span>This Month&apos;s Tips</span>
            </div>
            <div className="mt-3 text-3xl font-extrabold text-ink-charcoal">
              {formatMoney(dashboard?.tips_this_month.total_amount ?? 0, currency)}
            </div>
            <p className="mt-1 text-[11px] text-zinc-400">
              {monthDistributions.length} recent tips this month
            </p>
          </div>
          <div className="flex items-center justify-between border-t border-zinc-100 pt-4 text-xs">
            <span className="text-zinc-500">Today</span>
            <span className="font-bold text-ink-charcoal">
              {todayDistributions.length} tip
              {todayDistributions.length === 1 ? "" : "s"}
            </span>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-xs sm:p-6">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-zinc-500">
              <span>Customer Satisfaction</span>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-1.5 text-3xl font-extrabold text-rating-amber">
              {dashboard?.average_rating
                ? `★ ${dashboard.average_rating.toFixed(2)}`
                : "-"}{" "}
              <span className="text-xs font-normal text-zinc-400">/ 5.0</span>
            </div>
            <p className="mt-1 text-[11px] text-zinc-400">
              {dashboard?.reviews_count ?? 0} verified ratings
            </p>
          </div>
          <div className="flex items-center justify-between gap-2 border-t border-zinc-100 pt-4 text-xs">
            <span className="min-w-0 text-zinc-500">Recognized by customers</span>
            <span className="shrink-0 font-bold text-ink-charcoal">
              {dashboard?.customer_recognition_count ?? 0}x
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-xs sm:p-6 lg:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-ink-charcoal">
                Today&apos;s Tips
              </h2>
              <p className="text-xs text-zinc-400">
                Tips directly rewarded to you today
              </p>
            </div>
            <span className="shrink-0 rounded-lg bg-brand-50 px-2.5 py-1 text-chip font-bold whitespace-nowrap text-brand-700">
              {todayDistributions.length} tips today
            </span>
          </div>

          {todayDistributions.length === 0 ? (
            <p className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 py-8 text-center text-xs text-zinc-500">
              No tips yet today.
            </p>
          ) : (
            <div className="divide-y divide-zinc-100">
              {todayDistributions.map((distribution) => (
                <div
                  key={distribution.id}
                  className="flex min-w-0 items-center justify-between gap-3 py-3.5"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-caption font-bold text-brand-700">
                      +
                    </div>
                    <div className="text-xs font-bold text-ink-charcoal">
                      {format(new Date(distribution.created_at), "HH:mm")}
                    </div>
                  </div>
                  <div className="shrink-0 text-right text-xs font-extrabold text-ink-charcoal">
                    {formatMoney(distribution.amount, distribution.tip.currency)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4 rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-xs sm:p-6">
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-ink-charcoal">
              My Daily Earnings ({TREND_DAYS}d)
            </h2>
            <p className="text-xs text-zinc-400">Daily breakdown</p>
          </div>

          <div className="grid h-40 grid-cols-7 items-end gap-1.5 border-b border-zinc-100 pt-2 pb-2 sm:h-44 sm:gap-3 sm:pt-4">
            {trendDays.map((entry) => {
              const isPeak = entry.total === trendMax && entry.total > 0;
              const heightPct = Math.max(
                4,
                Math.round((entry.total / trendMax) * 100),
              );
              return (
                <div
                  key={entry.day.toISOString()}
                  className="flex h-full min-w-0 flex-col items-center justify-end gap-1 sm:gap-1.5"
                >
                  <span
                    className={cn(
                      "max-w-full truncate text-[9px] font-semibold text-zinc-400 sm:text-[10px]",
                      isPeak && "font-bold text-brand-700",
                    )}
                  >
                    {entry.total > 0 ? formatMoney(entry.total, currency) : "-"}
                  </span>
                  <div
                    className={cn(
                      "w-full rounded-t-md sm:rounded-t-lg",
                      isPeak
                        ? "bg-electric-lime shadow-sm"
                        : entry.total > 0
                          ? "bg-brand-200"
                          : "bg-zinc-100",
                    )}
                    style={{ height: `${heightPct}%` }}
                  />
                  <span
                    className={cn(
                      "text-[9px] font-bold text-zinc-400 sm:text-[10px] sm:font-medium sm:text-zinc-500",
                      isPeak && "text-brand-800 sm:font-bold",
                    )}
                  >
                    <span className="sm:hidden">{format(entry.day, "EEEEE")}</span>
                    <span className="hidden sm:inline">{format(entry.day, "EEE")}</span>
                  </span>
                </div>
              );
            })}
          </div>

          <EmployeeDepositNotice />
        </div>
      </div>

      {employeeId ? <EmployeePayoutHistoryCard employeeId={employeeId} /> : null}

      {dashboard?.recent_feedback.length ? (
        <div className="space-y-4 rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-xs sm:p-6">
          <h2 className="text-sm font-bold text-ink-charcoal">
            Recent Feedback
          </h2>
          <div className="space-y-3">
            {dashboard.recent_feedback.map((feedback, index) => (
              <div
                key={index}
                className="space-y-1 rounded-2xl border border-zinc-100 bg-zinc-50 p-3"
              >
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: feedback.rating }).map((_, i) => (
                    <Star key={i} className="size-3 fill-rating-amber text-rating-amber" />
                  ))}
                </div>
                {feedback.comment ? (
                  <p className="text-xs text-zinc-600">
                    &ldquo;{feedback.comment}&rdquo;
                  </p>
                ) : null}
                <p className="text-[10px] text-zinc-400">
                  {format(new Date(feedback.created_at), "MMM d")}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default EarningsPage;
