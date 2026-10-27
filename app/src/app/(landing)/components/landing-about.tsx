import { type FC } from "react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

export const LandingAbout: FC = async () => {
  const t = await getTranslations("landing.about");

  return (
    <section id="about" className="p-3 sm:p-4">
      <div className="overflow-hidden rounded-[2rem] bg-brand-100 py-20 text-ink-charcoal sm:rounded-[2.5rem] lg:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-xs tracking-[0.2em] text-brand-800 uppercase">
              {t("eyebrow")}
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
              {t.rich("title", {
                accent: (chunks) => (
                  <span className="text-magic">{chunks}</span>
                ),
              })}
            </h2>
            <p className="mt-6 text-base leading-relaxed text-ink-charcoal/70">
              {t("paragraphOne")}
            </p>
            <p className="mt-4 text-base leading-relaxed text-ink-charcoal/70">
              {t("paragraphTwo")}
            </p>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] sm:rounded-[2.5rem]">
            <Image
              src="/landing/about.jpg"
              alt={t("imageAlt")}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
