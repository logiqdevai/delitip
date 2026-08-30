"use client";

import { type FC } from "react";
import { OverviewTab } from "@/app/dashboard/analytics/components/overview-tab";
import { useAnalyticsPeriod } from "@/app/dashboard/analytics/components/analytics-period-context";
import { useWorkspace } from "@/features/stores/hooks/use-workspace";

const OverviewAnalyticsPage: FC = () => {
  const { store, storeId, organizationId, isReady } = useWorkspace();
  const { period } = useAnalyticsPeriod();

  if (!isReady || !store || !storeId || !organizationId) {
    return null;
  }

  return (
    <OverviewTab
      organizationId={organizationId}
      storeId={storeId}
      currency={store.currency}
      period={period}
    />
  );
};

export default OverviewAnalyticsPage;
