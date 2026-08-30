"use client";

import { type FC, useState } from "react";
import {
  Check,
  Copy,
  Pencil,
  Percent,
  Plus,
  QrCode as QrCodeIcon,
  User,
  Users,
  UsersRound,
} from "lucide-react";
import { QrCodeFormDialog } from "@/app/dashboard/access/components/qr-code-form-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { toast } from "@/components/ui/toast";
import { getQrCodeSelectionModeLabel } from "@/config/constants/dropdowns/qr-codes/qr-code-selection-mode-form.options";
import { useQrCodes } from "@/features/qr-codes/hooks/use-qr-codes";
import {
  getQrCodeEmployeeCount,
  QrCodeSelectionModes,
  type QrCode,
  type QrCodeSelectionMode,
} from "@/features/qr-codes/interfaces/qr-codes.interfaces";
import { getAbsoluteTipUrl } from "@/features/qr-codes/utils/qr-tip-url.utils";
import { useWorkspace } from "@/features/stores/hooks/use-workspace";
import { cn } from "@/lib/utils";

const selectionModeIcons: Record<QrCodeSelectionMode, typeof User> = {
  [QrCodeSelectionModes.CHOOSE_ONE]: User,
  [QrCodeSelectionModes.CHOOSE_MANY]: Users,
  [QrCodeSelectionModes.TEAM]: UsersRound,
};

interface EmployeeQrCodesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: {
    id: string;
    full_name: string;
    position?: string | null;
  };
}

export const QrRow: FC<{ qr: QrCode; storeSlug: string; onEdit: (qr: QrCode) => void }> = ({
  qr,
  storeSlug,
  onEdit,
}) => {
  const [copied, setCopied] = useState(false);
  const tipUrl = getAbsoluteTipUrl(storeSlug, qr.code);
  const employeeCount = getQrCodeEmployeeCount(qr);
  const ModeIcon = selectionModeIcons[qr.selection_mode];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(tipUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.add({
        title: "Could not copy",
        description: "Please copy the link manually.",
        type: "error",
      });
    }
  };

  return (
    <li className="flex items-start justify-between gap-4 rounded-xl border border-zinc-200/80 bg-white p-4">
      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
          <span className="text-sm font-bold text-ink-charcoal">
            {qr.label}
          </span>
          <span
            className={cn(
              "inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-caption font-bold",
              qr.is_active
                ? "bg-brand-50 text-brand-700"
                : "bg-neutral-fill font-medium text-zinc-500",
            )}
          >
            {qr.is_active ? "Active" : "Inactive"}
          </span>
        </div>
        <div className="space-y-1">
          <p className="flex items-center gap-1.5 text-xs text-zinc-500">
            <ModeIcon className="size-3.5 shrink-0 text-zinc-400" strokeWidth={2} />
            {getQrCodeSelectionModeLabel(qr.selection_mode)}
          </p>
          <p className="flex items-center gap-1.5 text-xs text-zinc-500">
            <Users className="size-3.5 shrink-0 text-zinc-400" strokeWidth={2} />
            {employeeCount} {employeeCount === 1 ? "employee" : "employees"} assigned
          </p>
          <p className="flex items-center gap-1.5 text-xs text-zinc-500">
            <Percent className="size-3.5 shrink-0 text-zinc-400" strokeWidth={2} />
            {qr.distribution_rule
              ? `Split by "${qr.distribution_rule.name}"`
              : "Uses store's default split rule"}
          </p>
        </div>
        <a
          href={tipUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block truncate text-xs text-zinc-400 underline-offset-2 hover:text-brand-700 hover:underline"
        >
          {tipUrl}
        </a>
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="size-8 px-0 text-zinc-500 hover:text-ink-charcoal"
          onClick={() => void handleCopy()}
          aria-label={copied ? "Copied tip URL" : "Copy tip URL"}
        >
          {copied ? (
            <Check className="size-3.5 text-brand-700" strokeWidth={2} />
          ) : (
            <Copy className="size-3.5" strokeWidth={2} />
          )}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="size-8 px-0 text-zinc-500 hover:text-ink-charcoal"
          onClick={() => onEdit(qr)}
          aria-label={`Edit ${qr.label}`}
        >
          <Pencil className="size-3.5" strokeWidth={2} />
        </Button>
      </div>
    </li>
  );
};

export const EmployeeQrCodesDialog: FC<EmployeeQrCodesDialogProps> = ({
  open,
  onOpenChange,
  employee,
}) => {
  const { storeId, store } = useWorkspace();
  const [formOpen, setFormOpen] = useState(false);
  const [editingQr, setEditingQr] = useState<QrCode | null>(null);

  const qrCodesQuery = useQrCodes(open ? (storeId ?? "") : "", {
    employee_ids: [employee.id],
    limit: 100,
  });

  const qrCodes = qrCodesQuery.data?.data ?? [];
  const presetEmployees = [
    { id: employee.id, full_name: employee.full_name, position: employee.position },
  ];

  const openCreate = () => {
    setEditingQr(null);
    setFormOpen(true);
  };

  const openEdit = (qr: QrCode) => {
    setEditingQr(qr);
    setFormOpen(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="gap-6 p-6 sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>QR codes for {employee.full_name}</DialogTitle>
            <DialogDescription>
              Every QR code this employee is currently assigned to.
            </DialogDescription>
          </DialogHeader>

          {qrCodesQuery.isPending ? (
            <div className="space-y-3">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : qrCodesQuery.isError ? (
            <Empty className="border border-dashed border-zinc-200 bg-zinc-50 py-8">
              <EmptyHeader>
                <EmptyTitle>Could not load QR codes</EmptyTitle>
                <EmptyDescription>{qrCodesQuery.error.message}</EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : qrCodes.length === 0 ? (
            <Empty className="border border-dashed border-zinc-200 bg-zinc-50 py-8">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <QrCodeIcon />
                </EmptyMedia>
                <EmptyTitle>No QR codes yet</EmptyTitle>
                <EmptyDescription>
                  This employee isn&apos;t assigned to any QR code.
                </EmptyDescription>
              </EmptyHeader>
              {storeId && store ? (
                <EmptyContent>
                  <Button type="button" variant="outline" size="sm" onClick={openCreate}>
                    <Plus data-icon="inline-start" className="size-3.5" />
                    Create QR code
                  </Button>
                </EmptyContent>
              ) : null}
            </Empty>
          ) : (
            <div className="space-y-4">
              <ul className="max-h-96 space-y-3 overflow-y-auto">
                {qrCodes.map((qr) => (
                  <QrRow
                    key={qr.id}
                    qr={qr}
                    storeSlug={store?.slug ?? ""}
                    onEdit={openEdit}
                  />
                ))}
              </ul>
              {storeId && store ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={openCreate}
                >
                  <Plus data-icon="inline-start" className="size-3.5" />
                  Create another QR code
                </Button>
              ) : null}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {storeId && store ? (
        <QrCodeFormDialog
          open={formOpen}
          onOpenChange={setFormOpen}
          storeId={storeId}
          storeSlug={store.slug}
          qr={editingQr}
          defaultEmployeeIds={editingQr ? undefined : [employee.id]}
          presetEmployees={presetEmployees}
        />
      ) : null}
    </>
  );
};
