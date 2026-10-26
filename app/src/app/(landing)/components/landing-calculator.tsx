"use client";

import { type FC, useState } from "react";
import Link from "next/link";
import { Routes } from "@/routes/routes";

function formatEur(value: number): string {
  return value.toLocaleString("en-US");
}

export const LandingCalculator: FC = () => {
  const [staffCount, setStaffCount] = useState(8);
  const [dailyInteractions, setDailyInteractions] = useState(120);

  const extraDailyTips = dailyInteractions * 0.56;
  const annualBoost = Math.round(extraDailyTips * 365);
  const monthlyPerStaff = Math.round(annualBoost / 12 / staffCount);

  return (
    <section id="calculator" className="mx-auto max-w-7xl px-6 py-20 lg:py-28">
      <div className="grid items-stretch gap-12 lg:grid-cols-2">
        <div>
          <p className="text-xs tracking-[0.2em] text-zinc-500 uppercase">
            Estimate
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink-charcoal sm:text-4xl lg:text-5xl">
            Rough tip potential <span>for your team</span>
          </h2>
          <p className="mt-4 text-sm text-zinc-500">
            A simple estimate based on how many customers you help each day.
            Not a guarantee.
          </p>

          <div className="mt-10 space-y-8">
            <label className="block">
              <div className="flex justify-between text-sm font-semibold text-ink-charcoal">
                <span>Team members</span>
                <span>{staffCount} people</span>
              </div>
              <div className="relative mt-3">
                <input
                  type="range"
                  min={1}
                  max={50}
                  value={staffCount}
                  onChange={(event) => setStaffCount(Number(event.target.value))}
                  aria-label="Team members"
                  className="relative z-10 h-2 w-full cursor-pointer appearance-none rounded-lg bg-zinc-200 accent-black"
                />
                <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-1">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <span key={index} className="size-1 rounded-full bg-ink-charcoal" />
                  ))}
                </div>
              </div>
            </label>

            <label className="block">
              <div className="flex justify-between text-sm font-semibold text-ink-charcoal">
                <span>Customer interactions per day</span>
                <span>{dailyInteractions} / day</span>
              </div>
              <div className="relative mt-3">
                <input
                  type="range"
                  min={10}
                  max={1000}
                  step={10}
                  value={dailyInteractions}
                  onChange={(event) =>
                    setDailyInteractions(Number(event.target.value))
                  }
                  aria-label="Customer interactions per day"
                  className="relative z-10 h-2 w-full cursor-pointer appearance-none rounded-lg bg-zinc-200 accent-black"
                />
                <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-1">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <span key={index} className="size-1 rounded-full bg-ink-charcoal" />
                  ))}
                </div>
              </div>
            </label>
          </div>
        </div>

        <div className="bg-night relative flex h-full flex-col justify-center overflow-hidden rounded-[2rem] p-10 text-left text-ink-foreground">
          <div className="relative space-y-4">
            <p className="text-sm text-ink-foreground/60">
              Estimated annual tips
            </p>
            <p className="font-serif text-5xl text-magic sm:text-6xl">
              ~€{formatEur(annualBoost)}
            </p>
            <p className="text-sm text-ink-foreground/70">
              About{" "}
              <strong className="text-electric-lime">
                €{formatEur(monthlyPerStaff)}/mo
              </strong>{" "}
              per team member in this estimate
            </p>
            <Link
              href={Routes.landing.getStarted}
              className="inline-block w-full rounded-full bg-electric-lime py-3 text-center text-sm font-bold text-ink-charcoal transition hover:scale-[1.02]"
            >
              Create your business account
            </Link>
            <p className="text-xs text-ink-foreground/40">
              Illustrative only. Real results depend on your volume, tip
              amounts, and how often customers use the QR.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
