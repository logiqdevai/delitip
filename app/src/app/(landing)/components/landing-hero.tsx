import { type FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Routes } from "@/routes/routes";

export const LandingHero: FC = async () => {
  const t = await getTranslations("landing.hero");

  return (
    <section className="p-3 sm:p-4">
      <div className="bg-night relative flex h-[calc(100dvh-1.5rem)] items-center justify-center pt-[5.75rem] sm:h-[calc(100dvh-2rem)] overflow-hidden rounded-[2rem] text-ink-foreground sm:rounded-[2.5rem]">
        <Image
          src="/landing/hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(24,26,27,0.88)_0%,rgba(24,26,27,0.74)_50%,rgba(24,26,27,0.48)_100%)]"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink-charcoal/70 to-transparent"
        />

        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-6 py-16 text-center">
          <h1 className="text-5xl leading-[1.05] font-medium tracking-tight sm:text-6xl lg:text-7xl">
            {t.rich("title", {
              accent: (chunks) => (
                <em className="text-magic not-italic">{chunks}</em>
              ),
            })}
          </h1>

          <p className="mt-8 max-w-3xl text-pretty text-base leading-relaxed text-ink-foreground/80 sm:text-lg">
            {t("description")}
          </p>

          <div className="mt-10">
            <Link
              href={Routes.landing.getStarted}
              className="inline-flex items-center gap-2 rounded-xl bg-electric-lime px-7 py-4 font-semibold text-ink-charcoal transition hover:scale-105"
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
