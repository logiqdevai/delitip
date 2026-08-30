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

export function getQrCodeImageUrl(tipUrl: string, size = 280): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=8&data=${encodeURIComponent(tipUrl)}`;
}

export async function downloadQrCodePng(
  tipUrl: string,
  filename: string,
): Promise<void> {
  const response = await fetch(getQrCodeImageUrl(tipUrl, 512));
  if (!response.ok) {
    throw new Error("Failed to download QR image.");
  }
  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = filename.endsWith(".png") ? filename : `${filename}.png`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(objectUrl);
}

export function printQrCode(tipUrl: string, label: string): void {
  const imageUrl = getQrCodeImageUrl(tipUrl, 400);
  const popup = window.open("", "_blank", "noopener,noreferrer,width=480,height=640");
  if (!popup) {
    throw new Error("Pop-up blocked. Allow pop-ups to print the QR code.");
  }
  popup.document.write(`<!doctype html>
<html>
  <head>
    <title>${label} — QR</title>
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
