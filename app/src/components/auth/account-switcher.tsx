"use client";

import { type FC } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { useMyAccounts } from "@/features/users/hooks/use-users";
import { useAuthHydrated } from "@/hooks/use-auth-hydrated";
import { Routes } from "@/routes/routes";
import { useAuthStore } from "@/stores/auth.store";
import { useEmployeeWorkspaceStore } from "@/stores/employee-workspace.store";
import { useWorkspaceStore } from "@/stores/workspace.store";

export const AccountSwitcher: FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const hydrated = useAuthHydrated();
  const accessToken = useAuthStore((state) => state.accessToken);
  const accountsQuery = useMyAccounts(hydrated && !!accessToken);

  const currentOrganizationId = useWorkspaceStore((state) => state.organizationId);
  const switchOrganization = useWorkspaceStore((state) => state.switchOrganization);
  const currentEmployeeAccountId = useEmployeeWorkspaceStore(
    (state) => state.employeeAccountId,
  );
  const setEmployeeAccountId = useEmployeeWorkspaceStore(
    (state) => state.setEmployeeAccountId,
  );

  const memberships = accountsQuery.data?.organization_memberships ?? [];
  const employeeAccounts = accountsQuery.data?.employee_accounts ?? [];

  const orgOptions = Array.from(
    new Map(
      memberships.map((membership) => [
        membership.organization_id,
        membership,
      ]),
    ).values(),
  );

  const totalAccounts = orgOptions.length + employeeAccounts.length;
  if (totalAccounts <= 1) return null;

  const isEmployeeContext = pathname.startsWith(Routes.employee.root);
  const currentKey = isEmployeeContext
    ? `employee:${currentEmployeeAccountId ?? employeeAccounts[0]?.id}`
    : `org:${currentOrganizationId ?? orgOptions[0]?.organization_id}`;

  const handleChange = (value: string) => {
    const [kind, id] = value.split(":");
    if (kind === "org") {
      switchOrganization(id);
      router.push(Routes.dashboard.root);
    } else {
      setEmployeeAccountId(id);
      router.push(Routes.employee.root);
    }
  };

  return (
    <NativeSelect
      value={currentKey}
      onChange={(event) => handleChange(event.target.value)}
      size="sm"
      aria-label="Switch account"
    >
      {orgOptions.map((membership) => (
        <NativeSelectOption
          key={`org:${membership.organization_id}`}
          value={`org:${membership.organization_id}`}
        >
          {membership.organization.name} (Business)
        </NativeSelectOption>
      ))}
      {employeeAccounts.map((account) => (
        <NativeSelectOption key={`employee:${account.id}`} value={`employee:${account.id}`}>
          {account.store.name} (Employee)
        </NativeSelectOption>
      ))}
    </NativeSelect>
  );
};
