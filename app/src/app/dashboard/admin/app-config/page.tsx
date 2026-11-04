import { type FC } from "react";
import { type Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PlatformAdminGuard } from "@/components/auth/platform-admin-guard";
import { AdminAppConfigPageContent } from "./components/admin-app-config-page-content";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("dashboard.adminSystem.appConfig.metadata");
  return { title: t("title"), description: t("description") };
}

const AdminAppConfigPage: FC = () => {
  return (
    <PlatformAdminGuard>
      <AdminAppConfigPageContent />
    </PlatformAdminGuard>
  );
};

export default AdminAppConfigPage;
