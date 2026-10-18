import { type FC } from "react";
import { RoleGuard } from "@/components/auth/role-guard";
import { QrEditorPage } from "@/app/dashboard/access/qr/components/qr-editor-page";

const EditQrCodePage: FC<{
  params: Promise<{ id: string }>;
}> = async ({ params }) => {
  const { id } = await params;
  return (
    <RoleGuard deniedRoles={["ACCOUNTANT"]}>
      <QrEditorPage qrId={id} />
    </RoleGuard>
  );
};

export default EditQrCodePage;
