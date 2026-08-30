import type { MetadataRoute } from "next";
import { environments } from "@/config/environments";
import { Routes } from "@/routes/routes";
import { getAllHelpArticlesFlat } from "@/lib/help-center.utils";
import { HelpCategories } from "@/config/help-center/help-categories";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = environments.siteUrl;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}${Routes.home}`, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}${Routes.contact}`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${baseUrl}${Routes.legal.terms}`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}${Routes.legal.privacy}`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}${Routes.help.root}`, changeFrequency: "weekly", priority: 0.8 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = HelpCategories.map((category) => ({
    url: `${baseUrl}${Routes.help.category(category.slug)}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const articleRoutes: MetadataRoute.Sitemap = getAllHelpArticlesFlat().map(
    ({ category, article }) => ({
      url: `${baseUrl}${Routes.help.article(category.slug, article.slug)}`,
      changeFrequency: "monthly",
      priority: 0.5,
    }),
  );

  return [...staticRoutes, ...categoryRoutes, ...articleRoutes];
}
