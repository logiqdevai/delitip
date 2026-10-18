"use client";

import { useState } from "react";
import { toast } from "@/components/ui/toast";
import {
  downloadQrCodePng,
  printQrCode,
} from "@/features/qr-codes/utils/qr-tip-url.utils";

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
  const [busy, setBusy] = useState<"download" | "print" | null>(null);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
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

  const download = async () => {
    setBusy("download");
    try {
      await downloadQrCodePng(tipUrl, filename);
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

  const print = async () => {
    setBusy("print");
    try {
      await printQrCode(tipUrl, label);
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

  return { busy, copied, copy, download, print };
};
