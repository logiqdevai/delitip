import { type FC } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { NotFoundStatusPage } from "@/components/system/app-status-page";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations("errors.page");
  return {
    title: t("notFoundMetaTitle"),
    description: t("notFoundMetaDescription"),
  };
};

const NotFoundPage: FC = () => {
  return <NotFoundStatusPage />;
};

export default NotFoundPage;
