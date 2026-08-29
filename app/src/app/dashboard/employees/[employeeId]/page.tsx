import { type FC } from "react";
import { RoleGuard } from "@/components/auth/role-guard";
import { EmployeeDetailPageContent } from "@/app/dashboard/employees/[employeeId]/components/employee-detail-page-content";

const EmployeeDetailPage: FC<{
  params: Promise<{ employeeId: string }>;
}> = async ({ params }) => {
  const { employeeId } = await params;
  return (
    <RoleGuard deniedRoles={["ACCOUNTANT"]}>
      <EmployeeDetailPageContent employeeId={employeeId} />
    </RoleGuard>
  );
};

export default EmployeeDetailPage;
