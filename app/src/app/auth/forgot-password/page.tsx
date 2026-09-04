import { type FC, Suspense } from "react";
import type { Metadata } from "next";
import { AuthForgotPasswordForm } from "../components/auth-forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot Password — delitip",
  description: "Request a password reset link for your delitip account.",
};

const ForgotPasswordPage: FC = () => {
  return (
    <Suspense fallback={null}>
      <AuthForgotPasswordForm />
    </Suspense>
  );
};

export default ForgotPasswordPage;
