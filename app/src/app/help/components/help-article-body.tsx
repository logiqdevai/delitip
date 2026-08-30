import { type FC } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { HelpArticleSection } from "@/interfaces/help-center.interfaces";

interface HelpArticleBodyProps {
  sections: HelpArticleSection[];
}

export const HelpArticleBody: FC<HelpArticleBodyProps> = ({ sections }) => {
  return (
    <div className="space-y-8 rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8">
      {sections.map((section, index) => (
        <section key={section.heading ?? index} className="space-y-3">
          {section.heading && (
            <h2 className="text-base font-bold text-ink-charcoal">
              {section.heading}
            </h2>
          )}
          <div className="space-y-3 text-sm leading-relaxed text-zinc-600 sm:text-base">
            {section.paragraphs.map((paragraph, paragraphIndex) => (
              <p key={paragraphIndex}>{paragraph}</p>
            ))}
            {section.list && (
              <ul className="list-disc space-y-1 pl-5">
                {section.list.map((item, itemIndex) => (
                  <li key={itemIndex}>{item}</li>
                ))}
              </ul>
            )}
          </div>
          {section.links && section.links.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {section.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-paper-offwhite px-3 py-1.5 text-xs font-bold text-ink-charcoal transition hover:border-zinc-300 hover:bg-white"
                >
                  Go to {link.label}
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
