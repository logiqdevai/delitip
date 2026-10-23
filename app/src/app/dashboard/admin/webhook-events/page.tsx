import { type FC } from "react";
import { type Metadata } from "next";
import { PlatformAdminGuard } from "@/components/auth/platform-admin-guard";
import { AdminWebhookEventsPageContent } from "./components/admin-webhook-events-page-content";

export const metadata: Metadata = {
  title: "Webhook Events - delitip",
  description: "Every payment-provider webhook delitip has received.",
};

const AdminWebhookEventsPage: FC = () => {
  return (
    <PlatformAdminGuard>
      <AdminWebhookEventsPageContent />
    </PlatformAdminGuard>
  );
};

export default AdminWebhookEventsPage;
