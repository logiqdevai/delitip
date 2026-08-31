"use client";

import { type CSSProperties, type FC, type ReactNode } from "react";
import { AuthRouteGuard } from "@/components/auth/auth-route-guard";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/layout/sidebar/dashboard-sidebar";

interface DashboardAuthShellProps {
  children: ReactNode;
}

export const DashboardAuthShell: FC<DashboardAuthShellProps> = ({
  children,
}) => {
  return (
    <AuthRouteGuard portal="dashboard">
      <SidebarProvider
        className="h-svh flex-col overflow-hidden bg-zinc-50 text-ink-charcoal antialiased md:flex-row"
        style={{ "--sidebar-width-icon": "4.5rem" } as CSSProperties}
      >
        <DashboardSidebar />
        <main className="min-h-0 flex-1 space-y-6 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </SidebarProvider>
    </AuthRouteGuard>
  );
};
