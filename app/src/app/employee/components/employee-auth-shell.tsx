"use client";

import { type CSSProperties, type FC, type ReactNode } from "react";
import { AuthRouteGuard } from "@/components/auth/auth-route-guard";
import { SidebarProvider } from "@/components/ui/sidebar";
import { EmployeeCashOutProvider } from "./employee-cash-out-provider";
import { EmployeeSidebar } from "./employee-sidebar";

interface EmployeeAuthShellProps {
  children: ReactNode;
}

export const EmployeeAuthShell: FC<EmployeeAuthShellProps> = ({ children }) => {
  return (
    <AuthRouteGuard portal="employee">
      <EmployeeCashOutProvider>
        <SidebarProvider
          className="h-svh flex-col overflow-hidden bg-paper-offwhite text-ink-charcoal antialiased md:flex-row"
          style={{ "--sidebar-width-icon": "4.5rem" } as CSSProperties}
        >
          <EmployeeSidebar />
          <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto">
            <div className="mx-auto w-full min-w-0 max-w-6xl flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
              {children}
            </div>
            <footer className="w-full border-t border-zinc-200/60 bg-white px-4 py-4 text-center text-xs text-zinc-400">
              <p>
                © 2026{" "}
                <strong className="font-semibold text-zinc-700">
                  delitip
                </strong>{" "}
                • Transparent Direct Tipping for Service Staff
              </p>
            </footer>
          </main>
        </SidebarProvider>
      </EmployeeCashOutProvider>
    </AuthRouteGuard>
  );
};
