import { type FC, type ReactNode } from "react";
import Link from "next/link";
import { Lock } from "lucide-react";
import { BrandMark } from "@/components/brand/brand-mark";
import { Routes } from "@/routes/routes";
import { AuthBrandPanel } from "./auth-brand-panel";

interface AuthShellProps {
  children: ReactNode;
}

export const AuthShell: FC<AuthShellProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col justify-between bg-paper-offwhite text-ink-charcoal antialiased">
      <header className="sticky top-0 z-50 flex w-full items-center justify-between border-b border-zinc-200/70 bg-white/80 px-6 py-4 backdrop-blur-md">
        <Link href={Routes.home} className="flex items-center gap-3">
          <BrandMark />
          <span className="text-base font-bold tracking-tight text-ink-charcoal">
            delitip
            <span className="font-semibold text-electric-lime">.com</span>
          </span>
        </Link>
        <div className="flex items-center gap-3 text-xs">
          <span className="hidden text-zinc-500 sm:inline-block">
            Need help?
          </span>
          <Link
            href={Routes.contact}
            className="font-semibold text-zinc-700 transition hover:text-ink-charcoal"
          >
            Contact Support
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="grid min-h-[640px] w-full max-w-5xl grid-cols-1 overflow-hidden rounded-3xl border border-zinc-200/80 bg-white shadow-xl shadow-zinc-200/50 lg:grid-cols-12">
          <div className="flex flex-col justify-between p-6 sm:p-10 lg:col-span-7 lg:p-12">
            {children}
            <div className="flex items-center justify-between border-t border-zinc-100 pt-8 text-xs text-zinc-400">
              <div className="flex items-center gap-1.5">
                <Lock
                  className="size-3.5 text-electric-lime"
                  strokeWidth={2}
                />
                <span>256-bit bank-grade encryption</span>
              </div>
              <span className="font-medium text-zinc-500">delitip.com</span>
            </div>
          </div>
          <AuthBrandPanel />
        </div>
      </main>

      <footer className="w-full border-t border-zinc-200/60 bg-white py-4 text-center text-xs text-zinc-400">
        <p>
          © 2026{" "}
          <strong className="font-semibold text-zinc-700">delitip.com</strong>.
          All rights reserved. • Tip. Appreciate. Connect.
        </p>
      </footer>
    </div>
  );
};
