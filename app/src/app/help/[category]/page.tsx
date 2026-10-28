import { type Metadata } from "next";
import { type FC } from "react";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { HelpBreadcrumbs } from "../components/help-breadcrumbs";
import { HelpArticleList } from "../components/help-article-list";
import { HelpContactCta } from "../components/help-contact-cta";
import { HelpCategories } from "@/config/help-center/help-categories";
import { getHelpCategory } from "@/lib/help-center.utils";
import { environments } from "@/config/environments";
import { Routes } from "@/routes/routes";

interface HelpCategoryPageProps {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  return HelpCategories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({
  params,
}: HelpCategoryPageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = getHelpCategory(categorySlug);
  if (!category) return {};
  const t = await getTranslations("help");
  const titleKey = `categories.${category.slug}.title`;
  const descriptionKey = `categories.${category.slug}.description`;
  const title = t.has(titleKey) ? t(titleKey) : category.title;
  const description = t.has(descriptionKey)
    ? t(descriptionKey)
    : category.description;

  return {
    title: `${title} - ${t("helpCenter")} - delitip`,
    description,
    alternates: {
      canonical: `${environments.siteUrl}${Routes.help.category(category.slug)}`,
    },
  };
}

const HelpCategoryPage: FC<HelpCategoryPageProps> = async ({ params }) => {
  const { category: categorySlug } = await params;
  const category = getHelpCategory(categorySlug);

  if (!category) notFound();

  const t = await getTranslations("help");
  const titleKey = `categories.${category.slug}.title`;
  const descriptionKey = `categories.${category.slug}.description`;
  const title = t.has(titleKey) ? t(titleKey) : category.title;
  const description = t.has(descriptionKey)
    ? t(descriptionKey)
    : category.description;

  return (
    <section className="hero-glow relative overflow-hidden pt-10 pb-20 md:pt-14 md:pb-28">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <HelpBreadcrumbs
          items={[
            { label: t("helpCenter"), href: Routes.help.root },
            { label: title },
          ]}
        />
        <h1 className="mt-3 text-3xl leading-[1.12] font-extrabold tracking-tight text-ink-charcoal sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-zinc-600 sm:text-base">
          {description}
        </p>

        <div className="mt-10">
          <HelpArticleList
            categorySlug={category.slug}
            articles={category.articles}
          />
        </div>

        <HelpContactCta />
      </div>
    </section>
  );
};

export default HelpCategoryPage;
