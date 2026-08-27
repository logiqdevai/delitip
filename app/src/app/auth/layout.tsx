import { type FC, type ReactNode } from "react";
import { AuthShell } from "./components/auth-shell";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
  return <AuthShell>{children}</AuthShell>;
};

export default AuthLayout;
