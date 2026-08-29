"use client";

import { type FC, type ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DetailSkeleton } from "@/components/ui/detail-skeleton";
import { useMyAccounts } from "@/features/users/hooks/use-users";
import { useAuthHydrated } from "@/hooks/use-auth-hydrated";
import { Routes } from "@/routes/routes";
import { useAuthStore } from "@/stores/auth.store";

type AuthPortal = "dashboard" | "employee";

interface AuthRouteGuardProps {
  portal: AuthPortal;
  children: ReactNode;
}

export const AuthRouteGuard: FC<AuthRouteGuardProps> = ({
  portal,
  children,
}) => {
  const router = useRouter();
  const hydrated = useAuthHydrated();
  const accessToken = useAuthStore((state) => state.accessToken);
  const accountsQuery = useMyAccounts(hydrated && !!accessToken);

  const signInHref =
    portal === "employee"
      ? `${Routes.auth.sign_in}?role=employee`
      : Routes.auth.sign_in;

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    if (!accessToken) {
      router.replace(signInHref);
      return;
    }

    if (accountsQuery.isLoading || accountsQuery.isFetching) {
      return;
    }

    if (accountsQuery.isError || !accountsQuery.data) {
      router.replace(signInHref);
      return;
    }

    const hasOrganization =
      accountsQuery.data.organization_memberships.length > 0;
    const hasEmployee = accountsQuery.data.employee_accounts.length > 0;

    if (portal === "dashboard" && !hasOrganization) {
      router.replace(hasEmployee ? Routes.employee.root : Routes.onboarding);
      return;
    }

    if (portal === "employee" && !hasEmployee) {
      router.replace(hasOrganization ? Routes.dashboard.root : signInHref);
    }
  }, [
    accessToken,
    accountsQuery.data,
    accountsQuery.isError,
    accountsQuery.isFetching,
    accountsQuery.isLoading,
    hydrated,
    portal,
    router,
    signInHref,
  ]);

  if (!hydrated || !accessToken) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <DetailSkeleton fieldCount={4} />
      </div>
    );
  }

  if (accountsQuery.isLoading || !accountsQuery.data) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <DetailSkeleton fieldCount={4} />
      </div>
    );
  }

  const hasOrganization =
    accountsQuery.data.organization_memberships.length > 0;
  const hasEmployee = accountsQuery.data.employee_accounts.length > 0;

  if (portal === "dashboard" && !hasOrganization) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <DetailSkeleton fieldCount={4} />
      </div>
    );
  }

  if (portal === "employee" && !hasEmployee) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <DetailSkeleton fieldCount={4} />
      </div>
    );
  }

  return children;
};
