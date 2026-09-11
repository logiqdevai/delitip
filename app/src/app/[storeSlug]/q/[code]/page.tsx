import type { Metadata } from "next";
import { headers } from "next/headers";
import { TipEntryPageContent } from "@/app/[storeSlug]/q/[code]/components/tip-entry-page-content";
import { MESSAGES_BY_LOCALE, type TipPageMessages } from "@/app/[storeSlug]/q/[code]/messages";
import type { TipLocale } from "@/app/[storeSlug]/q/[code]/lib/locale-store";

// Best-effort only — the store's own supported_languages isn't known yet at
// this point (would require an extra fetch), so this can't be fully accurate
// for every store. Acceptable for a <head> tag that's rarely user-visible
// directly; the rendered page itself resolves the real, store-clamped
// locale client-side (see tip-entry-page-content.tsx).
function resolveMetadataLocale(acceptLanguage: string | null): TipLocale {
  if (!acceptLanguage) return "en";
  const candidates = acceptLanguage
    .split(",")
    .map((part) => part.split(";")[0].trim().split("-")[0].toLowerCase());
  const match = candidates.find(
    (candidate): candidate is TipLocale => candidate in MESSAGES_BY_LOCALE,
  );
  return match ?? "en";
}

export async function generateMetadata(): Promise<Metadata> {
  const headerList = await headers();
  const locale = resolveMetadataLocale(headerList.get("accept-language"));
  const { title, description }: TipPageMessages["metadata"] =
    MESSAGES_BY_LOCALE[locale].metadata;

  return {
    title,
    description,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function TipEntryPage({
  params,
}: {
  params: Promise<{ storeSlug: string; code: string }>;
}) {
  const { storeSlug, code } = await params;
  return <TipEntryPageContent storeSlug={storeSlug} code={code} />;
}
