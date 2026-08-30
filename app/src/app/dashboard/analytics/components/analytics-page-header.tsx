"use client";

import { type FC } from "react";
import { usePathname } from "next/navigation";
import { DashboardPageHeader } from "@/app/dashboard/components/dashboard-shared";
import { AnalyticsPeriodSelect } from "@/app/dashboard/analytics/components/analytics-period-select";
import { useAnalyticsPeriod } from "@/app/dashboard/analytics/components/analytics-period-context";
import { useWorkspace } from "@/features/stores/hooks/use-workspace";
import { Routes } from "@/routes/routes";
import { analyticsNavItems } from "./analytics-nav-items";

const PERIOD_ROUTES = new Set<string>([
  Routes.dashboard.analytics.overview,
  Routes.dashboard.analytics.employees,
  Routes.dashboard.analytics.stores,
]);

export const AnalyticsPageHeader: FC = () => {
  const pathname = usePathname();
  const { store } = useWorkspace();
  const { period, setPeriod } = useAnalyticsPeriod();
  const activeItem = analyticsNavItems.find((item) => item.href === pathname);
  const showPeriod = PERIOD_ROUTES.has(pathname);

  const description =
    activeItem?.href === Routes.dashboard.analytics.overview && store
      ? `Detailed intelligence on tipping and customer experience for ${store.name}.`
      : (activeItem?.description ??
        "Detailed intelligence on tipping and customer experience.");

  return (
    <DashboardPageHeader
      title={activeItem?.label ?? "Analytics & Insights"}
      description={description}
      actions={
        showPeriod ? (
          <AnalyticsPeriodSelect value={period} onChange={setPeriod} />
        ) : undefined
      }
    />
  );
};
