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
    <section id="pricing" className="mx-auto max-w-7xl px-6 pb-20 lg:pb-28">
      <div className="text-center">
        <p className="text-xs tracking-[0.2em] text-zinc-500 uppercase">
          Pricing
        </p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink-charcoal sm:text-4xl lg:text-5xl">
          Simple plans <span>for every team</span>
        </h2>
        <p className="mt-4 text-sm text-zinc-500">
          No setup fees. No hardware lock-in. Cancel anytime.
        </p>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              "relative rounded-3xl border p-8",
              plan.featured
                ? "bg-night border-electric-lime/40 text-ink-foreground md:-translate-y-4"
                : "border-zinc-200 bg-white"
            )}
          >
            {plan.featured ? (
              <span className="absolute -top-3 left-8 rounded-full bg-electric-lime px-3 py-1 text-xs font-bold text-ink-charcoal">
                ✦ Most popular
              </span>
            ) : null}

            <h3 className="text-xl font-bold">{plan.name}</h3>
            <p
              className={cn(
                "text-sm",
                plan.featured ? "text-ink-foreground/60" : "text-zinc-500"
              )}
            >
              {plan.blurb}
            </p>
            <p className="mt-6 text-4xl font-extrabold sm:text-5xl">
              {plan.price}
              {plan.priceSuffix ? (
                <span className="text-base font-normal opacity-60">
                  {" "}
                  {plan.priceSuffix}
                </span>
              ) : null}
            </p>
            <p
              className={cn(
                "mt-4 text-sm",
                plan.featured ? "text-ink-foreground/70" : "text-zinc-600"
              )}
            >
              {plan.description}
            </p>
            <ul className="mt-6 space-y-2 text-sm">
              {plan.features.map((feature) => (
                <li key={feature} className="flex gap-2">
                  <span className={plan.featured ? "text-electric-lime" : ""}>
                    ✦
                  </span>
                  {feature}
                </li>
              ))}
            </ul>

            <Link
              href={
                plan.name === "Organization"
                  ? Routes.contact
                  : Routes.landing.getStarted
              }
              className={cn(
                "mt-8 block rounded-full py-3 text-center text-sm font-semibold transition hover:scale-[1.02]",
                plan.featured
                  ? "bg-electric-lime text-ink-charcoal"
                  : "bg-ink-charcoal text-paper-offwhite"
              )}
            >
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};
