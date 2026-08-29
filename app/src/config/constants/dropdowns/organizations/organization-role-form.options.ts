import {
  OrganizationRoles,
  type OrganizationRole,
} from "@/features/organizations/interfaces/organizations.interfaces";

export const OrganizationRoleFormOptions: {
  id: OrganizationRole;
  label: string;
}[] = [
  { id: OrganizationRoles.OWNER, label: "Owner" },
  { id: OrganizationRoles.STORE_MANAGER, label: "Store manager" },
  { id: OrganizationRoles.ACCOUNTANT, label: "Accountant" },
];

export function getOrganizationRoleLabel(
  role: OrganizationRole | string,
): string {
  return (
    OrganizationRoleFormOptions.find((option) => option.id === role)?.label ??
    role
  );
}
