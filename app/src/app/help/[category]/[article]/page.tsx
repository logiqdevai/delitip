import { type Metadata } from "next";
import { type FC } from "react";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
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
import type { HelpArticleSection } from "@/interfaces/help-center.interfaces";

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

  const t = await getTranslations("help");
  const base = `categories.${categorySlug}.articles.${articleSlug}`;
  const title = t.has(`${base}.title`) ? t(`${base}.title`) : found.article.title;
  const summary = t.has(`${base}.summary`)
    ? t(`${base}.summary`)
    : found.article.summary;

  return {
    title: `${title} - ${t("helpCenter")} - delitip`,
    description: summary,
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

  const t = await getTranslations("help");
  const categoryKey = `categories.${category.slug}`;
  const base = `${categoryKey}.articles.${article.slug}`;
  const categoryTitle = t.has(`${categoryKey}.title`)
    ? t(`${categoryKey}.title`)
    : category.title;
  const title = t.has(`${base}.title`) ? t(`${base}.title`) : article.title;
  const summary = t.has(`${base}.summary`)
    ? t(`${base}.summary`)
    : article.summary;
  const sections = t.has(`${base}.sections`)
    ? (t.raw(`${base}.sections`) as HelpArticleSection[]).map((section, index) => ({
        ...article.sections[index],
        ...section,
      }))
    : article.sections;

  return (
    <section className="hero-glow relative overflow-hidden pt-10 pb-20 md:pt-14 md:pb-28">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <HelpBreadcrumbs
          items={[
            { label: t("helpCenter"), href: Routes.help.root },
            {
              label: categoryTitle,
              href: Routes.help.category(category.slug),
            },
            { label: title },
          ]}
        />
        <h1 className="mt-3 text-3xl leading-[1.12] font-extrabold tracking-tight text-ink-charcoal sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-zinc-600 sm:text-[18px]">
          {summary}
        </p>

        <article className="mt-10">
          <HelpArticleBody sections={sections} />
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
