import { type FC } from "react";
import { type Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PlatformAdminGuard } from "@/components/auth/platform-admin-guard";
import { AdminAnalyticsPageContent } from "./components/admin-analytics-page-content";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("dashboard.adminSystem.analytics.metadata");
  return { title: t("title"), description: t("description") };
}

const AdminAnalyticsPage: FC = () => {
  return (
    <PlatformAdminGuard>
      <AdminAnalyticsPageContent />
    </PlatformAdminGuard>
  );
};

export default AdminAnalyticsPage;
