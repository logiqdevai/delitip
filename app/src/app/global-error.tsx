"use client";

import { type FC, useEffect } from "react";
import { AppStatusPage } from "@/components/system/app-status-page";
import "./globals.css";

interface GlobalErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const GlobalErrorPage: FC<GlobalErrorPageProps> = ({ error, reset }) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-full flex-col bg-paper-offwhite text-ink-charcoal">
        <AppStatusPage
          code="500"
          title="This page couldn't load"
          description="Something went wrong on our side. Try again, or go back and continue from where you left off."
          onTryAgain={reset}
          digest={error.digest}
        />
      </body>
    </html>
  );
};

export default GlobalErrorPage;
