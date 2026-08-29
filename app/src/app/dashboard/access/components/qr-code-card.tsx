"use client";

import { type FC, useState } from "react";
import { Download, Pencil, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { getQrCodeSelectionModeLabel } from "@/config/constants/dropdowns/qr-codes/qr-code-selection-mode-form.options";
import type { QrCode } from "@/features/qr-codes/interfaces/qr-codes.interfaces";
import { getQrCodeEmployeeCount } from "@/features/qr-codes/interfaces/qr-codes.interfaces";
import {
  downloadQrCodePng,
  getAbsoluteTipUrl,
  getQrCodeImageUrl,
  getTipPath,
  printQrCode,
} from "@/features/qr-codes/utils/qr-tip-url.utils";
import { cn } from "@/lib/utils";

interface QrCodeCardProps {
  qr: QrCode;
  storeSlug: string;
  onEdit: (qr: QrCode) => void;
}

export const QrCodeCard: FC<QrCodeCardProps> = ({ qr, storeSlug, onEdit }) => {
  const [busy, setBusy] = useState<"download" | "print" | null>(null);
  const tipPath = getTipPath(storeSlug, qr.code);
  const tipUrl = getAbsoluteTipUrl(storeSlug, qr.code);
  const employeeCount = getQrCodeEmployeeCount(qr);
  const imageUrl = getQrCodeImageUrl(tipUrl, 240);

  const handleDownload = async () => {
    setBusy("download");
    try {
      await downloadQrCodePng(tipUrl, `${qr.label || qr.code}-qr`);
    } catch (error) {
      toast.add({
        title: "Could not download QR",
        description:
          error instanceof Error ? error.message : "Please try again.",
        type: "error",
      });
    } finally {
      setBusy(null);
    }
  };

  const handlePrint = () => {
    setBusy("print");
    try {
      printQrCode(tipUrl, qr.label);
    } catch (error) {
      toast.add({
        title: "Could not print QR",
        description:
          error instanceof Error ? error.message : "Please try again.",
        type: "error",
      });
    } finally {
      setBusy(null);
    }
  };

  return (
    <div
      className={cn(
        "space-y-4 rounded-3xl border bg-white p-6 text-center shadow-sm",
        qr.is_active ? "border-zinc-200" : "border-zinc-200 opacity-75",
      )}
    >
      <div>
        <h3 className="text-sm font-bold text-ink-charcoal">{qr.label}</h3>
        <p className="mt-1 break-all text-xs text-zinc-400">{tipPath}</p>
      </div>

      <div className="mx-auto flex size-40 items-center justify-center rounded-2xl bg-ink-charcoal p-2.5 shadow-inner">
        <img
          src={imageUrl}
          alt={`QR code for ${qr.label}`}
          className="size-full rounded-xl bg-white object-contain p-1"
        />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 text-[11px]">
        <span
          className={cn(
            "rounded-full px-2 py-0.5 font-bold",
            qr.is_active
              ? "bg-brand-50 text-brand-700"
              : "bg-neutral-fill text-zinc-500",
          )}
        >
          {qr.is_active ? "Active" : "Inactive"}
        </span>
        <span className="rounded-full bg-zinc-50 px-2 py-0.5 font-medium text-zinc-600">
          {getQrCodeSelectionModeLabel(qr.selection_mode)}
        </span>
        <span className="rounded-full bg-zinc-50 px-2 py-0.5 font-medium text-zinc-600">
          {employeeCount} {employeeCount === 1 ? "employee" : "employees"}
        </span>
      </div>

      {qr.distribution_rule ? (
        <p className="text-[11px] text-zinc-400">
          Rule: {qr.distribution_rule.name}
        </p>
      ) : (
        <p className="text-[11px] text-zinc-400">Uses store default rule</p>
      )}

      <div className="grid grid-cols-3 gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onEdit(qr)}
        >
          <Pencil data-icon="inline-start" className="size-3.5" />
          Edit
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={busy !== null}
          onClick={() => void handleDownload()}
        >
          <Download data-icon="inline-start" className="size-3.5" />
          PNG
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={busy !== null}
          onClick={handlePrint}
        >
          <Printer data-icon="inline-start" className="size-3.5" />
          Print
        </Button>
      </div>
    </div>
  );
};
