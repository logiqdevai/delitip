import { type FC } from "react";
import { type Metadata } from "next";
import { PlatformAdminGuard } from "@/components/auth/platform-admin-guard";
import { AllUsersPageContent } from "./components/all-users-page-content";

export const metadata: Metadata = {
  title: "All Users - delitip",
  description: "Platform-wide directory of every registered delitip user.",
};

const AdminUsersPage: FC = () => {
  return (
    <PlatformAdminGuard>
      <AllUsersPageContent />
    </PlatformAdminGuard>
  );
};

export default AdminUsersPage;
