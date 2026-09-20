import { type FC } from "react";
import { type Metadata } from "next";
import { PlatformAdminGuard } from "@/components/auth/platform-admin-guard";
import { AdminChangelogPageContent } from "./components/admin-changelog-page-content";

export const metadata: Metadata = {
  title: "Changelog - delitip",
  description: "Everything shipped to delitip, newest first.",
};

const AdminChangelogPage: FC = () => {
  return (
    <PlatformAdminGuard>
      <AdminChangelogPageContent />
    </PlatformAdminGuard>
  );
};

export default AdminChangelogPage;
