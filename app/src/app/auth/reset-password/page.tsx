import { type FC, Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AuthResetPasswordForm } from "../components/auth-reset-password-form";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations("auth.resetPassword");
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
};

const ResetPasswordPage: FC = () => {
  return (
    <Suspense fallback={null}>
      <AuthResetPasswordForm />
    </Suspense>
  );
};

export default ResetPasswordPage;
