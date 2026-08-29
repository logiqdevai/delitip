"use client";

import { type FC, type ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { OrganizationRole } from "@/features/organizations/interfaces/organizations.interfaces";
import { useWorkspace } from "@/features/stores/hooks/use-workspace";
import { Routes } from "@/routes/routes";

interface RoleGuardProps {
  deniedRoles: OrganizationRole[];
  children: ReactNode;
}

/**
 * Blocks direct URL access to a dashboard page for roles that shouldn't see
 * it, matching the sidebar's nav-item gating (4.6). The API is still the
 * authoritative permission check for writes — this only prevents a hidden
 * page from silently rendering for someone who navigates to it directly.
 */
export const RoleGuard: FC<RoleGuardProps> = ({ deniedRoles, children }) => {
  const router = useRouter();
  const { role, isPending } = useWorkspace();
  const isDenied = !!role && deniedRoles.includes(role);

  useEffect(() => {
    if (isPending || !isDenied) return;
    router.replace(Routes.dashboard.root);
  }, [isPending, isDenied, router]);

  if (isDenied) {
    return null;
  }

  return <>{children}</>;
};
