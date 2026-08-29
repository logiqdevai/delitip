import type { OrganizationRole } from "@/features/organizations/interfaces/organizations.interfaces";
import { OrganizationRoleFormOptions } from "@/config/constants/dropdowns/organizations/organization-role-form.options";

export const OrganizationRoleFilterOptions: {
  id: OrganizationRole | "all";
  label: string;
}[] = [{ id: "all", label: "All roles" }, ...OrganizationRoleFormOptions];
