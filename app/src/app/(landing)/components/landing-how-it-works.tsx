import { type FC } from "react";
import { cn } from "@/lib/utils";

const steps = [
  {
    number: "01",
    title: "Scan",
    body: "The customer scans a QR code at the desk or on a team card. They see your business and the person who helped them.",
    note: "Printed QR cards available.",
    accent: false,
  },
  {
    number: "02",
    title: "Tip",
    body: "They choose an amount and pay online. The tip goes to that team member or the whole team, if you set it that way.",
    note: "No app. No account for customers.",
    accent: true,
  },
  {
    number: "03",
    title: "Feedback",
    body: "They can rate the experience and leave a short note. You get tips and feedback in one dashboard, tied to the people who earned them.",
    note: "Useful signal. Not just a review site.",
    accent: false,
  },
] as const;

export const LandingHowItWorks: FC = () => {
  return (
    <section id="how-it-works" className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl space-y-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl space-y-3 text-center">
          <span className="text-xs font-bold tracking-widest text-brand-700 uppercase">
            How it works
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-ink-charcoal sm:text-4xl">
            Three steps. Tip and feedback done.
          </h2>
          <p className="text-xs text-zinc-500 sm:text-sm">
            Simple for customers. Clear for your business and your team.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.number}
              className="relative space-y-4 rounded-3xl border border-zinc-200/80 bg-paper-offwhite p-8"
            >
              <div
                className={cn(
                  "flex size-10 items-center justify-center rounded-2xl text-sm font-extrabold",
                  step.accent
                    ? "bg-electric-lime text-ink-charcoal shadow-md shadow-electric-lime/30"
                    : "bg-ink-charcoal text-paper-offwhite"
                )}
              >
                {step.number}
              </div>
              <h3 className="text-lg font-bold text-ink-charcoal">
                {step.title}
              </h3>
              <p className="text-xs leading-relaxed text-zinc-600">
                {step.body}
              </p>
              <div className="text-xs font-semibold text-brand-700">
                {step.note}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
