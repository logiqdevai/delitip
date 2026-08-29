"use client";

import { type FC, useState } from "react";
import { BarChart3 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DetailSkeleton } from "@/components/ui/detail-skeleton";
import { PlanGate } from "@/components/billing/plan-gate";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { DashboardPageHeader } from "@/app/dashboard/components/dashboard-shared";
import { OverviewTab } from "@/app/dashboard/analytics/components/overview-tab";
import { TipsTab } from "@/app/dashboard/analytics/components/tips-tab";
import { EmployeesTab } from "@/app/dashboard/analytics/components/employees-tab";
import { StoresTab } from "@/app/dashboard/analytics/components/stores-tab";
import { InsightsTab } from "@/app/dashboard/analytics/components/insights-tab";
import type { DashboardPeriod } from "@/features/analytics/interfaces/analytics.interfaces";
import { useStores } from "@/features/stores/hooks/use-stores";
import { useWorkspace } from "@/features/stores/hooks/use-workspace";

export const AnalyticsPageContent: FC = () => {
  const {
    store,
    storeId,
    organizationId,
    isPending: workspacePending,
    isReady,
  } = useWorkspace();
  const storesQuery = useStores(organizationId ?? "");
  const [period, setPeriod] = useState<DashboardPeriod>("7d");

  if (workspacePending) {
    return <DetailSkeleton fieldCount={4} />;
  }

  if (!isReady || !storeId || !organizationId || !store) {
    return (
      <Empty className="border border-dashed border-zinc-200 bg-white py-16">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <BarChart3 />
          </EmptyMedia>
          <EmptyTitle>No store selected</EmptyTitle>
          <EmptyDescription>
            Finish business setup before viewing analytics.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  const stores = storesQuery.data ?? [];
  const showStoresTab = stores.length > 1;

  return (
    <>
      <DashboardPageHeader
        title="Analytics & Insights"
        description={`Detailed intelligence on tipping and customer experience for ${store.name}.`}
      />

      <PlanGate
        organizationId={organizationId}
        requiredPlan="PROFESSIONAL"
        featureName="Analytics"
      >
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tips">Tips</TabsTrigger>
            <TabsTrigger value="employees">Employees</TabsTrigger>
            {showStoresTab ? (
              <TabsTrigger value="stores">Stores</TabsTrigger>
            ) : null}
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab
              organizationId={organizationId}
              storeId={storeId}
              currency={store.currency}
              period={period}
              onPeriodChange={setPeriod}
            />
          </TabsContent>

          <TabsContent value="tips">
            <TipsTab storeId={storeId} currency={store.currency} />
          </TabsContent>

          <TabsContent value="employees">
            <EmployeesTab
              organizationId={organizationId}
              storeId={storeId}
              currency={store.currency}
              period={period}
              onPeriodChange={setPeriod}
            />
          </TabsContent>

          {showStoresTab ? (
            <TabsContent value="stores">
              <StoresTab
                organizationId={organizationId}
                stores={stores}
                period={period}
                onPeriodChange={setPeriod}
              />
            </TabsContent>
          ) : null}

          <TabsContent value="insights">
            <InsightsTab storeId={storeId} />
          </TabsContent>
        </Tabs>
      </PlanGate>
    </>
  );
};
