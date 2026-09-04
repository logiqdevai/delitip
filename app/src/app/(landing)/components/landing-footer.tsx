import { type FC } from "react";
import Link from "next/link";
import { Routes } from "@/routes/routes";
import { BrandMark } from "@/components/brand/brand-mark";

const productLinks = [
  { href: Routes.landing.howItWorks, label: "How it works", hidden: false },
  { href: Routes.landing.ecosystem, label: "For businesses", hidden: false },
  { href: Routes.landing.ecosystem, label: "For staff", hidden: false },
  { href: Routes.landing.pricing, label: "Pricing", hidden: true },
] as const;

const industryLinks = [
  "Retail & checkout",
  "Hotels & hospitality",
  "Restaurants & cafés",
  "Bars & lounges",
  "Spas & wellness",
  "Fitness & training",
  "Food trucks",
] as const;

const trustLinks = [
  { href: Routes.help.root, label: "Help Center" },
  { href: Routes.legal.privacy, label: "Privacy Policy" },
  { href: Routes.legal.terms, label: "Terms of Service" },
  { href: Routes.home, label: "Security" },
  { href: Routes.contact, label: "Contact" },
] as const;

export const LandingFooter: FC = () => {
  return (
    <footer className="border-t border-zinc-800 bg-ink-charcoal py-14 text-xs text-zinc-400">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 md:grid-cols-5 lg:px-8">
        <div className="space-y-3 md:col-span-2">
          <div className="flex items-center gap-2.5">
            <BrandMark size="sm" />
            <span className="text-base font-extrabold tracking-tight text-paper-offwhite">
              delitip
              <span className="font-semibold text-electric-lime">.com</span>
            </span>
          </div>
          <p className="max-w-sm text-xs leading-relaxed text-zinc-500">
            Digital tipping and customer feedback for businesses with
            customer-facing teams, from support desks to hospitality.
          </p>
        </div>

        <div className="space-y-2">
          <span className="block text-xs font-bold tracking-wider text-paper-offwhite uppercase">
            Product
          </span>
          <ul className="space-y-1.5 text-zinc-400">
            {productLinks.filter((link) => !link.hidden).map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="transition hover:text-paper-offwhite"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-2">
          <span className="block text-xs font-bold tracking-wider text-paper-offwhite uppercase">
            Industries
          </span>
          <ul className="space-y-1.5 text-zinc-400">
            {industryLinks.map((label) => (
              <li key={label}>
                <Link
                  href={Routes.home}
                  className="transition hover:text-paper-offwhite"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-2">
          <span className="block text-xs font-bold tracking-wider text-paper-offwhite uppercase">
            Trust & security
          </span>
          <ul className="space-y-1.5 text-zinc-400">
            {trustLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="transition hover:text-paper-offwhite"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-7xl border-t border-zinc-900 px-4 pt-8 text-center text-xs text-zinc-600 sm:px-6 lg:px-8">
        © 2026 delitip.com. Tip. Feedback. Recognize.
      </div>
    </footer>
  );
};
