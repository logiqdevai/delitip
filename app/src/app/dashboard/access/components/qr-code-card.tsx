"use client";

import { type FC, useState } from "react";
import { Check, Copy, Download, Pencil, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { getQrCodeSelectionModeLabel } from "@/config/constants/dropdowns/qr-codes/qr-code-selection-mode-form.options";
import { useQrCodeStats } from "@/features/qr-codes/hooks/use-qr-codes";
import type { QrCode } from "@/features/qr-codes/interfaces/qr-codes.interfaces";
import { getQrCodeEmployeeCount } from "@/features/qr-codes/interfaces/qr-codes.interfaces";
import {
  downloadQrCodePng,
  getAbsoluteTipUrl,
  getQrCodeImageUrl,
  printQrCode,
} from "@/features/qr-codes/utils/qr-tip-url.utils";
import type { Currency } from "@/features/stores/interfaces/stores.interfaces";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";

interface QrCodeCardProps {
  qr: QrCode;
  storeSlug: string;
  currency: Currency;
  onEdit: (qr: QrCode) => void;
}

export const QrCodeCard: FC<QrCodeCardProps> = ({
  qr,
  storeSlug,
  currency,
  onEdit,
}) => {
  const [busy, setBusy] = useState<"download" | "print" | null>(null);
  const [copied, setCopied] = useState(false);
  const statsQuery = useQrCodeStats(qr.id);
  const tipUrl = getAbsoluteTipUrl(storeSlug, qr.code);
  const employeeCount = getQrCodeEmployeeCount(qr);
  const imageUrl = getQrCodeImageUrl(tipUrl, 240);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(tipUrl);
      setCopied(true);
      toast.add({
        title: "Link copied",
        description: "Tip URL copied to clipboard.",
        type: "success",
      });
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.add({
        title: "Could not copy",
        description: "Please copy the link manually.",
        type: "error",
      });
    }
  };

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
        <div className="mt-1 flex items-start justify-center gap-1">
          <p className="min-w-0 break-all text-xs text-zinc-400">{tipUrl}</p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="size-7 shrink-0 px-0 text-zinc-400 hover:text-ink-charcoal"
            onClick={() => void handleCopy()}
            aria-label={copied ? "Copied tip URL" : "Copy tip URL"}
          >
            {copied ? (
              <Check className="size-3.5 text-brand-700" strokeWidth={2} />
            ) : (
              <Copy className="size-3.5" strokeWidth={2} />
            )}
          </Button>
        </div>
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

      {statsQuery.data ? (
        <div className="flex items-center justify-center gap-3 border-t border-zinc-100 pt-3 text-[11px] text-zinc-500">
          <span>
            <span className="font-bold text-ink-charcoal">
              {statsQuery.data.tips_count}
            </span>{" "}
            {statsQuery.data.tips_count === 1 ? "tip" : "tips"}
          </span>
          <span aria-hidden className="text-zinc-300">
            ·
          </span>
          <span className="font-bold text-ink-charcoal">
            {formatMoney(statsQuery.data.tips_total_amount, currency)}
          </span>
          <span aria-hidden className="text-zinc-300">
            ·
          </span>
          <span>
            <span className="font-bold text-ink-charcoal">
              {statsQuery.data.reviews_count}
            </span>{" "}
            {statsQuery.data.reviews_count === 1 ? "review" : "reviews"}
          </span>
        </div>
      ) : null}

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
