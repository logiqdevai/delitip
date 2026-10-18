"use client";

import { type FC, useState } from "react";
import { useRouter } from "next/navigation";
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

interface QrCodesPanelProps {
  storeId: string;
  store: Store;
}

export const QrCodesPanel: FC<QrCodesPanelProps> = ({ storeId, store }) => {
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
          <h2 className="text-sm font-bold text-ink-charcoal">QR kits</h2>
          <p className="mt-0.5 text-xs text-zinc-500">
            Generate tip links and print QR codes for {store.name}.
          </p>
        </div>
        <Button
          type="button"
          className="h-(--control-height-default) max-sm:h-11 rounded-xl bg-electric-lime px-3.5 text-chip font-semibold text-ink-charcoal shadow-sm hover:bg-brand-700"
          onClick={openCreate}
        >
          <Plus data-icon="inline-start" className="size-3.5" />
          Create QR code
        </Button>
      </div>

      {qrCodesQuery.isPending ? (
        <QrCodeCardsSkeleton />
      ) : qrCodesQuery.isError ? (
        <Empty className="border border-dashed border-zinc-200 bg-white py-16">
          <EmptyHeader>
            <EmptyTitle>Could not load QR codes</EmptyTitle>
            <EmptyDescription>{qrCodesQuery.error.message}</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button
              type="button"
              variant="outline"
              onClick={() => void qrCodesQuery.refetch()}
            >
              Try again
            </Button>
          </EmptyContent>
        </Empty>
      ) : qrCodes.length === 0 ? (
        <Empty className="border border-dashed border-zinc-200 bg-white py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <QrCode />
            </EmptyMedia>
            <EmptyTitle>No QR codes yet</EmptyTitle>
            <EmptyDescription>
              Create your first table or counter QR so customers can tip and
              leave feedback.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button
              type="button"
              className="rounded-xl bg-electric-lime text-ink-charcoal hover:bg-brand-700"
              onClick={openCreate}
            >
              <Plus data-icon="inline-start" className="size-3.5" />
              Create QR code
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
        title="Delete QR code?"
        description={
          pendingDelete
            ? `"${pendingDelete.label}" will be removed and its tip link will stop working. Printed copies will no longer open the tip page.`
            : "This QR code will be removed."
        }
        confirmLabel="Delete"
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
