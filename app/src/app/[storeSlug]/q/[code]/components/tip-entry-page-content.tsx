"use client";

import { type FC } from "react";
import { Ban, QrCode, Store } from "lucide-react";
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

const INACTIVE_QR_MESSAGE = "This QR code is no longer active";
const INACTIVE_STORE_MESSAGE = "This store is no longer active";

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

  const qrErrorMessage = qrQuery.error?.message ?? "";
  const isInactiveQr = qrErrorMessage === INACTIVE_QR_MESSAGE;
  const isInactiveStore = qrErrorMessage === INACTIVE_STORE_MESSAGE;

  if (isPending) {
    return <TipEntrySkeleton />;
  }

  if (isInactiveQr) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-paper-offwhite p-6">
        <Empty className="max-w-sm border border-dashed border-zinc-200 bg-white py-12">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Ban />
            </EmptyMedia>
            <EmptyTitle>This QR code is inactive</EmptyTitle>
            <EmptyDescription>
              This tip link has been turned off. Ask your host for an active
              code.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </main>
    );
  }

  if (isInactiveStore) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-paper-offwhite p-6">
        <Empty className="max-w-sm border border-dashed border-zinc-200 bg-white py-12">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Store />
            </EmptyMedia>
            <EmptyTitle>This store is unavailable</EmptyTitle>
            <EmptyDescription>
              This store is not accepting tips right now. Ask your host for
              another way to tip.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </main>
    );
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
              The link may be incorrect or no longer valid. Ask your host for a
              new code.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </main>
    );
  }

  return <TipFlow storeSlug={storeSlug} code={code} store={store} qr={qr} />;
};
