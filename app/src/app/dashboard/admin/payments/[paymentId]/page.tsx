import { type FC } from "react";
import { PlatformAdminGuard } from "@/components/auth/platform-admin-guard";
import { AdminPaymentDetailPageContent } from "./components/admin-payment-detail-page-content";

const AdminPaymentDetailPage: FC<{
  params: Promise<{ paymentId: string }>;
}> = async ({ params }) => {
  const { paymentId } = await params;
  return (
    <PlatformAdminGuard>
      <AdminPaymentDetailPageContent paymentId={paymentId} />
    </PlatformAdminGuard>
  );
};

export default AdminPaymentDetailPage;
