import { type FC } from "react";
import type { Metadata } from "next";
import { AuthForgotPasswordForm } from "../components/auth-forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot Password — delitip.com",
  description: "Request a password reset link for your delitip.com account.",
};

const ForgotPasswordPage: FC = () => {
  return <AuthForgotPasswordForm />;
};

export default ForgotPasswordPage;
