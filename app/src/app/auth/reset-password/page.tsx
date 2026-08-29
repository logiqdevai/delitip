import { type FC, Suspense } from "react";
import type { Metadata } from "next";
import { AuthResetPasswordForm } from "../components/auth-reset-password-form";

export const metadata: Metadata = {
  title: "Reset Password — delitip.com",
  description: "Set a new password for your delitip.com account.",
};

const ResetPasswordPage: FC = () => {
  return (
    <Suspense fallback={null}>
      <AuthResetPasswordForm />
    </Suspense>
  );
};

export default ResetPasswordPage;
