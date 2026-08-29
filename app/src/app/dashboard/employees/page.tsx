import { type FC } from "react";
import { RoleGuard } from "@/components/auth/role-guard";
import { EmployeesPageContent } from "./components/employees-page-content";

const EmployeesPage: FC = () => {
  return (
    <RoleGuard deniedRoles={["ACCOUNTANT"]}>
      <EmployeesPageContent />
    </RoleGuard>
  );
};

export default EmployeesPage;
