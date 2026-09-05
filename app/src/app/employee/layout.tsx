import { type FC, type ReactNode } from "react";
import { type Metadata } from "next";
import { EmployeeAuthShell } from "./components/employee-auth-shell";

export const metadata: Metadata = {
  title: "Employee Portal - delitip",
  description:
    "View tips, customer reviews, and your personal QR code as a delitip employee.",
};

interface EmployeeLayoutProps {
  children: ReactNode;
}

const EmployeeLayout: FC<EmployeeLayoutProps> = ({ children }) => {
  return <EmployeeAuthShell>{children}</EmployeeAuthShell>;
};

export default EmployeeLayout;
