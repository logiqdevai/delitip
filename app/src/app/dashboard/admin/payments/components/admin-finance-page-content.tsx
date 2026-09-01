"use client";

import { type FC } from "react";
import { DashboardPageHeader } from "@/app/dashboard/components/dashboard-shared";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminPaymentsTable } from "@/app/dashboard/admin/payments/components/admin-payments-table";
import { AdminPayoutsTable } from "@/app/dashboard/admin/payments/components/admin-payouts-table";

export const AdminFinancePageContent: FC = () => {
  return (
    <>
      <DashboardPageHeader
        title="Payments & Payouts"
        description="Every payment and payout across all delitip businesses."
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
