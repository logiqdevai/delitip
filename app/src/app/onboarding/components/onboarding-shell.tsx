"use client";

import { type FC, type ReactNode, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { BrandMark } from "@/components/brand/brand-mark";
import { DetailSkeleton } from "@/components/ui/detail-skeleton";
import { useAuthHydrated } from "@/hooks/use-auth-hydrated";
import { Routes } from "@/routes/routes";
import { useAuthStore } from "@/stores/auth.store";

interface OnboardingShellProps {
  children: ReactNode;
}

export const OnboardingShell: FC<OnboardingShellProps> = ({ children }) => {
  const router = useRouter();
  const hydrated = useAuthHydrated();
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    if (!accessToken) {
      router.replace(Routes.auth.sign_in);
    }
  }, [accessToken, hydrated, router]);

  if (!hydrated || !accessToken) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper-offwhite p-6">
        <DetailSkeleton fieldCount={4} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col justify-between bg-paper-offwhite text-ink-charcoal antialiased">
      <header className="sticky top-0 z-50 flex w-full items-center justify-between border-b border-zinc-200/70 bg-white/80 px-6 py-4 backdrop-blur-md">
        <Link href={Routes.home} className="flex items-center gap-3">
          <BrandMark />
          <span className="text-base font-bold tracking-tight text-ink-charcoal">
            delitip
          </span>
        </Link>
        <Link
          href={Routes.contact}
          className="text-xs font-semibold text-zinc-700 transition hover:text-ink-charcoal"
        >
          Contact Support
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="w-full max-w-xl overflow-hidden rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-xl shadow-zinc-200/50 sm:p-10">
          {children}
          <div className="mt-10 flex items-center justify-center border-t border-zinc-100 pt-6 text-xs text-zinc-400">
            <div className="flex items-center gap-1.5">
              <Lock className="size-3.5 text-electric-lime" strokeWidth={2} />
              <span>Secure business setup</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full border-t border-zinc-200/60 bg-white py-4 text-center text-xs text-zinc-400">
        <p>
          © 2026{" "}
          <strong className="font-semibold text-zinc-700">delitip</strong>.
          Tip. Appreciate. Connect.
        </p>
      </footer>
    </div>
  );
};
