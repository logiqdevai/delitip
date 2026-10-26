import { type FC } from "react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Routes } from "@/routes/routes";
import { LandingFaqList, type FaqItem } from "./landing-faq-list";

const itemKeys = ["q1", "q2", "q3", "q4", "q5", "q6"] as const;

export const LandingFaq: FC = async () => {
  const t = await getTranslations("landing.faq");

  const items: FaqItem[] = itemKeys.map((key) => ({
    id: key,
    question: t(`items.${key}.question`),
    answer: t(`items.${key}.answer`),
  }));

  return (
    <section id="faq" className="p-3 sm:p-4">
      <div className="overflow-hidden rounded-[2rem] bg-brand-100 py-20 text-ink-charcoal sm:rounded-[2.5rem] lg:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs tracking-[0.2em] text-brand-800 uppercase">
                {t("eyebrow")}
              </p>
              <h2 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                {t.rich("title", {
                  accent: (chunks) => (
                    <span className="text-magic">{chunks}</span>
                  ),
                })}
              </h2>
              <p className="mt-4 max-w-md text-sm text-ink-charcoal/60">
                {t("subtitle")}
              </p>
            </div>
            <Link
              href={Routes.landing.getStarted}
              className="inline-flex w-fit items-center rounded-full bg-electric-lime px-6 py-3 text-sm font-semibold text-ink-charcoal transition hover:scale-105"
            >
              {t("cta")}
            </Link>
          </div>

          <LandingFaqList items={items} />
        </div>
      </div>
    </section>
  );
};
