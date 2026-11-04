"use client";

import { type FC } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("dashboard.analytics");
  const pathname = usePathname();
  const { store } = useWorkspace();
  const { period, setPeriod } = useAnalyticsPeriod();
  const activeItem = analyticsNavItems.find((item) => item.href === pathname);
  const showPeriod = PERIOD_ROUTES.has(pathname);

  const description =
    activeItem?.href === Routes.dashboard.analytics.overview && store
      ? t("overviewDescription", { storeName: store.name })
      : activeItem
        ? t(`nav.${activeItem.key}.description`)
        : t("defaultDescription");

  return (
    <DashboardPageHeader
      title={activeItem ? t(`nav.${activeItem.key}.label`) : t("title")}
      description={description}
      actions={
        showPeriod ? (
          <AnalyticsPeriodSelect value={period} onChange={setPeriod} />
        ) : undefined
      }
    />
  );
};
