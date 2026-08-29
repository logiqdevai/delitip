"use client";

import { type FC } from "react";
import { QrCode } from "lucide-react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { TipEntrySkeleton } from "@/app/[storeSlug]/q/[code]/components/tip-entry-skeleton";
import { TipFlow } from "@/app/[storeSlug]/q/[code]/components/tip-flow";
import { usePublicQrCode } from "@/features/qr-codes/hooks/use-qr-codes";
import { usePublicStore } from "@/features/stores/hooks/use-stores";

interface TipEntryPageContentProps {
  storeSlug: string;
  code: string;
}

export const TipEntryPageContent: FC<TipEntryPageContentProps> = ({
  storeSlug,
  code,
}) => {
  const qrQuery = usePublicQrCode(code);
  const storeQuery = usePublicStore(storeSlug);

  const isPending = qrQuery.isPending || storeQuery.isPending;
  const loadFailed = qrQuery.isError || storeQuery.isError;

  const qr = qrQuery.data;
  const store = storeQuery.data;

  const slugMismatch =
    !!qr &&
    !!store &&
    (qr.store.slug !== storeSlug || qr.store.id !== store.id);

  if (isPending) {
    return <TipEntrySkeleton />;
  }

  if (loadFailed || !qr || !store || slugMismatch) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-paper-offwhite p-6">
        <Empty className="max-w-sm border border-dashed border-zinc-200 bg-white py-12">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <QrCode />
            </EmptyMedia>
            <EmptyTitle>This tip link is unavailable</EmptyTitle>
            <EmptyDescription>
              The QR code may be inactive, the store may be closed, or the link
              is incorrect. Ask your host for a new code.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </main>
    );
  }

  return <TipFlow storeSlug={storeSlug} store={store} qr={qr} />;
};
