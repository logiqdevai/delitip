import { type FC } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PlatformAdminGuard } from "@/components/auth/platform-admin-guard";
import { AdminPayoutRequestDetailPageContent } from "./components/admin-payout-request-detail-page-content";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations("dashboard.admin.meta.payoutRequest");
  return { title: t("title"), description: t("description") };
};

const AdminPayoutRequestDetailPage: FC<{
  params: Promise<{ requestId: string }>;
}> = async ({ params }) => {
  const { requestId } = await params;
  return (
    <PlatformAdminGuard>
      <AdminPayoutRequestDetailPageContent requestId={requestId} />
    </PlatformAdminGuard>
  );
};

export default AdminPayoutRequestDetailPage;
