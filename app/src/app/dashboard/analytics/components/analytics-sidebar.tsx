"use client";

import { type FC } from "react";
import { useTranslations } from "next-intl";
import { SectionSidebar } from "@/components/layout/section-sidebar";
import { useStores } from "@/features/stores/hooks/use-stores";
import { useWorkspace } from "@/features/stores/hooks/use-workspace";
import { analyticsNavItems } from "./analytics-nav-items";

export const AnalyticsSidebar: FC = () => {
  const t = useTranslations("dashboard.analytics.nav");
  const { organizationId } = useWorkspace();
  const storesQuery = useStores(organizationId ?? "");
  const showStoresTab = (storesQuery.data?.length ?? 0) > 1;
  const items = analyticsNavItems
    .filter((item) => !item.requiresMultipleStores || showStoresTab)
    .map((item) => ({
      href: item.href,
      icon: item.icon,
      label: t(`${item.key}.label`),
    }));

  return <SectionSidebar items={items} />;
};
