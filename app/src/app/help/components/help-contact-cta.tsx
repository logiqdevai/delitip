import { type FC } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Routes } from "@/routes/routes";

export const HelpContactCta: FC = () => {
  const t = useTranslations("help");

  return (
    <div className="mt-8 rounded-2xl border border-zinc-200 bg-white px-4 py-6 text-sm text-zinc-600 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-bold text-ink-charcoal">{t("stillNeedHelp")}</p>
          <p className="mt-1">{t("stillNeedHelpBody")}</p>
        </div>
        <Link
          href={Routes.contact}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-electric-lime px-4 py-2.5 text-chip font-bold text-ink-charcoal transition hover:scale-[1.03]"
        >
          {t("contactUs")}
        </Link>
      </div>
    </div>
  );
};
