import { type FC } from "react";
import Link from "next/link";
import { Routes } from "@/routes/routes";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Starter",
    blurb: "For small teams getting started",
    price: "€0",
    priceSuffix: "/ month",
    description:
      "Free for your business. A small processing fee is paid by the customer with each tip.",
    features: [
      "Up to 10 team members",
      "Unlimited QR codes",
      "Online payments",
      "Direct tips to staff",
    ],
    cta: "Create free account",
    featured: false,
  },
  {
    name: "Business",
    blurb: "For growing support and service teams",
    price: "€29",
    priceSuffix: "/ month",
    description:
      "Everything in Starter, plus tip pooling controls, feedback feed, and exports.",
    features: [
      "Unlimited team members",
      "Custom tip distribution",
      "Private feedback feed",
      "Reports & payroll export",
      "Team QR codes",
    ],
    cta: "Start 14-day free trial",
    featured: true,
  },
  {
    name: "Organization",
    blurb: "For multi-location businesses",
    price: "Custom",
    priceSuffix: null,
    description:
      "Multi-location reporting, dedicated support, and custom integrations.",
    features: [
      "Multi-location management",
      "Custom integrations",
      "Dedicated account manager",
      "Custom audit reports",
    ],
    cta: "Talk to sales",
    featured: false,
  },
] as const;

export const LandingPricing: FC = () => {
  return (
    <section
      id="pricing"
      className="border-t border-zinc-100 bg-paper-offwhite py-20"
    >
      <div className="mx-auto max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl space-y-3 text-center">
          <span className="text-xs font-bold tracking-widest text-brand-700 uppercase">
            Pricing
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-ink-charcoal sm:text-4xl">
            Simple plans for every team size
          </h2>
          <p className="text-xs text-zinc-500 sm:text-sm">
            No setup fees. No hardware lock-in. Cancel anytime.
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative flex flex-col justify-between space-y-6 rounded-3xl p-8",
                plan.featured
                  ? "border-2 border-electric-lime bg-ink-charcoal text-paper-offwhite shadow-2xl"
                  : "border border-zinc-200 bg-white shadow-xs"
              )}
            >
              {plan.featured ? (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-electric-lime px-3 py-1 text-xs font-extrabold tracking-widest text-ink-charcoal uppercase">
                  Most popular
                </div>
              ) : null}

              <div className="space-y-4">
                <div>
                  <h3
                    className={cn(
                      "text-base font-bold",
                      plan.featured
                        ? "text-paper-offwhite"
                        : "text-ink-charcoal"
                    )}
                  >
                    {plan.name}
                  </h3>
                  <p className="mt-1 text-xs text-zinc-400">{plan.blurb}</p>
                </div>
                <div
                  className={cn(
                    "text-3xl font-extrabold",
                    plan.featured
                      ? "text-paper-offwhite"
                      : "text-ink-charcoal"
                  )}
                >
                  {plan.price}
                  {plan.priceSuffix ? (
                    <span className="text-xs font-normal text-zinc-400">
                      {" "}
                      {plan.priceSuffix}
                    </span>
                  ) : null}
                </div>
                <p
                  className={cn(
                    "text-xs",
                    plan.featured ? "text-zinc-400" : "text-zinc-600"
                  )}
                >
                  {plan.description}
                </p>
                <ul
                  className={cn(
                    "space-y-2 pt-3 text-xs",
                    plan.featured ? "text-zinc-300" : "text-zinc-700"
                  )}
                >
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      ✓ {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href={
                  plan.name === "Organization"
                    ? Routes.contact
                    : Routes.landing.getStarted
                }
                className={cn(
                  "w-full rounded-xl py-3 text-center text-xs font-bold transition",
                  plan.featured
                    ? "bg-electric-lime text-ink-charcoal shadow-lg shadow-electric-lime/30 hover:bg-brand-400"
                    : "bg-neutral-fill text-ink-charcoal hover:bg-zinc-200"
                )}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
