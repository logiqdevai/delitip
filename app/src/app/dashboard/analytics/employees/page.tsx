"use client";

import { type FC } from "react";
import { EmployeesTab } from "@/app/dashboard/analytics/components/employees-tab";
import { useAnalyticsPeriod } from "@/app/dashboard/analytics/components/analytics-period-context";
import { useWorkspace } from "@/features/stores/hooks/use-workspace";

const EmployeesAnalyticsPage: FC = () => {
  const { store, storeId, organizationId, isReady } = useWorkspace();
  const { period } = useAnalyticsPeriod();

  if (!isReady || !store || !storeId || !organizationId) {
    return null;
  }

  return (
    <EmployeesTab
      organizationId={organizationId}
      storeId={storeId}
      currency={store.currency}
      period={period}
    />
  );
};

export default EmployeesAnalyticsPage;
