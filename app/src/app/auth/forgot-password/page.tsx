import { type FC, Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AuthForgotPasswordForm } from "../components/auth-forgot-password-form";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations("auth.forgotPassword");
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
};

const ForgotPasswordPage: FC = () => {
  return (
    <Suspense fallback={null}>
      <AuthForgotPasswordForm />
    </Suspense>
  );
};

export default ForgotPasswordPage;
