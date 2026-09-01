"use client";

import { type FC, type ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePlatformRole } from "@/hooks/use-platform-role";
import { Routes } from "@/routes/routes";

interface PlatformAdminGuardProps {
  children: ReactNode;
  fallbackPath?: string;
}

/**
 * Blocks direct URL access to platform-admin-only pages (ADMIN/SUPER_ADMIN),
 * mirroring RoleGuard's org-role gating. The API is still the authoritative
 * permission check — this only prevents a hidden page from rendering for
 * someone who navigates to it directly.
 */
export const PlatformAdminGuard: FC<PlatformAdminGuardProps> = ({
  children,
  fallbackPath = Routes.dashboard.root,
}) => {
  const router = useRouter();
  const { isPlatformAdmin, isPending } = usePlatformRole();

  useEffect(() => {
    if (isPending || isPlatformAdmin) return;
    router.replace(fallbackPath);
  }, [isPending, isPlatformAdmin, fallbackPath, router]);

  if (isPending || !isPlatformAdmin) {
    return null;
  }

  return <>{children}</>;
};
