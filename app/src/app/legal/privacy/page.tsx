import { type Metadata } from "next";
import { type FC, type ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { LegalDocument } from "../components/legal-document";
import { Routes } from "@/routes/routes";
import { SiteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy - delitip",
  description:
    "Privacy Policy for delitip - how we collect, use, and protect information.",
};

const SECTION_KEYS = Array.from({ length: 17 }, (_, i) => `s${i + 1}`);

const richTags = {
  p: (chunks: ReactNode) => <p>{chunks}</p>,
  ul: (chunks: ReactNode) => (
    <ul className="list-disc space-y-1 pl-5">{chunks}</ul>
  ),
  li: (chunks: ReactNode) => <li>{chunks}</li>,
  strong: (chunks: ReactNode) => <strong>{chunks}</strong>,
  email: () => (
    <a
      href={SiteConfig.contactEmailHref}
      className="font-medium text-ink-charcoal underline underline-offset-2"
    >
      {SiteConfig.contactEmail}
    </a>
  ),
};

const PrivacyPage: FC = async () => {
  const t = await getTranslations("legal.privacy");

  const sections = SECTION_KEYS.map((key) => ({
    title: t(`sections.${key}.title`),
    body: (
      <>{t.rich(`sections.${key}.body`, richTags)}</>
    ),
  }));

  return (
    <LegalDocument
      title={t("title")}
      description={t("description")}
      lastUpdated={t("lastUpdated")}
      alternateHref={Routes.legal.terms}
      alternateLabel={t("alternateLabel")}
      sections={sections}
    />
  );
};

export default PrivacyPage;
