"use client";

import { type FC, type ReactNode, useCallback, useMemo } from "react";
import Link from "next/link";
import { LegalDocumentNav } from "./legal-document-nav";
import { useActiveSection } from "../hooks/use-active-section";
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

function toSectionId(index: number) {
  return `section-${index + 1}`;
}

export const LegalDocument: FC<LegalDocumentProps> = ({
  title,
  description,
  lastUpdated,
  sections,
  alternateHref,
  alternateLabel,
}) => {
  const navItems = useMemo(
    () =>
      sections.map((section, index) => ({
        id: toSectionId(index),
        title: section.title,
      })),
    [sections],
  );

  const sectionIds = useMemo(
    () => navItems.map((item) => item.id),
    [navItems],
  );

  const activeId = useActiveSection(sectionIds);

  const onNavigate = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    const headerOffset = 96;
    const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;

    window.scrollTo({ top, behavior: "smooth" });
    window.history.replaceState(null, "", `#${id}`);
  }, []);

  return (
    <section className="relative pt-10 pb-24 md:pt-14 md:pb-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] lg:gap-x-16 xl:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] xl:gap-x-24">
          <aside className="sticky top-14 z-30 -mx-4 mb-10 border-b border-zinc-100 bg-paper-offwhite/95 px-4 py-3 backdrop-blur-md lg:static lg:z-auto lg:mx-0 lg:mb-0 lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
            <div className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
              <LegalDocumentNav
                items={navItems}
                activeId={activeId}
                onNavigate={onNavigate}
              />
            </div>
          </aside>

          <div className="min-w-0">
            <header className="max-w-2xl">
              <p className="text-chip font-bold tracking-wider text-zinc-500 uppercase">
                Legal
              </p>
              <h1 className="mt-3 text-3xl leading-[1.12] font-extrabold tracking-tight text-ink-charcoal sm:text-4xl md:text-5xl">
                {title}
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-zinc-600 sm:text-base">
                {description}
              </p>
              <p className="mt-3 text-xs text-zinc-500">
                Last updated: {lastUpdated} · Draft placeholder pending counsel
                review
              </p>
            </header>

            <div className="mt-16 space-y-16 sm:mt-20 sm:space-y-20">
              {sections.map((section, index) => {
                const id = toSectionId(index);

                return (
                  <section
                    key={id}
                    id={id}
                    className="scroll-mt-28 space-y-4"
                  >
                    <h2 className="text-xl font-extrabold tracking-tight text-ink-charcoal sm:text-2xl">
                      {section.title}
                    </h2>
                    <div className="max-w-2xl space-y-3 text-sm leading-relaxed text-zinc-600 sm:text-[0.9375rem] sm:leading-[1.7]">
                      {section.body}
                    </div>
                  </section>
                );
              })}
            </div>

            <p className="mt-20 max-w-2xl text-sm text-zinc-500">
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
        </div>
      </div>
    </section>
  );
};
