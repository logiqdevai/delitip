import { type FC } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import type { HelpArticleSection } from "@/interfaces/help-center.interfaces";

interface HelpArticleBodyProps {
  sections: HelpArticleSection[];
}

export const HelpArticleBody: FC<HelpArticleBodyProps> = ({ sections }) => {
  const t = useTranslations("help");

  return (
    <div className="space-y-8 rounded-2xl border border-zinc-200 bg-white px-4 py-6 sm:p-8">
      {sections.map((section, index) => (
        <section key={section.heading ?? index} className="space-y-3">
          {section.heading && (
            <h2 className="text-base font-bold text-ink-charcoal sm:text-[18px]">
              {section.heading}
            </h2>
          )}
          <div className="space-y-3 text-sm leading-relaxed text-zinc-600 sm:text-[17px]">
            {section.paragraphs.map((paragraph, paragraphIndex) => (
              <p key={paragraphIndex}>{paragraph}</p>
            ))}
            {section.list && section.list.length > 0 && (
              <ul className="list-disc space-y-1 pl-5">
                {section.list.map((item, itemIndex) => (
                  <li key={itemIndex}>{item}</li>
                ))}
              </ul>
            )}
            {section.closingParagraphs?.map((paragraph, paragraphIndex) => (
              <p key={`closing-${paragraphIndex}`}>{paragraph}</p>
            ))}
          </div>
          {section.links && section.links.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {section.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-paper-offwhite px-3 py-1.5 text-xs font-bold text-ink-charcoal transition hover:scale-[1.03] hover:border-zinc-300 hover:bg-white"
                >
                  {t("goTo", { label: link.label })}
                  <ArrowUpRight className="size-3.5 shrink-0" strokeWidth={2} />
                </Link>
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  );
};
