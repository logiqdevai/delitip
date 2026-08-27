import { type FC } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BrandMark } from "@/components/brand/brand-mark";
import { Routes } from "@/routes/routes";

const navLinks = [
  { href: Routes.landing.howItWorks, label: "How it works" },
  { href: Routes.landing.ecosystem, label: "For teams" },
  { href: Routes.landing.calculator, label: "Estimate" },
  { href: Routes.landing.pricing, label: "Pricing" },
] as const;

export const LandingHeader: FC = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href={Routes.home} className="flex items-center gap-2.5">
          <BrandMark />
          <span className="text-lg font-extrabold tracking-tight text-ink-charcoal">
            deli<span className="font-semibold text-electric-lime">tip</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-xs font-semibold text-zinc-600 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="transition hover:text-zinc-950"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href={Routes.auth.sign_in}
            className="hidden px-3 py-2 text-xs font-bold text-zinc-700 transition hover:text-zinc-950 sm:inline-block"
          >
            Sign in
          </Link>
          <Link
            href={Routes.auth.sign_up}
            className="flex items-center gap-1.5 rounded-xl bg-electric-lime px-4 py-2.5 text-xs font-bold text-ink-charcoal shadow-lg shadow-electric-lime/30 transition hover:bg-brand-700"
          >
            <span>Create account</span>
            <ArrowRight className="size-3.5" strokeWidth={2} />
          </Link>
        </div>
      </div>
    </header>
  );
};
