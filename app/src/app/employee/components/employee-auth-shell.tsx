"use client";

import { type FC, type ReactNode } from "react";
import { AuthRouteGuard } from "@/components/auth/auth-route-guard";
import { EmployeeCashOutProvider } from "./employee-cash-out-provider";
import { EmployeeHeader } from "./employee-header";
import { EmployeeNav } from "./employee-nav";

interface EmployeeAuthShellProps {
  children: ReactNode;
}

export const EmployeeAuthShell: FC<EmployeeAuthShellProps> = ({ children }) => {
  return (
    <AuthRouteGuard portal="employee">
      <EmployeeCashOutProvider>
        <div className="flex min-h-screen flex-col bg-paper-offwhite text-ink-charcoal antialiased">
          <EmployeeHeader />
          <main className="mx-auto w-full max-w-6xl flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
            <EmployeeNav />
            {children}
          </main>
          <footer className="w-full border-t border-zinc-200/60 bg-white py-4 text-center text-xs text-zinc-400">
            <p>
              © 2026{" "}
              <strong className="font-semibold text-zinc-700">
                delitip.com
              </strong>{" "}
              • Transparent Direct Tipping for Service Staff
            </p>
          </footer>
        </div>
      </EmployeeCashOutProvider>
    </AuthRouteGuard>
  );
};
