import { type FC } from "react";
import Link from "next/link";
import { Routes } from "@/routes/routes";

export const HelpContactCta: FC = () => {
  return (
    <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600 sm:p-8">
      <p className="font-bold text-ink-charcoal">Still need help?</p>
      <p className="mt-1">
        Can&apos;t find what you&apos;re looking for? Our team is happy to
        help.
      </p>
      <Link
        href={Routes.contact}
        className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-electric-lime px-4 py-2.5 text-chip font-bold text-ink-charcoal shadow-lg shadow-electric-lime/30 transition hover:bg-brand-700"
      >
        Contact us
      </Link>
    </div>
  );
};
