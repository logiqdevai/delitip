import { type FC } from "react";
import { getTranslations } from "next-intl/server";
import { LandingHowItWorksCards } from "./landing-how-it-works-cards";

export const LandingHowItWorks: FC = async () => {
  const t = await getTranslations("landing.howItWorks");

  return (
    <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-20 lg:py-28">
      <p className="text-xs tracking-[0.2em] text-zinc-500 uppercase">
        {t("eyebrow")}
      </p>
      <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink-charcoal sm:text-4xl lg:text-5xl">
        {t.rich("title", { span: (chunks) => <span>{chunks}</span> })}
      </h2>
      <p className="mt-4 max-w-xl text-sm text-zinc-500">
        {t("subtitle")}
      </p>

      <LandingHowItWorksCards />
    </section>
  );
};
