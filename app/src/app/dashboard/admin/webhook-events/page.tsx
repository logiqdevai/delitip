import { type FC } from "react";
import { type Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PlatformAdminGuard } from "@/components/auth/platform-admin-guard";
import { AdminWebhookEventsPageContent } from "./components/admin-webhook-events-page-content";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations("dashboard.admin.meta.webhookEvents");
  return { title: t("title"), description: t("description") };
};

const AdminWebhookEventsPage: FC = () => {
  return (
    <PlatformAdminGuard>
      <AdminWebhookEventsPageContent />
    </PlatformAdminGuard>
  );
};

export default AdminWebhookEventsPage;
