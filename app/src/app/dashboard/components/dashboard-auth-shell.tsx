"use client";

import { type FC, type ReactNode } from "react";
import { AuthRouteGuard } from "@/components/auth/auth-route-guard";
import { DashboardSidebar } from "./dashboard-sidebar";

interface DashboardAuthShellProps {
  children: ReactNode;
}

export const DashboardAuthShell: FC<DashboardAuthShellProps> = ({
  children,
}) => {
  return (
    <AuthRouteGuard portal="dashboard">
      <div className="flex min-h-screen flex-col bg-zinc-50 text-ink-charcoal antialiased md:flex-row md:overflow-hidden">
        <DashboardSidebar />
        <main className="flex-1 space-y-6 overflow-y-auto p-4 sm:p-6 lg:p-8 md:h-screen">
          {children}
        </main>
      </div>
    </AuthRouteGuard>
  );
};
