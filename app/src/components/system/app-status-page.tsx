"use client";

import { type FC } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { BrandMark } from "@/components/brand/brand-mark";
import { Routes } from "@/routes/routes";

interface AppStatusPageProps {
  code: string;
  title: string;
  description: string;
  onTryAgain: () => void;
  digest?: string;
}

export const AppStatusPage: FC<AppStatusPageProps> = ({
  code,
  title,
  description,
  onTryAgain,
  digest,
}) => {
  const router = useRouter();

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-paper-offwhite text-ink-charcoal">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(200,241,105,0.14),transparent_48%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_100%_100%,rgba(24,26,27,0.05),transparent_42%)]" />
      </div>

      <header className="relative z-10 mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-6 sm:px-8">
        <Link href={Routes.home} className="flex items-center gap-2.5">
          <BrandMark />
          <span className="text-lg font-extrabold tracking-tight text-ink-charcoal">
            deli
            <span className="font-semibold text-electric-lime">tip</span>
          </span>
        </Link>
        <Link
          href={Routes.contact}
          className="text-xs font-semibold text-zinc-500 transition hover:text-ink-charcoal"
        >
          Contact support
        </Link>
      </header>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-20 pt-8 text-center">
        <p className="select-none font-extrabold leading-none tracking-[-0.06em] text-electric-lime/80 text-[clamp(4.5rem,18vw,8.5rem)]">
          {code}
        </p>
        <h1 className="mt-4 max-w-lg text-2xl font-extrabold tracking-tight text-ink-charcoal sm:text-3xl">
          {title}
        </h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-zinc-500 sm:text-base">
          {description}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={onTryAgain}
            className="inline-flex items-center gap-2 rounded-xl bg-electric-lime px-5 py-3 text-sm font-bold text-ink-charcoal shadow-lg shadow-electric-lime/30 transition hover:bg-brand-700"
          >
            <RefreshCw className="size-4" strokeWidth={2.25} />
            Try again
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-bold text-ink-charcoal shadow-xs transition hover:bg-zinc-50"
          >
            <ArrowLeft className="size-4" strokeWidth={2.25} />
            Go back
          </button>
        </div>

        {digest ? (
          <p className="mt-8 font-mono text-caption text-zinc-400">
            Ref {digest}
          </p>
        ) : null}
      </main>
    </div>
  );
};

export const NotFoundStatusPage: FC = () => {
  return (
    <AppStatusPage
      code="404"
      title="Page not found"
      description="That URL isn't on delitip. Try again, or go back to the previous page."
      onTryAgain={() => {
        window.location.reload();
      }}
    />
  );
};