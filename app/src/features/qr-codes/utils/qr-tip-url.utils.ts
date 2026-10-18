import { environments } from "@/config/environments";
import { Routes } from "@/routes/routes";

export function getTipPath(storeSlug: string, code: string): string {
  return Routes.tip(storeSlug, code);
}

export function getAbsoluteTipUrl(storeSlug: string, code: string): string {
  const path = getTipPath(storeSlug, code);
  const base = environments.siteUrl.replace(/\/$/, "");
  return `${base}${path}`;
}

export type QrCodeErrorCorrection = "L" | "M" | "Q" | "H";

/** Renders the QR code client-side as a PNG data URL (no network call). */
export async function renderQrDataUrl(
  tipUrl: string,
  size = 280,
  options?: { ecc?: QrCodeErrorCorrection },
): Promise<string> {
  const { default: QRCode } = await import("qrcode");
  return QRCode.toDataURL(tipUrl, {
    width: size,
    margin: 2,
    errorCorrectionLevel: options?.ecc ?? "M",
  });
}

/** Fetches an image as a `blob:` object URL so it can be safely composited (e.g. via canvas) without cross-origin taint. Caller must revoke the URL when done. */
export async function fetchImageAsObjectUrl(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to load image.");
  }
  const blob = await response.blob();
  return URL.createObjectURL(blob);
}

export async function downloadQrCodePng(
  tipUrl: string,
  filename: string,
): Promise<void> {
  const objectUrl = await renderQrDataUrl(tipUrl, 512);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = filename.endsWith(".png") ? filename : `${filename}.png`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

export async function printQrCode(tipUrl: string, label: string): Promise<void> {
  // Open synchronously so the pop-up keeps the click's user activation.
  const popup = window.open("", "_blank", "width=480,height=640");
  if (!popup) {
    throw new Error("Pop-up blocked. Allow pop-ups to print the QR code.");
  }
  const imageUrl = await renderQrDataUrl(tipUrl, 400);
  popup.document.write(`<!doctype html>
<html>
  <head>
    <title>${label} - QR</title>
    <style>
      body { font-family: system-ui, sans-serif; text-align: center; padding: 24px; color: #18181b; }
      img { width: 280px; height: 280px; }
      h1 { font-size: 18px; margin: 0 0 8px; }
      p { font-size: 12px; color: #71717a; word-break: break-all; }
    </style>
  </head>
  <body>
    <h1>${label.replaceAll("<", "&lt;")}</h1>
    <img src="${imageUrl}" alt="QR code" />
    <p>${tipUrl.replaceAll("<", "&lt;")}</p>
    <script>window.onload = () => { window.print(); };</script>
  </body>
</html>`);
  popup.document.close();
}
