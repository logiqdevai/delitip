import {
  QrCodeSelectionModes,
  type QrCodeSelectionMode,
} from "@/features/qr-codes/interfaces/qr-codes.interfaces";

export const QrCodeSelectionModeDescriptionOptions: {
  id: QrCodeSelectionMode;
  descriptionKey: string;
}[] = [
  {
    id: QrCodeSelectionModes.CHOOSE_ONE,
    descriptionKey: "dashboard.enums.qrCodeSelectionModeDescription.CHOOSE_ONE",
  },
  {
    id: QrCodeSelectionModes.CHOOSE_MANY,
    descriptionKey:
      "dashboard.enums.qrCodeSelectionModeDescription.CHOOSE_MANY",
  },
  {
    id: QrCodeSelectionModes.TEAM,
    descriptionKey: "dashboard.enums.qrCodeSelectionModeDescription.TEAM",
  },
];
