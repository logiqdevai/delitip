"use client";

import { type FC } from "react";
import { TipsTab } from "@/app/dashboard/analytics/components/tips-tab";
import { useWorkspace } from "@/features/stores/hooks/use-workspace";

const TipsAnalyticsPage: FC = () => {
  const { store, storeId, isReady } = useWorkspace();

  if (!isReady || !store || !storeId) {
    return null;
  }

  return <TipsTab storeId={storeId} currency={store.currency} />;
};

export default TipsAnalyticsPage;
