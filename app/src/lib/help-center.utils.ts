import { HelpCategories } from "@/config/help-center/help-categories";
import type {
  HelpArticle,
  HelpArticleReference,
  HelpCategory,
  HelpSearchEntry,
} from "@/interfaces/help-center.interfaces";

export function getHelpCategory(categorySlug: string): HelpCategory | undefined {
  return HelpCategories.find((category) => category.slug === categorySlug);
}

export function getHelpArticle(
  categorySlug: string,
  articleSlug: string,
): { category: HelpCategory; article: HelpArticle } | undefined {
  const category = getHelpCategory(categorySlug);
  const article = category?.articles.find((item) => item.slug === articleSlug);
  if (!category || !article) return undefined;
  return { category, article };
}

export function resolveHelpArticleReference(
  reference: HelpArticleReference,
): { category: HelpCategory; article: HelpArticle } | undefined {
  return getHelpArticle(reference.category, reference.article);
}

export function getAllHelpArticlesFlat(): {
  category: HelpCategory;
  article: HelpArticle;
}[] {
  return HelpCategories.flatMap((category) =>
    category.articles.map((article) => ({ category, article })),
  );
}

export function getHelpSearchIndex(): HelpSearchEntry[] {
  return getAllHelpArticlesFlat().map(({ category, article }) => ({
    categorySlug: category.slug,
    categoryTitle: category.title,
    articleSlug: article.slug,
    title: article.title,
    summary: article.summary,
  }));
}
