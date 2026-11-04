import { type FC } from "react";
import { type Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PlatformAdminGuard } from "@/components/auth/platform-admin-guard";
import { AdminChangelogPageContent } from "./components/admin-changelog-page-content";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("dashboard.adminSystem.changelog.metadata");
  return { title: t("title"), description: t("description") };
}

const AdminChangelogPage: FC = () => {
  return (
    <PlatformAdminGuard>
      <AdminChangelogPageContent />
    </PlatformAdminGuard>
  );
};

export default AdminChangelogPage;
