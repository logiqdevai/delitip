"use client";

import { type FC } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PayoutAccountCard } from "@/app/dashboard/payments/components/payout-account-card";
import { DistributionsTable } from "@/app/dashboard/payments/components/distributions-table";
import { RefundsTable } from "@/app/dashboard/payments/components/refunds-table";
import { StaffBalancesTable } from "@/app/dashboard/payments/components/staff-balances-table";
import type { Store } from "@/features/stores/interfaces/stores.interfaces";

interface PaymentsPageContentProps {
  storeId: string;
  store: Store;
}

// Rendered as the Payments tab of the Tips page, which owns the page header
// and the "no store selected" guard.
export const PaymentsPageContent: FC<PaymentsPageContentProps> = ({
  storeId,
  store,
}) => {
  return (
    <div className="space-y-6">
      <PayoutAccountCard storeId={storeId} />

      <Tabs defaultValue="distributions">
        <TabsList>
          <TabsTrigger value="distributions">Pending distributions</TabsTrigger>
          <TabsTrigger value="staff-balances">Staff balances</TabsTrigger>
          <TabsTrigger value="refunds">Refunds</TabsTrigger>
        </TabsList>
        <TabsContent value="distributions" className="mt-4">
          <DistributionsTable storeId={storeId} currency={store.currency} />
        </TabsContent>
        <TabsContent value="staff-balances" className="mt-4">
          <StaffBalancesTable
            storeId={storeId}
            storeName={store.name}
            currency={store.currency}
          />
        </TabsContent>
        <TabsContent value="refunds" className="mt-4">
          <RefundsTable storeId={storeId} currency={store.currency} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
