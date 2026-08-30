"use client";

import { type FC } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useDashboardOverview,
  useExperienceScore,
} from "@/features/analytics/hooks/use-analytics";
import type { DashboardPeriod } from "@/features/analytics/interfaces/analytics.interfaces";
import type { Currency } from "@/features/stores/interfaces/stores.interfaces";
import { formatMoney } from "@/lib/money";

export const OverviewTab: FC<{
  organizationId: string;
  storeId: string;
  currency: Currency;
  period: DashboardPeriod;
}> = ({ organizationId, storeId, currency, period }) => {
  const overviewQuery = useDashboardOverview(organizationId, {
    store_id: storeId,
    period,
  });
  const scoreQuery = useExperienceScore(organizationId, {
    store_id: storeId,
    period,
  });

  const overview = overviewQuery.data;
  const score = scoreQuery.data;

  return (
    <div className="flex flex-col gap-4">
      {overviewQuery.isPending ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
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
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-xs">
            <span className="text-xs font-semibold text-zinc-500">Tips</span>
            <div className="mt-1 text-xl font-extrabold text-ink-charcoal">
              {formatMoney(overview?.tips_total_amount ?? 0, currency)}
            </div>
          </div>
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-xs">
            <span className="text-xs font-semibold text-zinc-500">
              Transactions
            </span>
            <div className="mt-1 text-xl font-extrabold text-ink-charcoal">
              {overview?.transactions_count ?? 0}
            </div>
          </div>
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-xs">
            <span className="text-xs font-semibold text-zinc-500">
              Avg Rating
            </span>
            <div className="mt-1 text-xl font-extrabold text-rating-amber">
              {overview?.average_rating
                ? `★ ${overview.average_rating.toFixed(2)}`
                : "—"}
            </div>
          </div>
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-xs">
            <span className="text-xs font-semibold text-zinc-500">
              Employees Recognized
            </span>
            <div className="mt-1 text-xl font-extrabold text-ink-charcoal">
              {overview?.employees_recognized ?? 0}
            </div>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs">
        <h2 className="text-sm font-bold text-ink-charcoal">
          Customer Experience Score
        </h2>
        {scoreQuery.isPending ? (
          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Skeleton className="size-20 shrink-0 rounded-full" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-3 w-full max-w-md" />
              <Skeleton className="h-3 w-3/4 max-w-sm" />
              <div className="flex flex-wrap gap-3">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          </div>
        ) : scoreQuery.isError ? (
          <p className="mt-2 text-xs text-red-600">{scoreQuery.error.message}</p>
        ) : score ? (
          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex size-20 shrink-0 items-center justify-center rounded-full bg-brand-50 text-2xl font-extrabold text-brand-700">
              {score.score}
            </div>
            <div className="space-y-2 text-xs text-zinc-600">
              <p>{score.explanation}</p>
              <div className="flex flex-wrap gap-3 text-[11px] text-zinc-400">
                <span>
                  Rating {score.breakdown.rating_component.toFixed(0)}%
                </span>
                <span>
                  Tip activity {score.breakdown.tip_activity_component.toFixed(0)}%
                </span>
                <span>
                  Positive reviews{" "}
                  {score.breakdown.positive_review_ratio_component.toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
