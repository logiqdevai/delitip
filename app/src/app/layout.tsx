import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import { TooltipProvider } from "@/components/ui/tooltip";
import { environments } from "@/config/environments";
import { Providers } from "./providers";
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
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      className={`${plusJakartaSans.variable} ${geistMono.variable} h-full antialiased`}
    >
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
