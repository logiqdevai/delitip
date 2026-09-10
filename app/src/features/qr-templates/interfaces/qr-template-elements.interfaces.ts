export type TemplateFontFamily = "sans" | "serif";
export type TemplateTextAlign = "left" | "center" | "right";
export type TemplateFontWeight = 500 | 600 | 700 | 800;

interface TemplateElementBase {
  /** Stable per-template slug, e.g. "storeName", "headline" - not user-facing. */
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TemplateTextElement extends TemplateElementBase {
  kind: "text";
  content: string;
  fontFamily: TemplateFontFamily;
  fontSize: number;
  fontWeight: TemplateFontWeight;
  color: string;
  align: TemplateTextAlign;
  letterSpacing: number;
  uppercase: boolean;
  /** Caps the number of visible lines (CSS line-clamp), like the old line-clamp-N classes. */
  lineClamp?: number;
}

export interface TemplateImageElement extends TemplateElementBase {
  kind: "image";
  /** Only the store logo is bindable in v1 - not a user-uploadable arbitrary image. */
  binding: "logo";
  shape: "circle" | "square";
  /** White backing plate behind a real logo image (logos vary in shape/transparency). */
  backdrop: boolean;
  /** Color used for the industry-icon fallback when the store has no logo. */
  iconColor: string;
}

export interface TemplateQrElement extends TemplateElementBase {
  kind: "qr";
  /** The small decorative "D" badge overlaid on the QR's center. */
  showBadge: boolean;
}

export interface TemplateIconRowElement extends TemplateElementBase {
  kind: "iconRow";
  variant: "scan-tip-review";
  color: string;
  labelFontSize: number;
}

export interface TemplateBandElement extends TemplateElementBase {
  kind: "band";
  color: string;
  borderRadius?: {
    topLeft: number;
    topRight: number;
    bottomLeft: number;
    bottomRight: number;
  };
}

export type TemplateElement =
  | TemplateTextElement
  | TemplateImageElement
  | TemplateQrElement
  | TemplateIconRowElement
  | TemplateBandElement;

// NOT `Partial<TemplateElement>` - `keyof` a union only yields the keys
// common to every member, so `Partial<TemplateElement>` would silently drop
// kind-specific fields like `content` or `fontSize`. This distributes
// Partial over each member instead, so a patch can carry any single kind's
// fields (e.g. `{ content: "..." }`) and still type-check.
export type TemplateElementPatch =
  | Partial<TemplateTextElement>
  | Partial<TemplateImageElement>
  | Partial<TemplateQrElement>
  | Partial<TemplateIconRowElement>
  | Partial<TemplateBandElement>;

export interface TemplateCanvasConfig {
  backgroundColor: string;
}

export interface TemplateStructuralShape {
  /** A thin inset bordered frame (the "Classic Card" look), or none. */
  frame?: { inset: number; borderRadius: number };
  borderTopLeftRadius?: number;
  borderTopRightRadius?: number;
}
