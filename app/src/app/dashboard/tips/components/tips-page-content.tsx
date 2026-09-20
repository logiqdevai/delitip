"use client";

import { type FC, Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Receipt, Wallet } from "lucide-react";
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
import { PaymentsPageContent } from "@/app/dashboard/payments/components/payments-page-content";
import { useWorkspace } from "@/features/stores/hooks/use-workspace";
import { DASHBOARD_TAB_PARAM, TipsTabs, type TipsTab } from "@/routes/routes";

const isTipsTab = (value: unknown): value is TipsTab =>
  value === TipsTabs.ledger || value === TipsTabs.payments;

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
        description={`Tip ledger and payments for ${store.name}.`}
      />

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList variant="line">
          <TabsTrigger value={TipsTabs.ledger}>
            <Receipt data-icon="inline-start" />
            Tips
          </TabsTrigger>
          <TabsTrigger value={TipsTabs.payments}>
            <Wallet data-icon="inline-start" />
            Payments
          </TabsTrigger>
        </TabsList>

        <TabsContent value={TipsTabs.ledger} className="mt-6">
          <TipsLedgerPanel storeId={storeId} />
        </TabsContent>
        <TabsContent value={TipsTabs.payments} className="mt-6">
          <PaymentsPageContent storeId={storeId} store={store} />
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
