import {
  OrganizationRoles,
  type OrganizationRole,
} from "@/features/organizations/interfaces/organizations.interfaces";

export const OrganizationRoleFormOptions: {
  id: OrganizationRole;
  labelKey: string;
}[] = [
  {
    id: OrganizationRoles.OWNER,
    labelKey: "dashboard.enums.organizationRole.OWNER",
  },
  {
    id: OrganizationRoles.STORE_MANAGER,
    labelKey: "dashboard.enums.organizationRole.STORE_MANAGER",
  },
  {
    id: OrganizationRoles.ACCOUNTANT,
    labelKey: "dashboard.enums.organizationRole.ACCOUNTANT",
  },
];
