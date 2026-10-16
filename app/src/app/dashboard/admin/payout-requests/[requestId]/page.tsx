import { type FC } from "react";
import type { Metadata } from "next";
import { PlatformAdminGuard } from "@/components/auth/platform-admin-guard";
import { AdminPayoutRequestDetailPageContent } from "./components/admin-payout-request-detail-page-content";

export const metadata: Metadata = {
  title: "Payout request - delitip",
  description: "Review a store's invoice and approve or reject its payout.",
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
