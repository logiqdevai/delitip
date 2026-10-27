import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import { TooltipProvider } from "@/components/ui/tooltip";
import { environments } from "@/config/environments";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(environments.siteUrl),
  title: "delitip - Reward great service. Digital Tipping & Employee Feedback",
  description:
    "delitip is the modern digital tipping and employee feedback platform for restaurants, cafés, bars, hotels, and salons.",
  twitter: {
    card: "summary_large_image",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#C8F169" },
    { media: "(prefers-color-scheme: dark)", color: "#181A1B" },
  ],
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await getLocale();

  return (
    <html lang={locale} data-scroll-behavior="smooth" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-full flex-col bg-paper-offwhite text-ink-charcoal">
        <NextIntlClientProvider>
          <Providers>
            <TooltipProvider>{children}</TooltipProvider>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
