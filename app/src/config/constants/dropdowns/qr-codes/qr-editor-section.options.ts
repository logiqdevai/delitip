export const QrEditorSections = {
  DETAILS: "details",
  RECIPIENTS: "recipients",
  APPEARANCE: "appearance",
  TIPPING: "tipping",
  REVIEWS: "reviews",
  PRINT: "print",
} as const;
export type QrEditorSection =
  (typeof QrEditorSections)[keyof typeof QrEditorSections];

export const QrEditorSectionOptions: {
  id: QrEditorSection;
  label: string;
  description: string;
  /** Store-wide sections apply to every QR code, not only this one. */
  storeWide: boolean;
}[] = [
  {
    id: QrEditorSections.DETAILS,
    label: "Details",
    description: "Name, status and the link behind this QR code.",
    storeWide: false,
  },
  {
    id: QrEditorSections.RECIPIENTS,
    label: "Recipients",
    description: "Who guests can tip and how the tip is split.",
    storeWide: false,
  },
  {
    id: QrEditorSections.APPEARANCE,
    label: "Appearance",
    description: "Logo, colors and messages shown on the tip page.",
    storeWide: true,
  },
  {
    id: QrEditorSections.TIPPING,
    label: "Tipping",
    description: "Suggested amounts and custom tips.",
    storeWide: true,
  },
  {
    id: QrEditorSections.REVIEWS,
    label: "Reviews",
    description: "When happy guests are sent to a public review site.",
    storeWide: true,
  },
  {
    id: QrEditorSections.PRINT,
    label: "Print card",
    description: "Design and download the printable QR card.",
    storeWide: false,
  },
];

export function getQrEditorSectionOption(id: string | null | undefined) {
  return (
    QrEditorSectionOptions.find((option) => option.id === id) ??
    QrEditorSectionOptions[0]
  );
}
