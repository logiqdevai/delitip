import { type FC } from "react";
import type { Metadata } from "next";
import { AuthSignUpPanel } from "../components/auth-sign-up-panel";

export const metadata: Metadata = {
  title: "Create Account — delitip",
  description:
    "Register your business on delitip and start collecting tips and employee feedback in under 2 minutes.",
};

const AuthSignUpPage: FC = () => {
  return <AuthSignUpPanel />;
};

export default AuthSignUpPage;
