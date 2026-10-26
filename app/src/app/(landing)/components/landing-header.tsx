"use client";

import { type FC, useEffect, useState } from "react";
import Link from "next/link";
import { BrandMark } from "@/components/brand/brand-mark";
import { Routes } from "@/routes/routes";
import { cn } from "@/lib/utils";

const SCROLL_THRESHOLD_PX = 80;

const navLinks = [
  { href: Routes.landing.howItWorks, label: "How it works", hidden: false },
  { href: Routes.landing.ecosystem, label: "For teams", hidden: false },
  { href: Routes.landing.calculator, label: "Estimate", hidden: false },
  { href: Routes.landing.pricing, label: "Pricing", hidden: true },
] as const;

export const LandingHeader: FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const update = () => setIsScrolled(window.scrollY > SCROLL_THRESHOLD_PX);
    const frame = window.requestAnimationFrame(update);
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
    };
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-x-0 z-50 text-ink-foreground transition-all duration-300",
        isScrolled
          ? "top-0 border-b border-white/10 bg-ink-charcoal/90 backdrop-blur-md"
          : "top-4 border-b border-transparent"
      )}
    >
      <header
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between px-12 transition-all duration-300",
          isScrolled ? "h-16" : "h-[5.75rem]"
        )}
      >
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
