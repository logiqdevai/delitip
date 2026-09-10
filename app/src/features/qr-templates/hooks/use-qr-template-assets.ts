"use client";

import { useEffect, useState } from "react";
import {
  fetchImageAsObjectUrl,
  getQrCodeImageUrl,
} from "@/features/qr-codes/utils/qr-tip-url.utils";

interface UseQrTemplateAssetsResult {
  qrObjectUrl: string | null;
  logoObjectUrl: string | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Loads the QR image (raised error correction, since templates overlay a decorative
 * badge on the QR center) and the store logo as `blob:` object URLs so a template can
 * be rasterized without cross-origin canvas taint. A logo load failure degrades
 * gracefully (falls back to no logo) rather than blocking the QR, which is the only
 * asset the feature actually depends on.
 */
export function useQrTemplateAssets(
  tipUrl: string | null,
  logoUrl?: string | null,
): UseQrTemplateAssetsResult {
  const [qrObjectUrl, setQrObjectUrl] = useState<string | null>(null);
  const [logoObjectUrl, setLogoObjectUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tipUrl) {
      setQrObjectUrl(null);
      setLogoObjectUrl(null);
      setError(null);
      return;
    }

    let cancelled = false;
    let loadedQrUrl: string | null = null;
    let loadedLogoUrl: string | null = null;

    setIsLoading(true);
    setError(null);

    Promise.allSettled([
      fetchImageAsObjectUrl(getQrCodeImageUrl(tipUrl, 1024, { ecc: "H" })),
      logoUrl ? fetchImageAsObjectUrl(logoUrl) : Promise.resolve(null),
    ]).then(([qrResult, logoResult]) => {
      if (cancelled) return;

      if (qrResult.status === "rejected") {
        setError("Could not load the QR code image. Please try again.");
        setIsLoading(false);
        return;
      }

      loadedQrUrl = qrResult.value;
      loadedLogoUrl =
        logoResult.status === "fulfilled" ? logoResult.value : null;
      setQrObjectUrl(loadedQrUrl);
      setLogoObjectUrl(loadedLogoUrl);
      setIsLoading(false);
    });

    return () => {
      cancelled = true;
      if (loadedQrUrl) URL.revokeObjectURL(loadedQrUrl);
      if (loadedLogoUrl) URL.revokeObjectURL(loadedLogoUrl);
    };
  }, [tipUrl, logoUrl]);

  return { qrObjectUrl, logoObjectUrl, isLoading, error };
}
