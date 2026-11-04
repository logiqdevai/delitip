import { type FC, Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AuthSignInPanel } from "../components/auth-sign-in-panel";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations("auth.signIn");
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
};

const AuthSignInPage: FC = () => {
  return (
    <Suspense fallback={null}>
      <AuthSignInPanel />
    </Suspense>
  );
};

export default AuthSignInPage;
