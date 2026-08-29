"use client";

import { type FC } from "react";
import { Wallet } from "lucide-react";
import { DetailSkeleton } from "@/components/ui/detail-skeleton";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { DashboardPageHeader } from "@/app/dashboard/components/dashboard-shared";
import { PayoutAccountCard } from "@/app/dashboard/payments/components/payout-account-card";
import { PendingDistributionsPanel } from "@/app/dashboard/payments/components/pending-distributions-panel";
import { RefundsQueuePanel } from "@/app/dashboard/payments/components/refunds-queue-panel";
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

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <PayoutAccountCard storeId={storeId} />
        <PendingDistributionsPanel storeId={storeId} currency={store.currency} />
      </div>

      <RefundsQueuePanel storeId={storeId} currency={store.currency} />
    </>
  );
};
