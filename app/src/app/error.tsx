"use client";

import { type FC, useEffect } from "react";
import { useTranslations } from "next-intl";
import { AppStatusPage } from "@/components/system/app-status-page";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const ErrorPage: FC<ErrorPageProps> = ({ error, reset }) => {
  const t = useTranslations("errors.page");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <AppStatusPage
      code="500"
      title={t("errorTitle")}
      description={t("errorDescription")}
      onTryAgain={reset}
      digest={error.digest}
    />
  );
};

export default ErrorPage;
