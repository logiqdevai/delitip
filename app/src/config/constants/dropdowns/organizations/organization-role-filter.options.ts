import type { OrganizationRole } from "@/features/organizations/interfaces/organizations.interfaces";
import { OrganizationRoleFormOptions } from "@/config/constants/dropdowns/organizations/organization-role-form.options";
import type { DropdownOptionSource } from "@/hooks/use-dropdown-options";

export const OrganizationRoleFilterOptions: DropdownOptionSource<OrganizationRole>[] =
  [
    { id: "all", labelKey: "dashboard.enums.organizationRole.all" },
    ...OrganizationRoleFormOptions,
  ];
