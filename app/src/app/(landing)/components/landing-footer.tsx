import { type FC } from "react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Routes } from "@/routes/routes";
import { BrandMark } from "@/components/brand/brand-mark";
import { VivaBadge } from "@/components/payments/viva-badge";
import { SiteConfig } from "@/config/site";

const productLinks = [
  { href: Routes.landing.about, labelKey: "aboutUs", hidden: false },
  { href: Routes.landing.howItWorks, labelKey: "howItWorks", hidden: false },
  { href: Routes.auth.sign_up, labelKey: "ourPlatform", hidden: false },
  { href: Routes.contact, labelKey: "contact", hidden: false },
] as const;

const trustLinks = [
  { href: Routes.help.root, labelKey: "helpCenter" },
  { href: Routes.legal.privacy, labelKey: "privacy" },
  { href: Routes.legal.terms, labelKey: "terms" },
] as const;

export const LandingFooter: FC = async () => {
  const t = await getTranslations("landing.footer");

  return (
    <footer className="p-3 sm:p-4">
      <div className="overflow-hidden rounded-[2rem] bg-ink-charcoal py-14 text-xs text-zinc-400 sm:rounded-[2.5rem]">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 md:grid-cols-5 lg:px-8">
        <div className="space-y-3 md:col-span-2">
          <div className="flex items-center gap-2.5">
            <BrandMark size="sm" />
            <span className="text-base font-extrabold tracking-tight text-paper-offwhite">
              delitip
            </span>
          </div>
          <p className="max-w-sm text-xs leading-relaxed text-zinc-500">
            {t("description")}
          </p>
          <VivaBadge label={t("paymentsBy")} className="justify-start text-zinc-500" />
        </div>

        <div className="space-y-2">
          <span className="block text-xs font-bold tracking-wider text-paper-offwhite uppercase">
            {t("product.title")}
          </span>
          <ul className="space-y-1.5 text-zinc-400">
            {productLinks.filter((link) => !link.hidden).map((link) => (
              <li key={link.labelKey}>
                <Link
                  href={link.href}
                  className="transition hover:text-paper-offwhite"
                >
                  {t(`product.${link.labelKey}`)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-2">
          <span className="block text-xs font-bold tracking-wider text-paper-offwhite uppercase">
            {t("trust.title")}
          </span>
          <ul className="space-y-1.5 text-zinc-400">
            {trustLinks.map((link) => (
              <li key={link.labelKey}>
                <Link
                  href={link.href}
                  className="transition hover:text-paper-offwhite"
                >
                  {t(`trust.${link.labelKey}`)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-2">
          <span className="block text-xs font-bold tracking-wider text-paper-offwhite uppercase">
            {t("contactTitle")}
          </span>
          <address className="space-y-0.5 text-zinc-400 not-italic">
            <a
              href={SiteConfig.contactEmailHref}
              className="block transition hover:text-paper-offwhite"
            >
              {SiteConfig.contactEmail}
            </a>
            <span className="block">{t("address")}</span>
          </address>
          <a
            href="https://www.instagram.com/delitip_com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="mt-2 inline-flex items-center gap-2 transition hover:text-paper-offwhite"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.75}
              className="size-6"
              aria-hidden="true"
            >
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
          </a>
        </div>
      </div>

      <div className="mx-auto mt-8 flex max-w-7xl flex-col items-center gap-4 border-t border-zinc-900 px-4 pt-8 text-xs text-zinc-600 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
        <span>{t("copyright")}</span>
        <div className="flex items-center gap-2 text-zinc-500">
          <span>{t("poweredBy")}</span>
          <a href="https://www.logiqdev.com/" target="_blank" rel="noopener noreferrer">
            <img
              src="/logiqdev.png"
              alt="LogiqDev"
              className="w-auto"
              style={{ height: "1.8rem" }}
            />
          </a>
        </div>
      </div>
      </div>
    </footer>
  );
};
