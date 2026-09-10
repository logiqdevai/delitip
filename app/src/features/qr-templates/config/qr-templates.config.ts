import type { QrTemplateMeta } from "@/features/qr-templates/interfaces/qr-templates.interfaces";

// Add a new entry here (+ a matching component wired into QR_TEMPLATE_COMPONENTS)
// to make another template available in the picker.
export const QR_TEMPLATES: QrTemplateMeta[] = [
  {
    id: "classic-card",
    name: "Classic Card",
    description:
      "A framed, single-tone 4x6in card with a serif wordmark and your QR code.",
    widthPx: 1200,
    heightPx: 1800,
  },
  {
    id: "arched-band-card",
    name: "Arched Band",
    description:
      "An arch-top 4x6in card with a Scan / Tip / Review row and a color-block footer.",
    widthPx: 1200,
    heightPx: 1800,
  },
  {
    id: "cta-band-card",
    name: "Bold CTA",
    description:
      "A 4x6in card with a bold color-block call-to-action footer.",
    widthPx: 1200,
    heightPx: 1800,
  },
];
