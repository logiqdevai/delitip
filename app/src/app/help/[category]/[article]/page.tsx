import { type Metadata } from "next";
import { type FC } from "react";
import { notFound } from "next/navigation";
import { HelpBreadcrumbs } from "../../components/help-breadcrumbs";
import { HelpArticleBody } from "../../components/help-article-body";
import { HelpRelatedArticles } from "../../components/help-related-articles";
import { HelpContactCta } from "../../components/help-contact-cta";
import {
  getAllHelpArticlesFlat,
  getHelpArticle,
} from "@/lib/help-center.utils";
import { environments } from "@/config/environments";
import { Routes } from "@/routes/routes";

interface HelpArticlePageProps {
  params: Promise<{ category: string; article: string }>;
}

export function generateStaticParams() {
  return getAllHelpArticlesFlat().map(({ category, article }) => ({
    category: category.slug,
    article: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: HelpArticlePageProps): Promise<Metadata> {
  const { category: categorySlug, article: articleSlug } = await params;
  const found = getHelpArticle(categorySlug, articleSlug);
  if (!found) return {};

  return {
    title: `${found.article.title} - Help Center - delitip`,
    description: found.article.summary,
    alternates: {
      canonical: `${environments.siteUrl}${Routes.help.article(categorySlug, articleSlug)}`,
    },
  };
}

const HelpArticlePage: FC<HelpArticlePageProps> = async ({ params }) => {
  const { category: categorySlug, article: articleSlug } = await params;
  const found = getHelpArticle(categorySlug, articleSlug);

  if (!found) notFound();

  const { category, article } = found;

  return (
    <section className="hero-glow relative overflow-hidden pt-10 pb-20 md:pt-14 md:pb-28">
      <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <HelpBreadcrumbs
          items={[
            { label: "Help Center", href: Routes.help.root },
            {
              label: category.title,
              href: Routes.help.category(category.slug),
            },
            { label: article.title },
          ]}
        />
        <h1 className="mt-3 text-3xl leading-[1.12] font-extrabold tracking-tight text-ink-charcoal sm:text-5xl">
          {article.title}
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-zinc-600 sm:text-base">
          {article.summary}
        </p>

        <article className="mt-10">
          <HelpArticleBody sections={article.sections} />
        </article>

        {article.related && article.related.length > 0 && (
          <HelpRelatedArticles references={article.related} />
        )}

        <HelpContactCta />
      </div>
    </section>
  );
};

export default HelpArticlePage;
