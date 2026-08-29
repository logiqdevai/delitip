import { type FC, type ReactNode } from "react";
import { type Metadata } from "next";
import { DashboardAuthShell } from "./components/dashboard-auth-shell";

export const metadata: Metadata = {
  title: "Dashboard — delitip.com",
  description:
    "Manage tips, employees, reviews, and QR access for your business.",
};

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: FC<DashboardLayoutProps> = ({ children }) => {
  return <DashboardAuthShell>{children}</DashboardAuthShell>;
};

export default DashboardLayout;
