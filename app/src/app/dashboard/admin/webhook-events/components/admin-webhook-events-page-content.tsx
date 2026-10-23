"use client";

import { type FC } from "react";
import { DashboardPageHeader } from "@/app/dashboard/components/dashboard-shared";
import { AdminWebhookEventsTable } from "./admin-webhook-events-table";

export const AdminWebhookEventsPageContent: FC = () => {
  return (
    <>
      <DashboardPageHeader
        title="Webhook Events"
        description="Every payment-provider webhook delitip has received, with how it was processed."
      />
      <AdminWebhookEventsTable />
    </>
  );
};
