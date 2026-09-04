"use client";

import { type FC, useEffect } from "react";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import { AppStatusPage } from "@/components/system/app-status-page";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

interface GlobalErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const GlobalErrorPage: FC<GlobalErrorPageProps> = ({ error, reset }) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${geistMono.variable} h-full antialiased`}
    >
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
