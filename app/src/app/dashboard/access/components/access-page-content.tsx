"use client";

import { type FC, useState } from "react";
import { Plus, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DetailSkeleton } from "@/components/ui/detail-skeleton";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { DashboardPageHeader } from "@/app/dashboard/components/dashboard-shared";
import { QrCodeCard } from "@/app/dashboard/access/components/qr-code-card";
import { QrCodeCardsSkeleton } from "@/app/dashboard/access/components/qr-code-cards-skeleton";
import { QrCodeFormDialog } from "@/app/dashboard/access/components/qr-code-form-dialog";
import { SpotsPanel } from "@/app/dashboard/access/components/spots-panel";
import { useQrCodes } from "@/features/qr-codes/hooks/use-qr-codes";
import type { QrCode as QrCodeModel } from "@/features/qr-codes/interfaces/qr-codes.interfaces";
import { useWorkspace } from "@/features/stores/hooks/use-workspace";

export const AccessPageContent: FC = () => {
  const { storeId, store, isPending: workspacePending, isReady } =
    useWorkspace();
  const qrCodesQuery = useQrCodes(storeId ?? "", { limit: 100 });
  const [formOpen, setFormOpen] = useState(false);
  const [editingQr, setEditingQr] = useState<QrCodeModel | null>(null);

  const openCreate = () => {
    setEditingQr(null);
    setFormOpen(true);
  };

  const openEdit = (qr: QrCodeModel) => {
    setEditingQr(qr);
    setFormOpen(true);
  };

  if (workspacePending) {
    return (
      <div className="space-y-6">
        <DetailSkeleton fieldCount={2} />
        <QrCodeCardsSkeleton />
      </div>
    );
  }

  if (!isReady || !storeId || !store) {
    return (
      <Empty className="border border-dashed border-zinc-200 bg-white py-16">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <QrCode />
          </EmptyMedia>
          <EmptyTitle>No store selected</EmptyTitle>
          <EmptyDescription>
            Finish business setup before creating customer QR codes.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  const qrCodes = qrCodesQuery.data?.data ?? [];

  return (
    <>
      <DashboardPageHeader
        title="Customer Access & QR Kits"
        description={`Generate tip links and print QR codes for ${store.name}.`}
        actions={
          <Button
            type="button"
            className="h-(--control-height-default) max-sm:h-11 rounded-xl bg-electric-lime px-3.5 text-chip font-semibold text-ink-charcoal shadow-sm hover:bg-brand-700"
            onClick={openCreate}
          >
            <Plus data-icon="inline-start" className="size-3.5" />
            Create QR code
          </Button>
        }
      />

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
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {qrCodes.map((qr) => (
            <QrCodeCard
              key={qr.id}
              qr={qr}
              storeSlug={store.slug}
              currency={store.currency}
              onEdit={openEdit}
            />
          ))}
        </div>
      )}

      <SpotsPanel storeId={storeId} />

      <QrCodeFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        storeId={storeId}
        storeSlug={store.slug}
        qr={editingQr}
      />
    </>
  );
};
