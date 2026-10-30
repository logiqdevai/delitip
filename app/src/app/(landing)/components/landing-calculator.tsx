"use client";

import { type CSSProperties, type FC, useState } from "react";
import Link from "next/link";
import { useFormatter, useTranslations } from "next-intl";
import { Routes } from "@/routes/routes";

const SLIDER_CLASS_NAME =
  "h-2 w-full cursor-pointer appearance-none rounded-lg bg-[linear-gradient(to_right,var(--color-electric-lime)_var(--fill),var(--color-zinc-200)_var(--fill))] [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-ink-charcoal [&::-moz-range-thumb]:bg-electric-lime [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-ink-charcoal [&::-webkit-slider-thumb]:bg-electric-lime";

const fillStyle = (value: number, min: number, max: number): CSSProperties =>
  ({ "--fill": `${((value - min) / (max - min)) * 100}%` }) as CSSProperties;

export const LandingCalculator: FC = () => {
  const t = useTranslations("landing.calculator");
  const format = useFormatter();
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
            {t("eyebrow")}
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink-charcoal sm:text-4xl lg:text-5xl">
            {t.rich("title", { span: (chunks) => <span>{chunks}</span> })}
          </h2>
          <p className="mt-4 text-sm text-zinc-500">
            {t("subtitle")}
          </p>

          <div className="mt-10 space-y-8">
            <label className="block">
              <div className="flex justify-between text-sm font-semibold text-ink-charcoal">
                <span>{t("teamMembers")}</span>
                <span>{t("people", { count: staffCount })}</span>
              </div>
              <div className="relative mt-3">
                <input
                  type="range"
                  min={1}
                  max={50}
                  value={staffCount}
                  onChange={(event) => setStaffCount(Number(event.target.value))}
                  aria-label={t("teamMembers")}
                  style={fillStyle(staffCount, 1, 50)}
                  className={SLIDER_CLASS_NAME}
                />
              </div>
            </label>

            <label className="block">
              <div className="flex justify-between text-sm font-semibold text-ink-charcoal">
                <span>{t("interactions")}</span>
                <span>{t("perDay", { count: dailyInteractions })}</span>
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
                  aria-label={t("interactions")}
                  style={fillStyle(dailyInteractions, 10, 1000)}
                  className={SLIDER_CLASS_NAME}
                />
              </div>
            </label>
          </div>
        </div>

        <div className="bg-night relative flex h-full flex-col justify-center overflow-hidden rounded-[2rem] p-10 text-left text-ink-foreground">
          <div className="relative space-y-4">
            <p className="text-sm text-ink-foreground/60">
              {t("annualTips")}
            </p>
            <p className="font-serif text-5xl text-magic sm:text-6xl">
              ~€{format.number(annualBoost)}
            </p>
            <p className="text-sm text-ink-foreground/70">
              {t.rich("perMember", {
                amount: format.number(monthlyPerStaff),
                strong: (chunks) => (
                  <strong className="text-electric-lime">{chunks}</strong>
                ),
              })}
            </p>
            <Link
              href={Routes.landing.getStarted}
              className="inline-block w-full rounded-xl bg-electric-lime py-3 text-center text-sm font-bold text-ink-charcoal transition hover:scale-[1.02]"
            >
              {t("cta")}
            </Link>
            <p className="text-xs text-ink-foreground/40">
              {t("disclaimer")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
