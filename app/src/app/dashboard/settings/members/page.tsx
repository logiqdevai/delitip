"use client";

import { type FC, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PlatformAuthRoles } from "@/features/auth/interfaces/auth.interfaces";
import { useMe } from "@/features/users/hooks/use-users";
import { Routes } from "@/routes/routes";
import { useAuthStore } from "@/stores/auth.store";
import { MembersSettingsPanel } from "./components/members-settings-panel";

const MembersSettingsPage: FC = () => {
  const router = useRouter();
  const authUser = useAuthStore((state) => state.user);
  const meQuery = useMe();
  const platformRole = meQuery.data?.role ?? authUser?.role;
  const isRolePending = meQuery.isPending && !authUser?.role;
  const canAccess =
    platformRole === PlatformAuthRoles.ADMIN ||
    platformRole === PlatformAuthRoles.SUPER_ADMIN;

  useEffect(() => {
    if (isRolePending) return;
    if (!canAccess) {
      router.replace(Routes.dashboard.settings.profile);
    }
  }, [canAccess, isRolePending, router]);

  if (isRolePending || !canAccess) {
    return null;
  }

  return <MembersSettingsPanel />;
};

export default MembersSettingsPage;
