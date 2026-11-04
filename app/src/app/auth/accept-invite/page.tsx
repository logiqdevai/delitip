import { type FC, Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AuthAcceptInviteForm } from "../components/auth-accept-invite-form";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations("auth.acceptInvite");
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
};

const AcceptInvitePage: FC = () => {
  return (
    <Suspense fallback={null}>
      <AuthAcceptInviteForm />
    </Suspense>
  );
};

export default AcceptInvitePage;
