export interface HelpMenuLink {
  label: string;
  href: string;
}

export interface HelpArticleSection {
  heading?: string;
  paragraphs: string[];
  list?: string[];
  links?: HelpMenuLink[];
}

export interface HelpArticleReference {
  category: string;
  article: string;
}

export interface HelpArticle {
  slug: string;
  title: string;
  summary: string;
  sections: HelpArticleSection[];
  related?: HelpArticleReference[];
}

export interface HelpCategory {
  slug: string;
  title: string;
  description: string;
  icon: string;
  articles: HelpArticle[];
}

export interface HelpSearchEntry {
  categorySlug: string;
  categoryTitle: string;
  articleSlug: string;
  title: string;
  summary: string;
}
