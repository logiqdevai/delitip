"use client";

import { type FC } from "react";
import { useTranslations } from "next-intl";
import { DashboardPageHeader } from "@/app/dashboard/components/dashboard-shared";
import { AdminWebhookEventsTable } from "./admin-webhook-events-table";

export const AdminWebhookEventsPageContent: FC = () => {
  const t = useTranslations("dashboard.admin.webhookEvents");
  return (
    <>
      <DashboardPageHeader
        title={t("title")}
        description={t("description")}
      />
      <AdminWebhookEventsTable />
    </>
  );
};
