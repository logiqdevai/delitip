import { type FC } from "react";
import { cn } from "@/lib/utils";

const steps = [
  {
    numeral: "I",
    title: "Scan",
    body: "The customer scans a QR code at the desk or on a team card. They see your business and the person who helped them.",
    note: "Printed QR cards available.",
  },
  {
    numeral: "II",
    title: "Tip",
    body: "They choose an amount and pay online. The tip goes to that team member or the whole team, if you set it that way.",
    note: "No app. No account for customers.",
  },
  {
    numeral: "III",
    title: "Feedback",
    body: "They rate the experience and leave a short note. Tips and feedback land in one dashboard, tied to the people who earned them.",
    note: "Useful signal. Not just a review site.",
  },
] as const;

export const LandingHowItWorks: FC = () => {
  return (
    <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-20 lg:py-28">
      <p className="text-xs tracking-[0.2em] text-zinc-500 uppercase">
        How it works
      </p>
      <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink-charcoal sm:text-4xl lg:text-5xl">
        Three steps. <span>A little spell.</span>
      </h2>
      <p className="mt-4 max-w-xl text-sm text-zinc-500">
        Simple for customers. Clear for your business and your team.
      </p>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {steps.map((step, index) => (
          <div
            key={step.numeral}
            className={cn(
              "group relative overflow-hidden rounded-3xl border border-zinc-200/80 bg-paper-offwhite p-8 transition hover:-translate-y-2",
              index === 1 && "border-electric-lime/40"
            )}
          >
            <span className="font-serif text-6xl text-brand-700 transition group-hover:scale-110">
              {step.numeral}
            </span>
            <h3 className="mt-6 text-2xl font-bold text-ink-charcoal">
              {step.title}
            </h3>
            <p className="mt-3 text-sm text-zinc-600">{step.body}</p>
            <p className="mt-6 text-sm font-semibold text-brand-700">
              ✦ {step.note}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
