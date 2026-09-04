import { type FC, type ReactNode } from "react";
import Link from "next/link";
import { BrandMark } from "@/components/brand/brand-mark";
import { Routes } from "@/routes/routes";
import { AuthBrandPanel } from "./auth-brand-panel";

interface AuthShellProps {
  children: ReactNode;
}

export const AuthShell: FC<AuthShellProps> = ({ children }) => {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-x-hidden bg-ink-charcoal antialiased lg:items-center lg:justify-center lg:bg-paper-offwhite lg:px-8 lg:py-10 lg:text-ink-charcoal">
      <div className="pointer-events-none absolute inset-0 hidden lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(200,241,105,0.09),transparent_42%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_100%_100%,rgba(24,26,27,0.04),transparent_40%)]" />
      </div>

      <header className="relative z-10 mx-auto hidden w-full max-w-5xl items-center justify-between pb-6 lg:flex">
        <Link href={Routes.home} className="flex items-center gap-3">
          <BrandMark />
          <span className="text-base font-bold tracking-tight text-ink-charcoal">
            delitip
          </span>
        </Link>
        <Link
          href={Routes.contact}
          className="text-xs font-semibold text-zinc-500 transition hover:text-ink-charcoal"
        >
          Contact Support
        </Link>
      </header>

      <div className="relative z-10 flex min-h-dvh w-full flex-col lg:min-h-0 lg:max-w-5xl lg:overflow-hidden lg:rounded-[2rem] lg:bg-white lg:shadow-[0_24px_80px_rgba(24,26,27,0.08)] lg:ring-1 lg:ring-zinc-200/70 lg:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <AuthBrandPanel />

        <section className="relative z-10 -mt-6 flex min-w-0 flex-1 flex-col rounded-t-[2rem] bg-white shadow-[0_-12px_40px_rgba(0,0,0,0.35)] lg:mt-0 lg:rounded-none lg:shadow-none">
          <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 pb-10 pt-7 sm:px-8 sm:pt-8 lg:max-w-none lg:justify-center lg:px-10 lg:py-12 xl:px-12">
            {children}
          </div>
        </section>
      </div>

      <footer className="relative z-10 mx-auto hidden w-full max-w-5xl pt-6 text-caption text-zinc-400 lg:block">
        © 2026 delitip · Tip. Appreciate. Connect.
      </footer>
    </div>
  );
};
