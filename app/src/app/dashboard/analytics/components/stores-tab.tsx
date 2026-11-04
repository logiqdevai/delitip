"use client";

import { type FC } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";
import { useStoresPerformance } from "@/features/analytics/hooks/use-analytics";
import type { DashboardPeriod } from "@/features/analytics/interfaces/analytics.interfaces";
import type { Store } from "@/features/stores/interfaces/stores.interfaces";
import { formatMoney } from "@/lib/money";
import { getErrorMessage } from "@/lib/api-error";

export const StoresTab: FC<{
  organizationId: string;
  stores: Store[];
  period: DashboardPeriod;
}> = ({ organizationId, stores, period }) => {
  const t = useTranslations("dashboard.analytics.stores");
  const locale = useLocale();
  const performanceQuery = useStoresPerformance(organizationId, { period });
  const currencyByStoreId = new Map(
    stores.map((store) => [store.id, store.currency]),
  );

  const rows = performanceQuery.data ?? [];

  return (
    <div className="flex flex-col gap-4">
      {performanceQuery.isPending ? (
        <Skeleton className="h-64 w-full rounded-2xl" />
      ) : performanceQuery.isError ? (
        <p className="text-xs text-red-600">{getErrorMessage(performanceQuery.error)}</p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-xs">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-100 bg-zinc-50 text-base font-semibold tracking-wider text-zinc-400 uppercase">
              <tr>
                <th className="px-4 py-2.5">{t("store")}</th>
                <th className="px-4 py-2.5">{t("tips")}</th>
                <th className="px-4 py-2.5">{t("rating")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {rows.map((row) => (
                <tr key={row.store_id}>
                  <td className="px-4 py-2.5 font-semibold text-ink-charcoal">
                    {row.store_name}
                  </td>
                  <td className="px-4 py-2.5 font-bold text-brand-700">
                    {formatMoney(
                      row.tips_total,
                      currencyByStoreId.get(row.store_id) ?? "EUR",
                      locale,
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-rating-amber">
                    {row.average_rating ? `★ ${row.average_rating.toFixed(2)}` : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
