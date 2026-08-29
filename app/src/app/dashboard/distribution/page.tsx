import { type FC } from "react";
import { RoleGuard } from "@/components/auth/role-guard";
import { DistributionPageContent } from "./components/distribution-page-content";

const DistributionPage: FC = () => {
  return (
    <RoleGuard deniedRoles={["ACCOUNTANT"]}>
      <DistributionPageContent />
    </RoleGuard>
  );
};

export default DistributionPage;
