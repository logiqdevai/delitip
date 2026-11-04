import {
  PlatformAuthRoles,
  type PlatformAuthRole,
} from "@/features/auth/interfaces/auth.interfaces";

export const UserPlatformRoleFormOptions: {
  id: PlatformAuthRole;
  labelKey: string;
}[] = [
  {
    id: PlatformAuthRoles.USER,
    labelKey: "dashboard.enums.userPlatformRole.USER",
  },
  {
    id: PlatformAuthRoles.SUPPORT,
    labelKey: "dashboard.enums.userPlatformRole.SUPPORT",
  },
  {
    id: PlatformAuthRoles.ADMIN,
    labelKey: "dashboard.enums.userPlatformRole.ADMIN",
  },
  {
    id: PlatformAuthRoles.SUPER_ADMIN,
    labelKey: "dashboard.enums.userPlatformRole.SUPER_ADMIN",
  },
];
