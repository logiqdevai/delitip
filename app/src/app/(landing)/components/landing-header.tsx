import { type FC } from "react";
import Link from "next/link";
import { BrandMark } from "@/components/brand/brand-mark";
import { Routes } from "@/routes/routes";

const navLinks = [
  { href: Routes.landing.howItWorks, label: "How it works", hidden: false },
  { href: Routes.landing.ecosystem, label: "For teams", hidden: false },
  { href: Routes.landing.calculator, label: "Estimate", hidden: false },
  { href: Routes.landing.pricing, label: "Pricing", hidden: false },
] as const;

export const LandingHeader: FC = () => {
  return (
    <div className="sticky top-0 z-50 border-b border-white/10 bg-ink-charcoal text-ink-foreground">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link href={Routes.home} className="flex items-center gap-2 font-bold">
          <BrandMark size="sm" />
          <span className="text-ink-foreground">delitip</span>
        </Link>

        <nav className="hidden gap-8 text-sm text-ink-foreground/70 md:flex">
          {navLinks
            .filter((link) => !link.hidden)
            .map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="transition hover:text-electric-lime"
              >
                {link.label}
              </Link>
            ))}
        </nav>

        <Link
          href={Routes.auth.sign_up}
          className="rounded-full border border-electric-lime/40 px-4 py-2 text-sm font-semibold text-electric-lime transition hover:bg-electric-lime hover:text-ink-charcoal"
        >
          Create account
        </Link>
      </header>
    </div>
  );
};
