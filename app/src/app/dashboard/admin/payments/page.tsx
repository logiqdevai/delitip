import { type FC } from "react";
import { type Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PlatformAdminGuard } from "@/components/auth/platform-admin-guard";
import { AdminFinancePageContent } from "./components/admin-finance-page-content";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations("dashboard.admin.meta.finance");
  return { title: t("title"), description: t("description") };
};

const AdminFinancePage: FC = () => {
  return (
    <PlatformAdminGuard>
      <AdminFinancePageContent />
    </PlatformAdminGuard>
  );
};

export default AdminFinancePage;
