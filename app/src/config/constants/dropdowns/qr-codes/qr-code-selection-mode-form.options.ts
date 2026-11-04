import {
  QrCodeSelectionModes,
  type QrCodeSelectionMode,
} from "@/features/qr-codes/interfaces/qr-codes.interfaces";

export const QrCodeSelectionModeFormOptions: {
  id: QrCodeSelectionMode;
  labelKey: string;
}[] = [
  {
    id: QrCodeSelectionModes.CHOOSE_ONE,
    labelKey: "dashboard.enums.qrCodeSelectionMode.CHOOSE_ONE",
  },
  {
    id: QrCodeSelectionModes.CHOOSE_MANY,
    labelKey: "dashboard.enums.qrCodeSelectionMode.CHOOSE_MANY",
  },
  {
    id: QrCodeSelectionModes.TEAM,
    labelKey: "dashboard.enums.qrCodeSelectionMode.TEAM",
  },
];
