import { type FC, type ReactNode } from "react";
import { type Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { DashboardAuthShell } from "./components/dashboard-auth-shell";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations("dashboard.shell.metadata");
  return {
    title: t("title"),
    description: t("description"),
    robots: { index: false, follow: false },
  };
};

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: FC<DashboardLayoutProps> = ({ children }) => {
  return <DashboardAuthShell>{children}</DashboardAuthShell>;
};

export default DashboardLayout;
