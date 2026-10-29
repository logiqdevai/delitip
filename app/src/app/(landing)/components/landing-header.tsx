"use client";

import { type FC, useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { BrandMark } from "@/components/brand/brand-mark";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { Routes } from "@/routes/routes";
import { cn } from "@/lib/utils";

const SCROLL_THRESHOLD_PX = 80;

const navLinks = [
  { href: Routes.landing.about, labelKey: "about", hidden: false },
  { href: Routes.landing.howItWorks, labelKey: "howItWorks", hidden: false },
  { href: Routes.landing.faq, labelKey: "faq", hidden: false },
  { href: Routes.landing.calculator, labelKey: "estimate", hidden: true },
  { href: Routes.landing.pricing, labelKey: "pricing", hidden: true },
  { href: Routes.contact, labelKey: "contact", hidden: false },
] as const;

interface LandingHeaderProps {
  alwaysScrolled?: boolean;
}

export const LandingHeader: FC<LandingHeaderProps> = ({ alwaysScrolled = false }) => {
  const t = useTranslations("landing.header");
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const visibleLinks = navLinks.filter((link) => !link.hidden);
  const isScrolled = alwaysScrolled || hasScrolled;

  useEffect(() => {
    if (alwaysScrolled) return;
    const update = () => setHasScrolled(window.scrollY > SCROLL_THRESHOLD_PX);
    const frame = window.requestAnimationFrame(update);
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
    };
  }, [alwaysScrolled]);

  useEffect(() => {
    if (!isMenuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const onBreakpoint = (event: MediaQueryListEvent) => {
      if (event.matches) setIsMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    mediaQuery.addEventListener("change", onBreakpoint);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      mediaQuery.removeEventListener("change", onBreakpoint);
    };
  }, [isMenuOpen]);

  return (
    <div
      className={cn(
        "fixed z-50 text-ink-foreground transition-all duration-300",
        isScrolled
          ? "inset-x-3 top-2 rounded-[2rem] border border-white/10 bg-ink-charcoal/90 backdrop-blur-md sm:inset-x-4 sm:rounded-[2.5rem] lg:inset-x-0 lg:top-0 lg:rounded-none lg:border-x-0 lg:border-t-0"
          : "inset-x-0 top-4 rounded-[2rem] border border-transparent sm:rounded-[2.5rem]"
      )}
    >
      <header
        className={cn(
          "relative mx-auto flex items-center justify-between px-6 transition-all duration-300 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:px-16",
          isScrolled ? "h-16" : "h-[5.75rem]"
        )}
      >
        <Link href={Routes.home} className="flex items-center gap-2 font-bold">
          <BrandMark size="sm" />
          <span className="text-ink-foreground">delitip</span>
        </Link>

        <nav className="hidden gap-8 text-sm text-ink-foreground/70 lg:flex">
          {visibleLinks.map((link) => (
            <Link
              key={link.labelKey}
              href={link.href}
              className="transition hover:text-electric-lime"
            >
              {t(link.labelKey)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 lg:justify-self-end">
          <LanguageSwitcher className="hidden lg:inline-flex" />
          <Link
            href={Routes.auth.sign_up}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-electric-lime px-4 text-sm font-bold text-ink-charcoal transition duration-200 ease-out hover:scale-[1.03]"
          >
            {t("createAccount")}
          </Link>
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-controls="landing-mobile-menu"
            aria-label={t(isMenuOpen ? "closeMenu" : "openMenu")}
            className="flex size-10 items-center justify-center rounded-full border border-white/15 text-ink-foreground transition hover:border-electric-lime/40 hover:text-electric-lime lg:hidden"
          >
            {isMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              id="landing-mobile-menu"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute inset-x-4 top-full mt-2 rounded-3xl border border-white/15 bg-[#26292B] p-4 shadow-2xl shadow-black/40 lg:hidden"
            >
              <nav className="flex flex-col">
                {visibleLinks.map((link) => (
                  <Link
                    key={link.labelKey}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="rounded-2xl px-4 py-3 text-base font-medium text-ink-foreground/80 transition hover:bg-white/5 hover:text-electric-lime"
                  >
                    {t(link.labelKey)}
                  </Link>
                ))}
              </nav>
              <div className="mt-2 flex items-center justify-between border-t border-white/10 px-4 pt-4">
                <span className="text-sm text-ink-foreground/60">
                  {t("language")}
                </span>
                <LanguageSwitcher />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </div>
  );
};
