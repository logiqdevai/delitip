import { type FC } from "react";
import { RoleGuard } from "@/components/auth/role-guard";
import { AccessPageContent } from "./components/access-page-content";

const AccessPage: FC = () => {
  return (
    <RoleGuard deniedRoles={["ACCOUNTANT"]}>
      <AccessPageContent />
    </RoleGuard>
  );
};

export default AccessPage;
