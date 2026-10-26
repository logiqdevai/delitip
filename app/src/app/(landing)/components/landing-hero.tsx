import { type FC } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Routes } from "@/routes/routes";

export const LandingHero: FC = () => {
  return (
    <section className="p-3 sm:p-4">
      <div className="bg-night relative flex h-[calc(100dvh-1.5rem)] items-center justify-center pt-[5.75rem] sm:h-[calc(100dvh-2rem)] overflow-hidden rounded-[2rem] text-ink-foreground sm:rounded-[2.5rem]">

        <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center px-6 py-16 text-center">
          <h1 className="text-5xl leading-[1.05] font-medium tracking-tight sm:text-6xl lg:text-7xl">
            Tip and feedback for the people who{" "}
            <em className="text-magic not-italic">help your customers</em>
          </h1>

          <p className="mt-8 max-w-2xl text-base text-ink-foreground/80 sm:text-lg">
            Customers scan a QR code, tip the team member who helped them, and
            leave feedback. No app required. You see who was recognized and
            what customers said.
          </p>

          <div className="mt-10 rounded-full border border-white/15 bg-white/5 p-1.5">
            <Link
              href={Routes.landing.getStarted}
              className="inline-flex items-center gap-2 rounded-full bg-electric-lime px-7 py-4 font-semibold text-ink-charcoal transition hover:scale-105"
            >
              Create your business account
              <ArrowRight className="size-4" strokeWidth={2} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
