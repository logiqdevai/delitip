import { type FC } from "react";
import { type Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PlatformAdminGuard } from "@/components/auth/platform-admin-guard";
import { AdminVatSimulatorPageContent } from "./components/admin-vat-simulator-page-content";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("dashboard.adminSystem.vatSimulator.metadata");
  return { title: t("title"), description: t("description") };
}

const AdminVatSimulatorPage: FC = () => {
  return (
    <PlatformAdminGuard>
      <AdminVatSimulatorPageContent />
    </PlatformAdminGuard>
  );
};

export default AdminVatSimulatorPage;
