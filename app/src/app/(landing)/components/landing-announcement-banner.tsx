import { type FC } from "react";
import Link from "next/link";
import { Routes } from "@/routes/routes";

export const LandingAnnouncementBanner: FC = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 border-b border-zinc-800 bg-ink-charcoal px-4 py-2 text-center text-xs font-medium text-paper-offwhite">
      <span className="rounded-full bg-electric-lime px-2 py-0.5 text-xs font-extrabold tracking-widest text-ink-charcoal uppercase">
        New
      </span>
      <span>
        Tip and feedback in one QR scan — built for customer support and
        frontline teams.
      </span>
      <Link
        href={Routes.landing.howItWorks}
        className="font-semibold text-electric-lime underline transition hover:text-paper-offwhite"
      >
        See how it works →
      </Link>
    </div>
  );
};
