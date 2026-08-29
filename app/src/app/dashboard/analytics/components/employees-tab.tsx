"use client";

import { type FC } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { AnalyticsPeriodSelect } from "@/app/dashboard/analytics/components/analytics-period-select";
import { useEmployeesPerformance } from "@/features/analytics/hooks/use-analytics";
import type { DashboardPeriod } from "@/features/analytics/interfaces/analytics.interfaces";
import type { Currency } from "@/features/stores/interfaces/stores.interfaces";
import { formatMoney } from "@/lib/money";

export const EmployeesTab: FC<{
  organizationId: string;
  storeId: string;
  currency: Currency;
  period: DashboardPeriod;
  onPeriodChange: (period: DashboardPeriod) => void;
}> = ({ organizationId, storeId, currency, period, onPeriodChange }) => {
  const performanceQuery = useEmployeesPerformance(organizationId, {
    store_id: storeId,
    period,
  });

  const rows = performanceQuery.data ?? [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-zinc-500">
          Informational stats for your team — not a ranking.
        </p>
        <AnalyticsPeriodSelect value={period} onChange={onPeriodChange} />
      </div>

      {performanceQuery.isPending ? (
        <Skeleton className="h-64 w-full rounded-2xl" />
      ) : performanceQuery.isError ? (
        <p className="text-xs text-red-600">{performanceQuery.error.message}</p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-xs">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-100 bg-zinc-50 text-caption font-semibold tracking-wider text-zinc-400 uppercase">
              <tr>
                <th className="px-4 py-2.5">Employee</th>
                <th className="px-4 py-2.5">Tips</th>
                <th className="px-4 py-2.5">Rating</th>
                <th className="px-4 py-2.5">Reviews</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-6 text-center text-xs text-zinc-400"
                  >
                    No active employees for this period.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.employee_id}>
                    <td className="px-4 py-2.5 font-semibold text-ink-charcoal">
                      {row.employee_name}
                    </td>
                    <td className="px-4 py-2.5 font-bold text-brand-700">
                      {formatMoney(row.tips_total, currency)}
                    </td>
                    <td className="px-4 py-2.5 text-rating-amber">
                      {row.average_rating ? `★ ${row.average_rating.toFixed(2)}` : "—"}
                    </td>
                    <td className="px-4 py-2.5 text-zinc-500">
                      {row.reviews_count}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
