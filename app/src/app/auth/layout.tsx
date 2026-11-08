import { type FC, type ReactNode } from "react";
import { type Metadata } from "next";
import { AuthShell } from "./components/auth-shell";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
  return <AuthShell>{children}</AuthShell>;
};

export default AuthLayout;
