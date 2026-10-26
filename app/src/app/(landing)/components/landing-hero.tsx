import { type FC } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Routes } from "@/routes/routes";

export const LandingHero: FC = async () => {
  const t = await getTranslations("landing.hero");

  return (
    <section className="p-3 sm:p-4">
      <div className="bg-night relative flex h-[calc(100dvh-1.5rem)] items-center justify-center pt-[5.75rem] sm:h-[calc(100dvh-2rem)] overflow-hidden rounded-[2rem] text-ink-foreground sm:rounded-[2.5rem]">

        <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center px-6 py-16 text-center">
          <h1 className="max-w-3xl text-balance text-5xl leading-[1.05] font-medium tracking-tight sm:text-6xl lg:text-7xl">
            {t.rich("title", {
              accent: (chunks) => (
                <em className="text-magic not-italic">{chunks}</em>
              ),
            })}
          </h1>

          <p className="mt-8 max-w-xl text-pretty text-base leading-relaxed text-ink-foreground/80 sm:text-lg">
            {t("description")}
          </p>

          <div className="mt-10">
            <Link
              href={Routes.landing.getStarted}
              className="inline-flex items-center gap-2 rounded-full bg-electric-lime px-7 py-4 font-semibold text-ink-charcoal transition hover:scale-105"
            >
              {t("cta")}
              <ArrowRight className="size-4" strokeWidth={2} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
