import { type FC } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Routes } from "@/routes/routes";
import type { HelpArticleReference } from "@/interfaces/help-center.interfaces";
import { resolveHelpArticleReference } from "@/lib/help-center.utils";

interface HelpRelatedArticlesProps {
  references: HelpArticleReference[];
}

export const HelpRelatedArticles: FC<HelpRelatedArticlesProps> = ({
  references,
}) => {
  const resolved = references
    .map((reference) => resolveHelpArticleReference(reference))
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));

  if (resolved.length === 0) return null;

  return (
    <div className="mt-8 space-y-3">
      <h2 className="text-xs font-bold tracking-wider text-zinc-500 uppercase">
        Related articles
      </h2>
      <ul className="space-y-2">
        {resolved.map(({ category, article }) => (
          <li key={`${category.slug}-${article.slug}`}>
            <Link
              href={Routes.help.article(category.slug, article.slug)}
              className="flex items-center gap-1.5 text-sm font-medium text-ink-charcoal underline underline-offset-2 transition hover:text-zinc-700"
            >
              {article.title}
              <ArrowRight className="size-3.5 shrink-0" strokeWidth={2} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
