import { type FC } from "react";
import { type Metadata } from "next";
import { PlatformAdminGuard } from "@/components/auth/platform-admin-guard";
import { AdminAppConfigPageContent } from "./components/admin-app-config-page-content";

export const metadata: Metadata = {
  title: "App Config - delitip",
  description: "Platform-wide commission, fee estimate and payout settings.",
};

const AdminAppConfigPage: FC = () => {
  return (
    <PlatformAdminGuard>
      <AdminAppConfigPageContent />
    </PlatformAdminGuard>
  );
};

export default AdminAppConfigPage;
