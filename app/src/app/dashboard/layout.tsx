import { type FC, type ReactNode } from "react";
import { type Metadata } from "next";
import { DashboardSidebar } from "./components/dashboard-sidebar";

export const metadata: Metadata = {
  title: "Dashboard — delitip.com",
  description:
    "Manage tips, employees, reviews, and QR access for your business.",
};

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 text-ink-charcoal antialiased md:flex-row md:overflow-hidden">
      <DashboardSidebar />
      <main className="flex-1 space-y-6 overflow-y-auto p-4 sm:p-6 lg:p-8 md:h-screen">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
