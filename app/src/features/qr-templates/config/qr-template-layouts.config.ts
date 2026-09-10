import { getStoreIndustryLabel } from "@/config/constants/dropdowns/stores/store-industry-form.options";
import {
  getCardPalette,
  resolveHeadline,
  type CardPalette,
} from "@/features/qr-templates/utils/qr-template-content.utils";
import type { QrTemplateId } from "@/features/qr-templates/interfaces/qr-templates.interfaces";
import type {
  TemplateCanvasConfig,
  TemplateElement,
  TemplateStructuralShape,
} from "@/features/qr-templates/interfaces/qr-template-elements.interfaces";
import type { Store } from "@/features/stores/interfaces/stores.interfaces";

// Content roles resolve to real store data (or a fixed literal) the first time
// a template is used. Once a store saves a customization, these roles no
// longer matter - the saved elements are a frozen, literal snapshot (see
// use-qr-template-customization.ts). This file is only ever consulted to seed
// that first-time default, never on every render.
type TextRole =
  | "storeName"
  | "industryLabel"
  | "headline"
  | "scanTipReviewCaption"
  | "footerWordmark"
  | "tagline"
  | "scanCta";

type ColorToken = keyof CardPalette;

const CONTENT_BY_ROLE: Record<TextRole, (store: Store) => string> = {
  storeName: (store) => store.name,
  industryLabel: (store) => getStoreIndustryLabel(store.industry),
  headline: (store) => resolveHeadline(store),
  scanTipReviewCaption: () => "Scan · Tip · Review",
  footerWordmark: () => "DelyTip",
  tagline: () => "Tip your favorite team member.",
  scanCta: () => "Scan to begin",
};

interface LayoutBase {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface TextLayout extends LayoutBase {
  kind: "text";
  role: TextRole;
  fontFamily: "sans" | "serif";
  fontSize: number;
  fontWeight: 500 | 600 | 700 | 800;
  align: "left" | "center" | "right";
  letterSpacing: number;
  uppercase: boolean;
  lineClamp?: number;
  colorToken: ColorToken;
}

interface ImageLayout extends LayoutBase {
  kind: "image";
  shape: "circle" | "square";
  backdrop: boolean;
  colorToken: ColorToken;
}

interface QrLayout extends LayoutBase {
  kind: "qr";
  showBadge: boolean;
}

interface IconRowLayout extends LayoutBase {
  kind: "iconRow";
  labelFontSize: number;
  colorToken: ColorToken;
}

interface BandLayout extends LayoutBase {
  kind: "band";
  colorToken: ColorToken;
}

type ElementLayout = TextLayout | ImageLayout | QrLayout | IconRowLayout | BandLayout;

// Coordinates are best-effort derivations from each shipped template's
// Tailwind spacing scale (the fixed-layout components they replace), not
// pixel-exact - see app/dashboard/access/components/qr-templates/template-canvas.tsx
// for the renderer these are fed into.
const TEMPLATE_LAYOUTS: Record<QrTemplateId, ElementLayout[]> = {
  "classic-card": [
    { kind: "image", id: "brandMark", x: 128, y: 42, width: 44, height: 44, shape: "circle", backdrop: true, colorToken: "primary" },
    { kind: "text", id: "storeName", role: "storeName", x: 38, y: 98, width: 224, height: 26, fontFamily: "serif", fontSize: 21, fontWeight: 700, align: "center", letterSpacing: 2, uppercase: true, colorToken: "primary" },
    { kind: "text", id: "industryLabel", role: "industryLabel", x: 38, y: 130, width: 224, height: 14, fontFamily: "sans", fontSize: 9, fontWeight: 600, align: "center", letterSpacing: 2.7, uppercase: true, colorToken: "onSecondary" },
    { kind: "text", id: "headline", role: "headline", x: 45, y: 168, width: 210, height: 50, fontFamily: "serif", fontSize: 16, fontWeight: 600, align: "center", letterSpacing: 0, uppercase: false, lineClamp: 2, colorToken: "onSecondary" },
    { kind: "qr", id: "qr", x: 84, y: 226, width: 132, height: 132, showBadge: true },
    { kind: "text", id: "scanTipReviewCaption", role: "scanTipReviewCaption", x: 38, y: 370, width: 224, height: 14, fontFamily: "sans", fontSize: 10, fontWeight: 500, align: "center", letterSpacing: 0.5, uppercase: false, colorToken: "onSecondary" },
    { kind: "text", id: "footerWordmark", role: "footerWordmark", x: 38, y: 400, width: 224, height: 16, fontFamily: "sans", fontSize: 11, fontWeight: 700, align: "center", letterSpacing: 2.75, uppercase: true, colorToken: "primary" },
  ],
  "arched-band-card": [
    { kind: "image", id: "brandMark", x: 128, y: 36, width: 44, height: 44, shape: "circle", backdrop: true, colorToken: "primary" },
    { kind: "text", id: "storeName", role: "storeName", x: 28, y: 92, width: 244, height: 24, fontFamily: "serif", fontSize: 20, fontWeight: 700, align: "center", letterSpacing: 1.6, uppercase: true, colorToken: "primary" },
    { kind: "text", id: "industryLabel", role: "industryLabel", x: 28, y: 120, width: 244, height: 13, fontFamily: "sans", fontSize: 9, fontWeight: 600, align: "center", letterSpacing: 2.7, uppercase: true, colorToken: "onSecondary" },
    { kind: "text", id: "headline", role: "headline", x: 47, y: 153, width: 205, height: 42, fontFamily: "serif", fontSize: 15, fontWeight: 600, align: "center", letterSpacing: 0, uppercase: false, lineClamp: 2, colorToken: "onSecondary" },
    { kind: "iconRow", id: "scanTipReview", x: 70, y: 215, width: 160, height: 32, labelFontSize: 9, colorToken: "primary" },
    { kind: "qr", id: "qr", x: 92, y: 267, width: 116, height: 116, showBadge: true },
    { kind: "band", id: "footerBand", x: 28, y: 402, width: 244, height: 48, colorToken: "primary" },
    { kind: "text", id: "footerWordmark", role: "footerWordmark", x: 28, y: 418, width: 244, height: 16, fontFamily: "sans", fontSize: 11, fontWeight: 700, align: "center", letterSpacing: 2.75, uppercase: true, colorToken: "onPrimary" },
  ],
  "cta-band-card": [
    { kind: "image", id: "brandMark", x: 128, y: 36, width: 44, height: 44, shape: "circle", backdrop: true, colorToken: "primary" },
    { kind: "text", id: "storeName", role: "storeName", x: 28, y: 92, width: 244, height: 23, fontFamily: "serif", fontSize: 19, fontWeight: 700, align: "center", letterSpacing: 1.5, uppercase: true, colorToken: "primary" },
    { kind: "text", id: "headline", role: "headline", x: 43, y: 131, width: 215, height: 54, fontFamily: "serif", fontSize: 18, fontWeight: 700, align: "center", letterSpacing: 0, uppercase: false, lineClamp: 2, colorToken: "onSecondary" },
    { kind: "text", id: "tagline", role: "tagline", x: 28, y: 193, width: 244, height: 14, fontFamily: "sans", fontSize: 11, fontWeight: 500, align: "center", letterSpacing: 0, uppercase: false, colorToken: "primary" },
    { kind: "qr", id: "qr", x: 84, y: 231, width: 132, height: 132, showBadge: true },
    { kind: "band", id: "footerBand", x: 28, y: 384, width: 244, height: 66, colorToken: "primary" },
    { kind: "text", id: "scanCta", role: "scanCta", x: 28, y: 400, width: 244, height: 14, fontFamily: "sans", fontSize: 11, fontWeight: 600, align: "center", letterSpacing: 0, uppercase: false, colorToken: "onPrimary" },
    { kind: "text", id: "footerWordmark", role: "footerWordmark", x: 28, y: 418, width: 244, height: 16, fontFamily: "sans", fontSize: 13, fontWeight: 700, align: "center", letterSpacing: 3.25, uppercase: true, colorToken: "onPrimary" },
  ],
};

export const TEMPLATE_STRUCTURAL_SHAPE: Record<QrTemplateId, TemplateStructuralShape> = {
  "classic-card": { frame: { inset: 14, borderRadius: 10 } },
  "arched-band-card": { borderTopLeftRadius: 130, borderTopRightRadius: 130 },
  "cta-band-card": {},
};

export function buildDefaultCanvas(store: Store): TemplateCanvasConfig {
  return { backgroundColor: getCardPalette(store).secondary };
}

export function buildDefaultElements(templateId: QrTemplateId, store: Store): TemplateElement[] {
  const palette = getCardPalette(store);

  return TEMPLATE_LAYOUTS[templateId].map((layout): TemplateElement => {
    const base = { id: layout.id, x: layout.x, y: layout.y, width: layout.width, height: layout.height };

    switch (layout.kind) {
      case "text":
        return {
          ...base,
          kind: "text",
          content: CONTENT_BY_ROLE[layout.role](store),
          fontFamily: layout.fontFamily,
          fontSize: layout.fontSize,
          fontWeight: layout.fontWeight,
          color: palette[layout.colorToken],
          align: layout.align,
          letterSpacing: layout.letterSpacing,
          uppercase: layout.uppercase,
          lineClamp: layout.lineClamp,
        };
      case "image":
        return {
          ...base,
          kind: "image",
          binding: "logo",
          shape: layout.shape,
          backdrop: layout.backdrop,
          iconColor: palette[layout.colorToken],
        };
      case "qr":
        return { ...base, kind: "qr", showBadge: layout.showBadge };
      case "iconRow":
        return {
          ...base,
          kind: "iconRow",
          variant: "scan-tip-review",
          color: palette[layout.colorToken],
          labelFontSize: layout.labelFontSize,
        };
      case "band":
        return { ...base, kind: "band", color: palette[layout.colorToken] };
    }
  });
}
