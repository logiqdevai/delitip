"use client";

import { type FC, useState } from "react";
import Link from "next/link";
import { Info } from "lucide-react";
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
    <section id="calculator" className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-4xl space-y-10 px-4 sm:px-6 lg:px-8">
        <div className="space-y-3 text-center">
          <span className="text-xs font-bold tracking-widest text-brand-700 uppercase">
            Estimate
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-ink-charcoal sm:text-4xl">
            Rough tip potential for your team
          </h2>
          <p className="mx-auto max-w-xl text-xs text-zinc-500 sm:text-sm">
            A simple estimate based on how many customers you help each day.
            Not a guarantee.
          </p>
        </div>

        <div className="grid grid-cols-1 items-center gap-8 rounded-3xl border border-zinc-800 bg-ink-charcoal p-6 text-paper-offwhite shadow-2xl sm:p-10 md:grid-cols-12">
          <div className="space-y-6 md:col-span-7">
            <div>
              <div className="mb-2 flex justify-between text-xs font-bold">
                <span className="text-zinc-300">Team members</span>
                <span className="text-sm font-extrabold text-electric-lime">
                  {staffCount} people
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={40}
                value={staffCount}
                onChange={(event) =>
                  setStaffCount(Number(event.target.value))
                }
                aria-label="Team members"
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-zinc-800 accent-electric-lime"
              />
            </div>

            <div>
              <div className="mb-2 flex justify-between text-xs font-bold">
                <span className="text-zinc-300">
                  Customer interactions per day
                </span>
                <span className="text-sm font-extrabold text-electric-lime">
                  {dailyInteractions} / day
                </span>
              </div>
              <input
                type="range"
                min={20}
                max={500}
                step={10}
                value={dailyInteractions}
                onChange={(event) =>
                  setDailyInteractions(Number(event.target.value))
                }
                aria-label="Customer interactions per day"
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-zinc-800 accent-electric-lime"
              />
            </div>

            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <Info
                className="size-4 shrink-0 text-electric-lime"
                strokeWidth={2}
              />
              <span>
                Illustrative only. Real results depend on your volume, tip
                amounts, and how often customers use the QR.
              </span>
            </div>
          </div>

          <div className="space-y-4 rounded-2xl border border-zinc-800 bg-ink-charcoal/90 p-6 text-center md:col-span-5">
            <span className="block text-xs font-bold tracking-widest text-zinc-400 uppercase">
              Estimated annual tips
            </span>
            <div className="text-3xl font-extrabold text-electric-lime sm:text-4xl">
              ~€{formatEur(annualBoost)}
            </div>
            <div className="text-xs text-zinc-300">
              About{" "}
              <strong className="text-paper-offwhite">
                €{formatEur(monthlyPerStaff)}/mo
              </strong>{" "}
              per team member in this estimate
            </div>
            <Link
              href={Routes.landing.getStarted}
              className="inline-block w-full rounded-xl bg-electric-lime py-2.5 text-xs font-bold text-ink-charcoal shadow transition hover:bg-brand-400"
            >
              Create your business account
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
