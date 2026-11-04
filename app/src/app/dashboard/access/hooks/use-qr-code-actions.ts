"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "@/components/ui/toast";
import {
  downloadQrCodePng,
  printQrCode,
} from "@/features/qr-codes/utils/qr-tip-url.utils";
import { getErrorMessage } from "@/lib/api-error";

interface UseQrCodeActionsOptions {
  tipUrl: string;
  label: string;
  /** Base file name for the PNG download. */
  filename: string;
}

/** Copy / download / print handlers (with toasts) for one QR code's tip link. */
export const useQrCodeActions = ({
  tipUrl,
  label,
  filename,
}: UseQrCodeActionsOptions) => {
  const t = useTranslations("dashboard.access.actions");
  const [busy, setBusy] = useState<"download" | "print" | null>(null);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(tipUrl);
      setCopied(true);
      toast.add({
        title: t("linkCopied"),
        description: t("linkCopiedDescription"),
        type: "success",
      });
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.add({
        title: t("copyFailed"),
        description: t("copyFailedDescription"),
        type: "error",
      });
    }
  };

  const download = async () => {
    setBusy("download");
    try {
      await downloadQrCodePng(tipUrl, filename);
    } catch (error) {
      toast.add({
        title: t("downloadFailed"),
        description: getErrorMessage(error, t("tryAgain")),
        type: "error",
      });
    } finally {
      setBusy(null);
    }
  };

  const print = async () => {
    setBusy("print");
    try {
      await printQrCode(tipUrl, label);
    } catch (error) {
      toast.add({
        title: t("printFailed"),
        description: getErrorMessage(error, t("tryAgain")),
        type: "error",
      });
    } finally {
      setBusy(null);
    }
  };

  return { busy, copied, copy, download, print };
};
