"use client";

import { type FC } from "react";
import { InsightsTab } from "@/app/dashboard/analytics/components/insights-tab";
import { useWorkspace } from "@/features/stores/hooks/use-workspace";

const InsightsAnalyticsPage: FC = () => {
  const { storeId, isReady } = useWorkspace();

  if (!isReady || !storeId) {
    return null;
  }

  return <InsightsTab storeId={storeId} />;
};

export default InsightsAnalyticsPage;
