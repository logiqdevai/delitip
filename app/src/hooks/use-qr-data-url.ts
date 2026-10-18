"use client";

import { useEffect, useState } from "react";
import {
  renderQrDataUrl,
  type QrCodeErrorCorrection,
} from "@/features/qr-codes/utils/qr-tip-url.utils";

export function useQrDataUrl(
  tipUrl: string | null,
  size = 240,
  ecc?: QrCodeErrorCorrection,
): string | null {
  const [result, setResult] = useState<{ key: string; url: string } | null>(
    null,
  );
  const key = `${tipUrl}|${size}|${ecc ?? ""}`;

  useEffect(() => {
    if (!tipUrl) return;
    let cancelled = false;
    renderQrDataUrl(tipUrl, size, { ecc })
      .then((url) => {
        if (!cancelled) setResult({ key, url });
      })
      .catch(() => {
        if (!cancelled) setResult(null);
      });
    return () => {
      cancelled = true;
    };
  }, [tipUrl, size, ecc, key]);

  return result?.key === key ? result.url : null;
}
