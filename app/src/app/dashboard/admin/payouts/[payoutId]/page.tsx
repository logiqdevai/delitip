import { type FC } from "react";
import { PlatformAdminGuard } from "@/components/auth/platform-admin-guard";
import { AdminPayoutDetailPageContent } from "./components/admin-payout-detail-page-content";

const AdminPayoutDetailPage: FC<{
  params: Promise<{ payoutId: string }>;
}> = async ({ params }) => {
  const { payoutId } = await params;
  return (
    <PlatformAdminGuard>
      <AdminPayoutDetailPageContent payoutId={payoutId} />
    </PlatformAdminGuard>
  );
};

export default AdminPayoutDetailPage;
