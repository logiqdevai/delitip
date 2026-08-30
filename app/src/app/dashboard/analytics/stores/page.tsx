"use client";

import { type FC, useEffect } from "react";
import { useRouter } from "next/navigation";
import { StoresTab } from "@/app/dashboard/analytics/components/stores-tab";
import { useAnalyticsPeriod } from "@/app/dashboard/analytics/components/analytics-period-context";
import { useStores } from "@/features/stores/hooks/use-stores";
import { useWorkspace } from "@/features/stores/hooks/use-workspace";
import { Routes } from "@/routes/routes";

const StoresAnalyticsPage: FC = () => {
  const router = useRouter();
  const { organizationId, isReady } = useWorkspace();
  const { period } = useAnalyticsPeriod();
  const storesQuery = useStores(organizationId ?? "");
  const stores = storesQuery.data ?? [];

  useEffect(() => {
    if (!storesQuery.isPending && stores.length <= 1) {
      router.replace(Routes.dashboard.analytics.overview);
    }
  }, [router, stores.length, storesQuery.isPending]);

  if (!isReady || !organizationId || stores.length <= 1) {
    return null;
  }

  return (
    <StoresTab
      organizationId={organizationId}
      stores={stores}
      period={period}
    />
  );
};

export default StoresAnalyticsPage;
