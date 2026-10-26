import { type FC } from "react";
import Link from "next/link";
import { Routes } from "@/routes/routes";

const businessPoints = [
  {
    strong: "See who customers thank.",
    rest: "Tips and feedback tied to the people who helped.",
  },
  {
    strong: "Collect feedback early.",
    rest: "Hear from customers before they post elsewhere.",
  },
  {
    strong: "No extra hardware.",
    rest: "A QR code at the desk is enough to start.",
  },
] as const;

const staffPoints = [
  {
    strong: "Tips to the right person.",
    rest: "Customers tip the teammate who helped them.",
  },
  {
    strong: "Cashless and simple.",
    rest: "No missed tips because someone didn't have cash.",
  },
  {
    strong: "Keep the good words.",
    rest: "Positive feedback stays with your profile.",
  },
] as const;

export const LandingEcosystem: FC = () => {
  return (
    <section
      id="ecosystem"
      className="bg-night relative py-20 text-ink-foreground lg:py-28"
    >
      <div className="relative mx-auto max-w-7xl px-6">
        <p className="text-xs tracking-[0.2em] text-electric-lime uppercase">
          Built for both sides
        </p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
          Clear for the business.{" "}
          <span className="text-magic">Fair for the team.</span>
        </h2>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-electric-lime/20 bg-ink-foreground/5 p-8 backdrop-blur">
            <h3 className="text-2xl font-bold">
              For business owners & managers
            </h3>
            <p className="mt-2 text-ink-foreground/60">
              Run tipping and feedback without POS hardware.
            </p>
            <ul className="mt-6 space-y-4">
              {businessPoints.map((point) => (
                <li key={point.strong} className="flex gap-3">
                  <span className="text-electric-lime">✦</span>
                  <span>
                    <strong>{point.strong}</strong>{" "}
                    <span className="text-ink-foreground/70">{point.rest}</span>
                  </span>
                </li>
              ))}
            </ul>
            <Link
              href={Routes.landing.getStarted}
              className="mt-8 inline-block font-semibold text-electric-lime hover:underline"
            >
              Set up your business →
            </Link>
          </div>

          <div className="rounded-3xl border border-electric-lime/20 bg-ink-foreground/5 p-8 backdrop-blur">
            <h3 className="text-2xl font-bold">For frontline staff</h3>
            <p className="mt-2 text-ink-foreground/60">
              When someone goes out of their way, customers can say thank you
              — to you, not a tip jar.
            </p>
            <ul className="mt-6 space-y-4">
              {staffPoints.map((point) => (
                <li key={point.strong} className="flex gap-3">
                  <span className="text-electric-lime">✦</span>
                  <span>
                    <strong>{point.strong}</strong>{" "}
                    <span className="text-ink-foreground/70">{point.rest}</span>
                  </span>
                </li>
              ))}
            </ul>
            <Link
              href={Routes.landing.getStarted}
              className="mt-8 inline-block font-semibold text-electric-lime hover:underline"
            >
              Join with your team →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
