"use client";

import { type FC, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Plus, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  ConfirmationDialog,
  useConfirmationDialog,
} from "@/components/ui/confirmation-dialog";
import { QrCodeCard } from "@/app/dashboard/access/components/qr-code-card";
import { QrCodeCardsSkeleton } from "@/app/dashboard/access/components/qr-code-cards-skeleton";
import { SpotsPanel } from "@/app/dashboard/access/components/spots-panel";
import {
  useDeleteQrCode,
  useQrCodes,
} from "@/features/qr-codes/hooks/use-qr-codes";
import type { QrCode as QrCodeModel } from "@/features/qr-codes/interfaces/qr-codes.interfaces";
import type { Store } from "@/features/stores/interfaces/stores.interfaces";
import { Routes } from "@/routes/routes";
import { getErrorMessage } from "@/lib/api-error";

interface QrCodesPanelProps {
  storeId: string;
  store: Store;
}

export const QrCodesPanel: FC<QrCodesPanelProps> = ({ storeId, store }) => {
  const t = useTranslations("dashboard.access.qrCodes");
  const qrCodesQuery = useQrCodes(storeId, { limit: 100 });
  const router = useRouter();
  const [pendingDelete, setPendingDelete] = useState<QrCodeModel | null>(null);
  const deleteQrCode = useDeleteQrCode();
  const deleteConfirm = useConfirmationDialog();

  const openCreate = () => {
    router.push(Routes.dashboard.accessQrNew);
  };

  const openEdit = (qr: QrCodeModel) => {
    router.push(Routes.dashboard.accessQrEdit(qr.id));
  };

  const openDelete = (qr: QrCodeModel) => {
    setPendingDelete(qr);
    deleteConfirm.openDialog();
  };

  const qrCodes = qrCodesQuery.data?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-sm font-bold text-ink-charcoal">{t("title")}</h2>
          <p className="mt-0.5 text-xs text-zinc-500">
            {t("subtitle", { storeName: store.name })}
          </p>
        </div>
        <Button
          type="button"
          className="h-(--control-height-default) max-sm:h-11 rounded-xl bg-electric-lime px-3.5 text-base font-semibold text-ink-charcoal shadow-sm"
          onClick={openCreate}
        >
          <Plus data-icon="inline-start" className="size-3.5" />
          {t("create")}
        </Button>
      </div>

      {qrCodesQuery.isPending ? (
        <QrCodeCardsSkeleton />
      ) : qrCodesQuery.isError ? (
        <Empty className="border border-dashed border-zinc-200 bg-white py-16">
          <EmptyHeader>
            <EmptyTitle>{t("loadErrorTitle")}</EmptyTitle>
            <EmptyDescription>{getErrorMessage(qrCodesQuery.error)}</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button
              type="button"
              variant="outline"
              onClick={() => void qrCodesQuery.refetch()}
            >
              {t("retry")}
            </Button>
          </EmptyContent>
        </Empty>
      ) : qrCodes.length === 0 ? (
        <Empty className="border border-dashed border-zinc-200 bg-white py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <QrCode />
            </EmptyMedia>
            <EmptyTitle>{t("emptyTitle")}</EmptyTitle>
            <EmptyDescription>
              {t("emptyDescription")}
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button
              type="button"
              className="rounded-xl bg-electric-lime text-ink-charcoal"
              onClick={openCreate}
            >
              <Plus data-icon="inline-start" className="size-3.5" />
              {t("create")}
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {qrCodes.map((qr) => (
            <QrCodeCard
              key={qr.id}
              qr={qr}
              store={store}
              onEdit={openEdit}
              onDelete={openDelete}
            />
          ))}
        </div>
      )}

      <SpotsPanel storeId={storeId} />

      <ConfirmationDialog
        state={{
          ...deleteConfirm,
          onOpenChange: (open) => {
            deleteConfirm.onOpenChange(open);
            if (!open) setPendingDelete(null);
          },
        }}
        title={t("deleteTitle")}
        description={
          pendingDelete
            ? t("deleteDescription", { label: pendingDelete.label })
            : t("deleteDescriptionFallback")
        }
        confirmLabel={t("deleteConfirm")}
        isPending={deleteQrCode.isPending}
        onConfirm={async () => {
          if (!pendingDelete) return;
          await deleteQrCode.mutateAsync(pendingDelete.id);
          setPendingDelete(null);
        }}
      />
    </div>
  );
};
