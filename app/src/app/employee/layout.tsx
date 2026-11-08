import { type FC, type ReactNode } from "react";
import { type Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { EmployeeAuthShell } from "./components/employee-auth-shell";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations("employee.metadata");
  return {
    title: t("title"),
    description: t("description"),
    robots: { index: false, follow: false },
  };
};

interface EmployeeLayoutProps {
  children: ReactNode;
}

const EmployeeLayout: FC<EmployeeLayoutProps> = ({ children }) => {
  return <EmployeeAuthShell>{children}</EmployeeAuthShell>;
};

export default EmployeeLayout;
