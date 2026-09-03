"use client";

import { type FC } from "react";
import { DashboardPageHeader } from "@/app/dashboard/components/dashboard-shared";
import { AccountingSimulatorWidget } from "./accounting-simulator-widget";

export const AdminVatSimulatorPageContent: FC = () => {
  return (
    <>
      <DashboardPageHeader
        title="VAT Simulator"
        description="Simulate invoices, VAT, and platform profit for a single tip."
      />
      <div className="mt-4">
        <AccountingSimulatorWidget />
      </div>
    </>
  );
};
