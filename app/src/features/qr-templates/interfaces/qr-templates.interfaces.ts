import type { Store } from "@/features/stores/interfaces/stores.interfaces";

export type QrTemplateId =
  | "classic-card"
  | "arched-band-card"
  | "cta-band-card";

export interface QrTemplateMeta {
  id: QrTemplateId;
  name: string;
  description: string;
  /** Export raster dimensions (4x6in @300dpi). */
  widthPx: number;
  heightPx: number;
}

export interface QrTemplateRenderProps {
  store: Store;
  qrLabel: string;
  /** `blob:` object URL — never point templates directly at a remote QR/logo URL, see qr-tip-url.utils.ts. */
  qrObjectUrl: string;
  logoObjectUrl?: string | null;
}
