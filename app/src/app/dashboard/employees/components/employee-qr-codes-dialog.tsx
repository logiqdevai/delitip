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
    <li className="min-w-0 overflow-hidden rounded-xl border border-zinc-200/80 bg-white">
      <div className="flex items-start gap-3 p-3.5 sm:gap-4 sm:p-4">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
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
            <p className="flex items-start gap-1.5 text-xs text-zinc-500">
              <ModeIcon
                className="mt-0.5 size-3.5 shrink-0 text-zinc-400"
                strokeWidth={2}
              />
              <span className="min-w-0 break-words">
                {getQrCodeSelectionModeLabel(qr.selection_mode)}
              </span>
            </p>
            <p className="flex items-start gap-1.5 text-xs text-zinc-500">
              <Users
                className="mt-0.5 size-3.5 shrink-0 text-zinc-400"
                strokeWidth={2}
              />
              <span className="min-w-0 break-words">
                {employeeCount}{" "}
                {employeeCount === 1 ? "employee" : "employees"} assigned
              </span>
            </p>
            <p className="flex items-start gap-1.5 text-xs text-zinc-500">
              <Percent
                className="mt-0.5 size-3.5 shrink-0 text-zinc-400"
                strokeWidth={2}
              />
              <span className="min-w-0 break-words">
                {qr.distribution_rule
                  ? `Split by "${qr.distribution_rule.name}"`
                  : "Uses store's default split rule"}
              </span>
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="text-zinc-500 hover:text-ink-charcoal"
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
            size="icon-sm"
            className="text-zinc-500 hover:text-ink-charcoal"
            onClick={() => onEdit(qr)}
            aria-label={`Edit ${qr.label}`}
          >
            <Pencil className="size-3.5" strokeWidth={2} />
          </Button>
        </div>
      </div>
      <div className="border-t border-zinc-100 bg-zinc-50/80 px-3.5 py-2.5 sm:px-4">
        <a
          href={tipUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block truncate font-mono text-[11px] leading-relaxed text-zinc-400 underline-offset-2 hover:text-brand-700 hover:underline"
          title={tipUrl}
        >
          {tipUrl}
        </a>
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
        <DialogContent className="min-w-0 grid-cols-[minmax(0,1fr)] gap-5 overflow-x-hidden p-5 sm:max-w-xl sm:gap-6 sm:p-6">
          <DialogHeader className="min-w-0">
            <DialogTitle className="pr-2 text-balance break-words">
              QR codes for {employee.full_name}
            </DialogTitle>
            <DialogDescription className="text-pretty break-words">
              Every QR code this employee is currently assigned to.
            </DialogDescription>
          </DialogHeader>

          {qrCodesQuery.isPending ? (
            <div className="min-w-0 space-y-3">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : qrCodesQuery.isError ? (
            <Empty className="min-w-0 border border-dashed border-zinc-200 bg-zinc-50 py-8">
              <EmptyHeader>
                <EmptyTitle>Could not load QR codes</EmptyTitle>
                <EmptyDescription>{qrCodesQuery.error.message}</EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : qrCodes.length === 0 ? (
            <Empty className="min-w-0 border border-dashed border-zinc-200 bg-zinc-50 py-8">
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
                  <Button type="button" variant="outline" size="default" onClick={openCreate}>
                    <Plus data-icon="inline-start" className="size-3.5" />
                    Create QR code
                  </Button>
                </EmptyContent>
              ) : null}
            </Empty>
          ) : (
            <div className="min-w-0 space-y-4">
              <ul className="max-h-[min(24rem,55vh)] min-w-0 space-y-3 overflow-y-auto overflow-x-hidden">
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
                  size="default"
                  className="w-full max-w-full"
                  onClick={openCreate}
                >
                  <Plus data-icon="inline-start" className="size-3.5" />
                  <span className="truncate">Create another QR code</span>
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
