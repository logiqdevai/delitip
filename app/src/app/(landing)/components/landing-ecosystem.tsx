import { type FC } from "react";
import { getTranslations } from "next-intl/server";
import { Routes } from "@/routes/routes";
import {
  LandingEcosystemTabs,
  type EcosystemTab,
} from "./landing-ecosystem-tabs";

const businessPointKeys = ["seeWho", "feedbackEarly", "noHardware"] as const;

const staffPointKeys = ["rightPerson", "cashless", "goodWords"] as const;

export const LandingEcosystem: FC = async () => {
  const t = await getTranslations("landing.ecosystem");

  const tabs: EcosystemTab[] = [
    {
      id: "business",
      title: t("business.title"),
      description: t("business.description"),
      cta: t("business.cta"),
      href: Routes.landing.getStarted,
      points: businessPointKeys.map((key) => ({
        strong: t(`business.points.${key}.strong`),
        rest: t(`business.points.${key}.rest`),
      })),
    },
    {
      id: "staff",
      title: t("staff.title"),
      description: t("staff.description"),
      cta: t("staff.cta"),
      href: Routes.landing.getStarted,
      points: staffPointKeys.map((key) => ({
        strong: t(`staff.points.${key}.strong`),
        rest: t(`staff.points.${key}.rest`),
      })),
    },
  ];

  return (
    <section id="ecosystem" className="p-3 sm:p-4">
      <div className="bg-night relative overflow-hidden rounded-[2rem] py-20 text-ink-foreground sm:rounded-[2.5rem] lg:py-28">
        <div className="relative mx-auto max-w-7xl px-6">
          <p className="text-xs tracking-[0.2em] text-electric-lime uppercase">
            {t("eyebrow")}
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            {t.rich("title", {
              accent: (chunks) => <span className="text-magic">{chunks}</span>,
            })}
          </h2>

          <LandingEcosystemTabs tabs={tabs} />
        </div>
      </div>
    </section>
  );
};
