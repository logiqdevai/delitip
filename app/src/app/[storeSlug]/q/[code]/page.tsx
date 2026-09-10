import type { Metadata } from "next";
import { TipEntryPageContent } from "@/app/[storeSlug]/q/[code]/components/tip-entry-page-content";

export const metadata: Metadata = {
  title: "Leave a tip - delitip",
  description: "Thank your host with a digital tip.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function TipEntryPage({
  params,
}: {
  params: Promise<{ storeSlug: string; code: string }>;
}) {
  const { storeSlug, code } = await params;
  return <TipEntryPageContent storeSlug={storeSlug} code={code} />;
}
