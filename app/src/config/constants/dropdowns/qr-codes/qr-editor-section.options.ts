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

// Labels/descriptions are message keys: t(option.labelKey), t(option.descriptionKey).
export const QrEditorSectionOptions: {
  id: QrEditorSection;
  labelKey: string;
  descriptionKey: string;
  /** Store-wide sections apply to every QR code, not only this one. */
  storeWide: boolean;
}[] = [
  {
    id: QrEditorSections.DETAILS,
    labelKey: "dashboard.enums.qrEditorSection.DETAILS",
    descriptionKey: "dashboard.enums.qrEditorSectionDescription.DETAILS",
    storeWide: false,
  },
  {
    id: QrEditorSections.RECIPIENTS,
    labelKey: "dashboard.enums.qrEditorSection.RECIPIENTS",
    descriptionKey: "dashboard.enums.qrEditorSectionDescription.RECIPIENTS",
    storeWide: false,
  },
  {
    id: QrEditorSections.APPEARANCE,
    labelKey: "dashboard.enums.qrEditorSection.APPEARANCE",
    descriptionKey: "dashboard.enums.qrEditorSectionDescription.APPEARANCE",
    storeWide: true,
  },
  {
    id: QrEditorSections.TIPPING,
    labelKey: "dashboard.enums.qrEditorSection.TIPPING",
    descriptionKey: "dashboard.enums.qrEditorSectionDescription.TIPPING",
    storeWide: true,
  },
  {
    id: QrEditorSections.REVIEWS,
    labelKey: "dashboard.enums.qrEditorSection.REVIEWS",
    descriptionKey: "dashboard.enums.qrEditorSectionDescription.REVIEWS",
    storeWide: true,
  },
  {
    id: QrEditorSections.PRINT,
    labelKey: "dashboard.enums.qrEditorSection.PRINT",
    descriptionKey: "dashboard.enums.qrEditorSectionDescription.PRINT",
    storeWide: false,
  },
];

export function getQrEditorSectionOption(id: string | null | undefined) {
  return (
    QrEditorSectionOptions.find((option) => option.id === id) ??
    QrEditorSectionOptions[0]
  );
}
