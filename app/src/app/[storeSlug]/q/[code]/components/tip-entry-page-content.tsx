"use client";

import { type FC, useEffect } from "react";
import { Ban, QrCode, Store } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { TipEntrySkeleton } from "@/app/[storeSlug]/q/[code]/components/tip-entry-skeleton";
import { TipFlow } from "@/app/[storeSlug]/q/[code]/components/tip-flow";
import { TipLocaleProvider } from "@/app/[storeSlug]/q/[code]/components/tip-locale-provider";
import {
  resolveLocaleForStore,
  useTipLocaleStore,
} from "@/app/[storeSlug]/q/[code]/lib/locale-store";
import { usePublicQrCode } from "@/features/qr-codes/hooks/use-qr-codes";
import { usePublicStore } from "@/features/stores/hooks/use-stores";

interface TipEntryPageContentProps {
  storeSlug: string;
  code: string;
}

const INACTIVE_QR_MESSAGE = "This QR code is no longer active";
const INACTIVE_STORE_MESSAGE = "This store is no longer active";

const InactiveQrEmptyState: FC = () => {
  const t = useTranslations("tipEntry.inactiveQr");
  return (
    <main className="flex min-h-dvh items-center justify-center bg-paper-offwhite p-4">
      <Empty className="max-w-sm border border-dashed border-zinc-200 bg-white py-12">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Ban />
          </EmptyMedia>
          <EmptyTitle>{t("title")}</EmptyTitle>
          <EmptyDescription>{t("description")}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </main>
  );
};

const InactiveStoreEmptyState: FC = () => {
  const t = useTranslations("tipEntry.inactiveStore");
  return (
    <main className="flex min-h-dvh items-center justify-center bg-paper-offwhite p-4">
      <Empty className="max-w-sm border border-dashed border-zinc-200 bg-white py-12">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Store />
          </EmptyMedia>
          <EmptyTitle>{t("title")}</EmptyTitle>
          <EmptyDescription>{t("description")}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </main>
  );
};

const NotFoundEmptyState: FC = () => {
  const t = useTranslations("tipEntry.notFound");
  return (
    <main className="flex min-h-dvh items-center justify-center bg-paper-offwhite p-4">
      <Empty className="max-w-sm border border-dashed border-zinc-200 bg-white py-12">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <QrCode />
          </EmptyMedia>
          <EmptyTitle>{t("title")}</EmptyTitle>
          <EmptyDescription>{t("description")}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </main>
  );
};

const TipEntryPageInner: FC<TipEntryPageContentProps> = ({
  storeSlug,
  code,
}) => {
  const locale = useTipLocaleStore((state) => state.locale);
  const setDetectedLocale = useTipLocaleStore(
    (state) => state.setDetectedLocale,
  );

  const qrQuery = usePublicQrCode(code, locale);
  const storeQuery = usePublicStore(storeSlug, locale);

  const isPending = qrQuery.isPending || storeQuery.isPending;
  const loadFailed = qrQuery.isError || storeQuery.isError;

  const qr = qrQuery.data;
  const store = storeQuery.data;

  // Once the store's own supported_languages/primary_language are known,
  // clamp the initial browser-language guess to what this store actually
  // supports — re-triggers both queries with the corrected `lang` if needed.
  useEffect(() => {
    if (!store) return;
    const clamped = resolveLocaleForStore(
      locale,
      store.supported_languages,
      store.primary_language,
    );
    if (clamped) setDetectedLocale(clamped);
  }, [store, locale, setDetectedLocale]);

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
    return <InactiveQrEmptyState />;
  }

  if (isInactiveStore) {
    return <InactiveStoreEmptyState />;
  }

  if (loadFailed || !qr || !store || slugMismatch) {
    return <NotFoundEmptyState />;
  }

  return <TipFlow storeSlug={storeSlug} code={code} store={store} qr={qr} />;
};

export const TipEntryPageContent: FC<TipEntryPageContentProps> = (props) => {
  return (
    <TipLocaleProvider>
      <TipEntryPageInner {...props} />
    </TipLocaleProvider>
  );
};
