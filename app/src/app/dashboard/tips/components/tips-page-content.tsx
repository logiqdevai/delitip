"use client";

import { type FC, Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Banknote, HandCoins, Receipt } from "lucide-react";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardPageHeader } from "@/app/dashboard/components/dashboard-shared";
import { TipsLedgerPanel } from "@/app/dashboard/tips/components/tips-ledger-panel";
import { PayoutSummaryCard } from "@/app/dashboard/tips/components/payout-summary-card";
import { PayoutAccountCard } from "@/app/dashboard/payments/components/payout-account-card";
import { StaffBalancesTable } from "@/app/dashboard/payments/components/staff-balances-table";
import { PayoutsPageContent } from "@/app/dashboard/payouts/components/payouts-page-content";
import { useWorkspace } from "@/features/stores/hooks/use-workspace";
import { DASHBOARD_TAB_PARAM, TipsTabs, type TipsTab } from "@/routes/routes";

const isTipsTab = (value: unknown): value is TipsTab =>
  value === TipsTabs.ledger ||
  value === TipsTabs.staffBalances ||
  value === TipsTabs.payouts;

const TipsPageInner: FC = () => {
  const { storeId, store, isPending: workspacePending, isReady } =
    useWorkspace();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const tabParam = searchParams.get(DASHBOARD_TAB_PARAM);
  const activeTab = isTipsTab(tabParam) ? tabParam : TipsTabs.ledger;

  const handleTabChange = (value: unknown) => {
    if (!isTipsTab(value)) return;
    const params = new URLSearchParams(searchParams);
    if (value === TipsTabs.ledger) {
      params.delete(DASHBOARD_TAB_PARAM);
    } else {
      params.set(DASHBOARD_TAB_PARAM, value);
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  if (workspacePending) {
    return <TableSkeleton columns={5} />;
  }

  if (!isReady || !storeId || !store) {
    return (
      <Empty className="border border-dashed border-zinc-200 bg-white py-16">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Receipt />
          </EmptyMedia>
          <EmptyTitle>No store selected</EmptyTitle>
          <EmptyDescription>
            Finish business setup before viewing tips.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <>
      <DashboardPageHeader
        title="Tips"
        description={`Tips, payouts, and staff balances for ${store.name}.`}
      />

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="mt-6"
      >
        <TabsList>
          <TabsTrigger value={TipsTabs.ledger}>
            <Receipt />
            Tips
          </TabsTrigger>
          <TabsTrigger value={TipsTabs.staffBalances}>
            <HandCoins />
            Staff balances
          </TabsTrigger>
          <TabsTrigger value={TipsTabs.payouts}>
            <Banknote />
            Payouts
          </TabsTrigger>
        </TabsList>

        <TabsContent value={TipsTabs.ledger} className="mt-6">
          <div className="space-y-6">
            <PayoutAccountCard storeId={storeId} />
            <PayoutSummaryCard storeId={storeId} currency={store.currency} />
            <TipsLedgerPanel storeId={storeId} />
          </div>
        </TabsContent>
        <TabsContent value={TipsTabs.staffBalances} className="mt-6">
          <StaffBalancesTable
            storeId={storeId}
            storeName={store.name}
            currency={store.currency}
          />
        </TabsContent>
        <TabsContent value={TipsTabs.payouts} className="mt-6">
          <PayoutsPageContent storeId={storeId} />
        </TabsContent>
      </Tabs>
    </>
  );
};

export const TipsPageContent: FC = () => {
  return (
    <Suspense fallback={<TableSkeleton columns={5} />}>
      <TipsPageInner />
    </Suspense>
  );
};
