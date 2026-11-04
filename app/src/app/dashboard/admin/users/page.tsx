import { type FC } from "react";
import { type Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PlatformAdminGuard } from "@/components/auth/platform-admin-guard";
import { AllUsersPageContent } from "./components/all-users-page-content";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations("dashboard.admin.meta.users");
  return { title: t("title"), description: t("description") };
};

const AdminUsersPage: FC = () => {
  return (
    <PlatformAdminGuard>
      <AllUsersPageContent />
    </PlatformAdminGuard>
  );
};

export default AdminUsersPage;
