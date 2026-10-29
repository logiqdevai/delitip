import { type FC } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Routes } from "@/routes/routes";

export const LandingCta: FC = async () => {
  const t = await getTranslations("landing.cta");

  return (
    <section className="px-6 pb-20">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] px-8 py-16 text-center text-ink-charcoal sm:py-20">
        <div className="relative">
          <h2 className="mx-auto max-w-3xl text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            {t.rich("title", {
              accent: (chunks) => <span className="text-magic">{chunks}</span>,
            })}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm text-zinc-500 sm:text-base lg:text-[18px]">
            {t("description")}
          </p>
          <div className="mt-10">
            <Link
              href={Routes.landing.getStarted}
              className="inline-flex items-center gap-2 rounded-xl bg-electric-lime px-7 py-4 font-semibold text-ink-charcoal transition hover:scale-105"
            >
              {t("button")}
              <ArrowRight className="size-4" strokeWidth={2} />
            </Link>
          </div>
          <p className="mt-5 text-xs text-zinc-400">
            {t("footnote")}
          </p>
        </div>
      </div>
    </section>
  );
};
