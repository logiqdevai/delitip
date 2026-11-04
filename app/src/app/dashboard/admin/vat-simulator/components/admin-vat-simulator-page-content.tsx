"use client";

import { type FC } from "react";
import { useTranslations } from "next-intl";
import { DashboardPageHeader } from "@/app/dashboard/components/dashboard-shared";
import { AccountingSimulatorWidget } from "./accounting-simulator-widget";

export const AdminVatSimulatorPageContent: FC = () => {
  const t = useTranslations("dashboard.adminSystem.vatSimulator");
  return (
    <>
      <DashboardPageHeader title={t("title")} description={t("description")} />
      <div className="mt-4">
        <AccountingSimulatorWidget />
      </div>
    </>
  );
};
