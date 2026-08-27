import { type FC } from "react";
import Link from "next/link";
import { Building2, Check, Users } from "lucide-react";
import { Routes } from "@/routes/routes";

const businessPoints = [
  {
    strong: "See who customers thank:",
    rest: " Tips and feedback tied to the people who helped.",
  },
  {
    strong: "Collect feedback early:",
    rest: " Hear from customers before they post elsewhere.",
  },
  {
    strong: "No extra hardware:",
    rest: " A QR code at the desk is enough to start.",
  },
] as const;

const staffPoints = [
  {
    strong: "Tips to the right person:",
    rest: " Customers tip the teammate who helped them.",
  },
  {
    strong: "Cashless and simple:",
    rest: " No missed tips because someone didn’t have cash.",
  },
  {
    strong: "Keep the good words:",
    rest: " Positive feedback stays with your profile.",
  },
] as const;

export const LandingEcosystem: FC = () => {
  return (
    <section
      id="ecosystem"
      className="border-t border-zinc-100 bg-paper-offwhite py-20"
    >
      <div className="mx-auto max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl space-y-3 text-center">
          <span className="text-xs font-bold tracking-widest text-brand-700 uppercase">
            Built for both sides
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-ink-charcoal sm:text-4xl">
            Clear for the business. Fair for the team.
          </h2>
          <p className="text-xs text-zinc-500 sm:text-sm">
            Customers show appreciation. You turn it into recognition and useful
            feedback.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="flex flex-col justify-between space-y-6 rounded-3xl border border-zinc-200/80 bg-white p-8 shadow-xs sm:p-10">
            <div className="space-y-4">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                <Building2 className="size-5" strokeWidth={2} />
              </div>
              <h3 className="text-2xl font-bold text-ink-charcoal">
                For business owners & managers
              </h3>
              <p className="text-xs leading-relaxed text-zinc-600 sm:text-sm">
                Run tipping and feedback without POS hardware — and see how your
                customer support team is doing.
              </p>
              <ul className="space-y-2.5 pt-2 text-xs font-medium text-zinc-700">
                {businessPoints.map((point) => (
                  <li key={point.strong} className="flex items-start gap-2">
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-electric-lime"
                      strokeWidth={2}
                    />
                    <span>
                      <strong>{point.strong}</strong>
                      {point.rest}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-t border-zinc-100 pt-4">
              <Link
                href={Routes.landing.getStarted}
                className="flex items-center gap-1 text-xs font-bold text-brand-700 hover:underline"
              >
                Set up your business →
              </Link>
            </div>
          </div>

          <div className="flex flex-col justify-between space-y-6 rounded-3xl border border-zinc-200/80 bg-white p-8 shadow-xs sm:p-10">
            <div className="space-y-4">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                <Users className="size-5" strokeWidth={2} />
              </div>
              <h3 className="text-2xl font-bold text-ink-charcoal">
                For customer support & frontline staff
              </h3>
              <p className="text-xs leading-relaxed text-zinc-600 sm:text-sm">
                When someone goes out of their way to help, customers can tip and
                say thank you — tied to you, not a tip jar.
              </p>
              <ul className="space-y-2.5 pt-2 text-xs font-medium text-zinc-700">
                {staffPoints.map((point) => (
                  <li key={point.strong} className="flex items-start gap-2">
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-electric-lime"
                      strokeWidth={2}
                    />
                    <span>
                      <strong>{point.strong}</strong>
                      {point.rest}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-t border-zinc-100 pt-4">
              <Link
                href={Routes.landing.getStarted}
                className="flex items-center gap-1 text-xs font-bold text-brand-700 hover:underline"
              >
                Join with your team →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
