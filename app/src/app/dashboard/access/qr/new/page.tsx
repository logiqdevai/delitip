import { type FC } from "react";
import { RoleGuard } from "@/components/auth/role-guard";
import { QrEditorPage } from "@/app/dashboard/access/qr/components/qr-editor-page";

const NewQrCodePage: FC = () => {
  return (
    <RoleGuard deniedRoles={["ACCOUNTANT"]}>
      <QrEditorPage />
    </RoleGuard>
  );
};

export default NewQrCodePage;
