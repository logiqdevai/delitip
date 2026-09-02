"use client";

import { type FC, useEffect } from "react";
import { AppStatusPage } from "@/components/system/app-status-page";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const ErrorPage: FC<ErrorPageProps> = ({ error, reset }) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <AppStatusPage
      code="500"
      title="This page couldn't load"
      description="Something went wrong on our side. Try again, or go back and continue from where you left off."
      onTryAgain={reset}
      digest={error.digest}
    />
  );
};

export default ErrorPage;
