"use client";

import { type FC } from "react";
import { Wallet } from "lucide-react";
import { DetailSkeleton } from "@/components/ui/detail-skeleton";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardPageHeader } from "@/app/dashboard/components/dashboard-shared";
import { PayoutAccountCard } from "@/app/dashboard/payments/components/payout-account-card";
import { DistributionsTable } from "@/app/dashboard/payments/components/distributions-table";
import { RefundsTable } from "@/app/dashboard/payments/components/refunds-table";
import { useWorkspace } from "@/features/stores/hooks/use-workspace";

export const PaymentsPageContent: FC = () => {
  const { store, storeId, isPending, isReady } = useWorkspace();

  if (isPending) {
    return <DetailSkeleton fieldCount={4} />;
  }

  if (!isReady || !storeId || !store) {
    return (
      <Empty className="border border-dashed border-zinc-200 bg-white py-16">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Wallet />
          </EmptyMedia>
          <EmptyTitle>No store selected</EmptyTitle>
          <EmptyDescription>
            Finish business setup before managing payments.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <>
      <DashboardPageHeader
        title="Payments"
        description={`Payout account, pending distributions, and refunds for ${store.name}.`}
      />

      <PayoutAccountCard storeId={storeId} />

      <Tabs defaultValue="distributions">
        <TabsList variant="line">
          <TabsTrigger value="distributions">Pending distributions</TabsTrigger>
          <TabsTrigger value="refunds">Refunds</TabsTrigger>
        </TabsList>
        <TabsContent value="distributions" className="mt-4">
          <DistributionsTable storeId={storeId} currency={store.currency} />
        </TabsContent>
        <TabsContent value="refunds" className="mt-4">
          <RefundsTable storeId={storeId} currency={store.currency} />
        </TabsContent>
      </Tabs>
    </>
  );
};
