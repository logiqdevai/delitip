import {
  PlatformAuthRoles,
  type PlatformAuthRole,
} from "@/features/auth/interfaces/auth.interfaces";

export const UserPlatformRoleFormOptions: {
  id: PlatformAuthRole;
  label: string;
}[] = [
  { id: PlatformAuthRoles.USER, label: "User" },
  { id: PlatformAuthRoles.SUPPORT, label: "Support" },
  { id: PlatformAuthRoles.ADMIN, label: "Admin" },
  { id: PlatformAuthRoles.SUPER_ADMIN, label: "Super Admin" },
];

export function getUserPlatformRoleLabel(
  role: PlatformAuthRole | string | null | undefined,
): string {
  if (!role) return "User";
  return (
    UserPlatformRoleFormOptions.find((option) => option.id === role)
      ?.label ?? role
  );
}
