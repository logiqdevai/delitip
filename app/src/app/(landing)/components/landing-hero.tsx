import { type FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Routes } from "@/routes/routes";

export const LandingHero: FC = () => {
  return (
    <section className="bg-night relative text-ink-foreground">
      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-6 pb-20 pt-6 lg:grid-cols-2 lg:pb-28">
        <div>
          <h1 className="font-serif text-4xl leading-[1.1] font-medium sm:text-5xl lg:text-6xl">
            Tip and feedback for the people who{" "}
            <em className="text-magic not-italic">help your customers</em>
          </h1>

          <p className="mt-6 max-w-lg text-base text-ink-foreground/70 sm:text-lg">
            Customers scan a QR code, tip the team member who helped them, and
            leave feedback. No app required. You see who was recognized and
            what customers said.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-6">
            <Link
              href={Routes.landing.getStarted}
              className="inline-flex items-center gap-2 rounded-full bg-electric-lime px-7 py-4 font-semibold text-ink-charcoal transition hover:scale-105"
            >
              Create your business account
              <ArrowRight className="size-4" strokeWidth={2} />
            </Link>
          </div>
        </div>

        <div className="relative">
          <Image
            src="/landing/hero-qr-tabletop.jpg"
            alt="A café tabletop QR code customers scan to tip and leave feedback"
            width={640}
            height={512}
            priority
            className="animate-float relative hidden rounded-[2rem] border border-electric-lime/20 sm:block"
          />
        </div>
      </div>
    </section>
  );
};
