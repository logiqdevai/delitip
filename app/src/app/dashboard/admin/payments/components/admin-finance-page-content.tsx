"use client";

import { type FC } from "react";
import { RefreshCw } from "lucide-react";
import { DashboardPageHeader } from "@/app/dashboard/components/dashboard-shared";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AdminPaymentsTable } from "@/app/dashboard/admin/payments/components/admin-payments-table";
import { AdminPayoutsTable } from "@/app/dashboard/admin/payments/components/admin-payouts-table";
import { useReconcilePayments } from "@/features/tips/hooks/use-tips";
import { useReconcilePayoutAccounts } from "@/features/payout-accounts/hooks/use-payout-accounts";

export const AdminFinancePageContent: FC = () => {
  const reconcilePayments = useReconcilePayments();
  const reconcilePayoutAccounts = useReconcilePayoutAccounts();

  return (
    <>
      <DashboardPageHeader
        title="Payments & Payouts"
        description="Every payment and payout across all delitip businesses."
        actions={
          <>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={reconcilePayoutAccounts.isPending}
              onClick={() => reconcilePayoutAccounts.mutate()}
              className="h-9 rounded-xl px-3.5 text-chip font-semibold"
            >
              <RefreshCw data-icon="inline-start" className="size-3.5" />
              {reconcilePayoutAccounts.isPending
                ? "Reconciling IBANs…"
                : "Reconcile IBANs"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={reconcilePayments.isPending}
              onClick={() => reconcilePayments.mutate()}
              className="h-9 rounded-xl px-3.5 text-chip font-semibold"
            >
              <RefreshCw data-icon="inline-start" className="size-3.5" />
              {reconcilePayments.isPending
                ? "Reconciling payments…"
                : "Reconcile payments"}
            </Button>
          </>
        }
      />

      <Tabs defaultValue="payments">
        <TabsList variant="line">
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
        </TabsList>
        <TabsContent value="payments" className="mt-4">
          <AdminPaymentsTable />
        </TabsContent>
        <TabsContent value="payouts" className="mt-4">
          <AdminPayoutsTable />
        </TabsContent>
      </Tabs>
    </>
  );
};
