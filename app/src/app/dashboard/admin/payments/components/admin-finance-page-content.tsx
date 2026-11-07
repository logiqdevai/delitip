"use client";

import { type FC, useState } from "react";
import { RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";
import { DashboardPageHeader } from "@/app/dashboard/components/dashboard-shared";
import { TabsMenu } from "@/components/ui/tabs-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AdminPaymentsTable } from "@/app/dashboard/admin/payments/components/admin-payments-table";
import { AdminPayoutsTable } from "@/app/dashboard/admin/payments/components/admin-payouts-table";
import { AdminPayoutRequestsTable } from "@/app/dashboard/admin/payments/components/admin-payout-requests-table";
import { useReconcilePayments } from "@/features/tips/hooks/use-tips";
import { useReconcilePayoutAccounts } from "@/features/payout-accounts/hooks/use-payout-accounts";
import { useAdminPendingPayoutRequestCount } from "@/features/payout-requests/hooks/use-payout-requests";

export const AdminFinancePageContent: FC = () => {
  const t = useTranslations("dashboard.admin.finance");
  const reconcilePayments = useReconcilePayments();
  const reconcilePayoutAccounts = useReconcilePayoutAccounts();
  const pendingRequestsQuery = useAdminPendingPayoutRequestCount();
  const pendingRequests = pendingRequestsQuery.data ?? 0;
  const [tab, setTab] = useState(pendingRequests > 0 ? "requests" : "payments");

  return (
    <>
      <DashboardPageHeader
        title={t("title")}
        description={t("description")}
        actions={
          <>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={reconcilePayoutAccounts.isPending}
              onClick={() => reconcilePayoutAccounts.mutate()}
              className="h-(--control-height-default) max-sm:h-11 rounded-xl px-3.5 text-base font-semibold"
            >
              <RefreshCw data-icon="inline-start" className="size-3.5" />
              {reconcilePayoutAccounts.isPending
                ? t("reconcilingIbans")
                : t("reconcileIbans")}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={reconcilePayments.isPending}
              onClick={() => reconcilePayments.mutate()}
              className="h-(--control-height-default) max-sm:h-11 rounded-xl px-3.5 text-base font-semibold"
            >
              <RefreshCw data-icon="inline-start" className="size-3.5" />
              {reconcilePayments.isPending
                ? t("reconcilingPayments")
                : t("reconcilePayments")}
            </Button>
          </>
        }
      />

      <Tabs value={tab} onValueChange={(value) => setTab(String(value))}>
        <TabsMenu
          aria-label={t("tabs.payments")}
          items={[
            { value: "payments", label: t("tabs.payments") },
            { value: "payouts", label: t("tabs.payouts") },
            {
              value: "requests",
              label: pendingRequests > 0 ? `${t("tabs.requests")} (${pendingRequests})` : t("tabs.requests"),
            },
          ]}
          value={tab}
          onValueChange={setTab}
        />
        <TabsList className="max-md:hidden">
          <TabsTrigger value="payments">{t("tabs.payments")}</TabsTrigger>
          <TabsTrigger value="payouts">{t("tabs.payouts")}</TabsTrigger>
          <TabsTrigger value="requests">
            {t("tabs.requests")}
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
