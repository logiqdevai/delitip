"use client";

import { type FC } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMyAccounts } from "@/features/users/hooks/use-users";
import { useAuthHydrated } from "@/hooks/use-auth-hydrated";
import { Routes } from "@/routes/routes";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth.store";
import { useEmployeeWorkspaceStore } from "@/stores/employee-workspace.store";
import { useWorkspaceStore } from "@/stores/workspace.store";

interface AccountSwitcherProps {
  className?: string;
  size?: "sm" | "default";
}

export const AccountSwitcher: FC<AccountSwitcherProps> = ({
  className,
  size = "sm",
}) => {
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

  const items = [
    ...orgOptions.map((membership) => ({
      label: `${membership.organization.name} (Business)`,
      value: `org:${membership.organization_id}`,
    })),
    ...employeeAccounts.map((account) => ({
      label: `${account.store.name} (Employee)`,
      value: `employee:${account.id}`,
    })),
  ];

  return (
    <Select
      items={items}
      value={currentKey}
      onValueChange={(value) => {
        if (value) handleChange(value);
      }}
    >
      <SelectTrigger
        size={size}
        aria-label="Switch account"
        className={cn("max-w-[9.5rem] sm:max-w-[14rem]", className)}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
