import { type FC } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AuthSignUpPanel } from "../components/auth-sign-up-panel";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations("auth.signUp");
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
};

const AuthSignUpPage: FC = () => {
  return <AuthSignUpPanel />;
};

export default AuthSignUpPage;
