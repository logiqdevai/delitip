import { type FC, type ReactNode } from "react";
import Link from "next/link";
import { Routes } from "@/routes/routes";

type LegalSection = {
  title: string;
  body: ReactNode;
};

type LegalDocumentProps = {
  title: string;
  description: string;
  lastUpdated: string;
  sections: LegalSection[];
  alternateHref: string;
  alternateLabel: string;
};

export const LegalDocument: FC<LegalDocumentProps> = ({
  title,
  description,
  lastUpdated,
  sections,
  alternateHref,
  alternateLabel,
}) => {
  return (
    <section className="hero-glow relative overflow-hidden pt-14 pb-20 md:pt-20 md:pb-28">
      <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <p className="text-chip font-bold tracking-wider text-zinc-500 uppercase">
          Legal
        </p>
        <h1 className="mt-3 text-3xl leading-[1.12] font-extrabold tracking-tight text-ink-charcoal sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-zinc-600 sm:text-base">
          {description}
        </p>
        <p className="mt-3 text-xs text-zinc-500">
          Last updated: {lastUpdated} · Draft placeholder pending counsel review
        </p>

        <div className="mt-10 space-y-8 rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8">
          {sections.map((section) => (
            <section key={section.title} className="space-y-2">
              <h2 className="text-base font-bold text-ink-charcoal">
                {section.title}
              </h2>
              <div className="space-y-3 text-sm leading-relaxed text-zinc-600">
                {section.body}
              </div>
            </section>
          ))}
        </div>

        <p className="mt-8 text-sm text-zinc-500">
          Also see our{" "}
          <Link
            href={alternateHref}
            className="font-medium text-ink-charcoal underline underline-offset-2 transition hover:text-zinc-700"
          >
            {alternateLabel}
          </Link>
          . Questions?{" "}
          <Link
            href={Routes.contact}
            className="font-medium text-ink-charcoal underline underline-offset-2 transition hover:text-zinc-700"
          >
            Contact us
          </Link>
          .
        </p>
      </div>
    </section>
  );
};
