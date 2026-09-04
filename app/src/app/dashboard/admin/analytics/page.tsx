import { type FC } from "react";
import { type Metadata } from "next";
import { PlatformAdminGuard } from "@/components/auth/platform-admin-guard";
import { AdminAnalyticsPageContent } from "./components/admin-analytics-page-content";

export const metadata: Metadata = {
  title: "Analytics — delitip",
  description: "Platform-wide usage and revenue overview for delitip staff.",
};

const AdminAnalyticsPage: FC = () => {
  return (
    <PlatformAdminGuard>
      <AdminAnalyticsPageContent />
    </PlatformAdminGuard>
  );
};

export default AdminAnalyticsPage;
