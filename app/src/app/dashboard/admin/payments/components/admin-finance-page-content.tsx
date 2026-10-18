"use client";

import { type FC } from "react";
import { RefreshCw } from "lucide-react";
import { DashboardPageHeader } from "@/app/dashboard/components/dashboard-shared";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AdminPaymentsTable } from "@/app/dashboard/admin/payments/components/admin-payments-table";
import { AdminPayoutsTable } from "@/app/dashboard/admin/payments/components/admin-payouts-table";
import { AdminPayoutRequestsTable } from "@/app/dashboard/admin/payments/components/admin-payout-requests-table";
import { useReconcilePayments } from "@/features/tips/hooks/use-tips";
import { useReconcilePayoutAccounts } from "@/features/payout-accounts/hooks/use-payout-accounts";
import { useAdminPendingPayoutRequestCount } from "@/features/payout-requests/hooks/use-payout-requests";

export const AdminFinancePageContent: FC = () => {
  const reconcilePayments = useReconcilePayments();
  const reconcilePayoutAccounts = useReconcilePayoutAccounts();
  const pendingRequestsQuery = useAdminPendingPayoutRequestCount();
  const pendingRequests = pendingRequestsQuery.data ?? 0;

  return (
    <>
      <DashboardPageHeader
        title="Payments & Payouts"
        description="Every payment, payout and payout request across all delitip businesses."
        actions={
          <>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={reconcilePayoutAccounts.isPending}
              onClick={() => reconcilePayoutAccounts.mutate()}
              className="h-(--control-height-default) max-sm:h-11 rounded-xl px-3.5 text-chip font-semibold"
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
              className="h-(--control-height-default) max-sm:h-11 rounded-xl px-3.5 text-chip font-semibold"
            >
              <RefreshCw data-icon="inline-start" className="size-3.5" />
              {reconcilePayments.isPending
                ? "Reconciling payments…"
                : "Reconcile payments"}
            </Button>
          </>
        }
      />

      <Tabs defaultValue={pendingRequests > 0 ? "requests" : "payments"}>
        <TabsList>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
          <TabsTrigger value="requests">
            Payout requests
            {pendingRequests > 0 ? (
              <span className="ml-1.5 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800">
                {pendingRequests}
              </span>
            ) : null}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="payments" className="mt-4">
          <AdminPaymentsTable />
        </TabsContent>
        <TabsContent value="payouts" className="mt-4">
          <AdminPayoutsTable />
        </TabsContent>
        <TabsContent value="requests" className="mt-4">
          <AdminPayoutRequestsTable />
        </TabsContent>
      </Tabs>
    </>
  );
};
