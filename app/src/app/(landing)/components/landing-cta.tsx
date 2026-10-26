import { type FC } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Routes } from "@/routes/routes";

export const LandingCta: FC = () => {
  return (
    <section className="px-6 pb-20">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] px-8 py-16 text-center text-ink-charcoal sm:py-20">
        <div className="relative">
          <h2 className="mx-auto max-w-3xl text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Start tipping and feedback{" "}
            <span className="text-magic">for your team</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm text-zinc-500 sm:text-base">
            Create your account, add your team, and set up QR codes.
            Customers tip and leave feedback in seconds.
          </p>
          <div className="mt-10">
            <Link
              href={Routes.landing.getStarted}
              className="inline-flex items-center gap-2 rounded-full bg-electric-lime px-7 py-4 font-semibold text-ink-charcoal transition hover:scale-105"
            >
              Create your business account
              <ArrowRight className="size-4" strokeWidth={2} />
            </Link>
          </div>
          <p className="mt-5 text-xs text-zinc-400">
            No credit card required · Instant QR codes
          </p>
        </div>
      </div>
    </section>
  );
};
