"use client";

import { type FC } from "react";
import { SectionSidebar } from "@/components/layout/section-sidebar";
import { PlatformAuthRoles } from "@/features/auth/interfaces/auth.interfaces";
import { useMe } from "@/features/users/hooks/use-users";
import { useAuthStore } from "@/stores/auth.store";
import { settingsNavItems } from "./settings-nav-items";

export const SettingsSidebar: FC = () => {
  const authUser = useAuthStore((state) => state.user);
  const meQuery = useMe();
  const platformRole = meQuery.data?.role ?? authUser?.role;
  const isPlatformAdmin =
    platformRole === PlatformAuthRoles.ADMIN ||
    platformRole === PlatformAuthRoles.SUPER_ADMIN;

  const items = settingsNavItems.filter(
    (item) => !item.requiresPlatformAdmin || isPlatformAdmin,
  );

  return <SectionSidebar items={items} />;
};
