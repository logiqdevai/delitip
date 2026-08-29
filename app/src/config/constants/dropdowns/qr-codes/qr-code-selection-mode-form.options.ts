import {
  QrCodeSelectionModes,
  type QrCodeSelectionMode,
} from "@/features/qr-codes/interfaces/qr-codes.interfaces";

export const QrCodeSelectionModeFormOptions: {
  id: QrCodeSelectionMode;
  label: string;
}[] = [
  { id: QrCodeSelectionModes.CHOOSE_ONE, label: "Choose one" },
  { id: QrCodeSelectionModes.CHOOSE_MANY, label: "Choose many" },
  { id: QrCodeSelectionModes.TEAM, label: "Entire team" },
];

export function getQrCodeSelectionModeLabel(
  mode: QrCodeSelectionMode | string,
): string {
  return (
    QrCodeSelectionModeFormOptions.find((option) => option.id === mode)
      ?.label ?? mode
  );
}
