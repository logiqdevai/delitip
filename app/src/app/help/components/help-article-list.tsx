import { type FC } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Routes } from "@/routes/routes";
import type { HelpArticle } from "@/interfaces/help-center.interfaces";

interface HelpArticleListProps {
  categorySlug: string;
  articles: HelpArticle[];
}

export const HelpArticleList: FC<HelpArticleListProps> = ({
  categorySlug,
  articles,
}) => {
  return (
    <ul className="space-y-3">
      {articles.map((article) => (
        <li key={article.slug}>
          <Link
            href={Routes.help.article(categorySlug, article.slug)}
            className="group flex items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white p-5 transition hover:border-zinc-300 hover:shadow-md"
          >
            <span>
              <span className="block text-sm font-bold text-ink-charcoal">
                {article.title}
              </span>
              <span className="mt-1 block text-sm text-zinc-600">
                {article.summary}
              </span>
            </span>
            <ArrowRight
              className="size-4 shrink-0 text-zinc-400 transition group-hover:text-ink-charcoal"
              strokeWidth={2}
            />
          </Link>
        </li>
      ))}
    </ul>
  );
};
