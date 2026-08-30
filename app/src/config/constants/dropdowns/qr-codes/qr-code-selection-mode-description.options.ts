import {
  QrCodeSelectionModes,
  type QrCodeSelectionMode,
} from "@/features/qr-codes/interfaces/qr-codes.interfaces";

export const QrCodeSelectionModeDescriptionOptions: {
  id: QrCodeSelectionMode;
  description: string;
}[] = [
  {
    id: QrCodeSelectionModes.CHOOSE_ONE,
    description:
      "Customer picks exactly one person from the staff assigned to this QR.",
  },
  {
    id: QrCodeSelectionModes.CHOOSE_MANY,
    description:
      "Customer can thank one or more of the assigned staff in a single tip.",
  },
  {
    id: QrCodeSelectionModes.TEAM,
    description:
      "Everyone assigned is included automatically — the customer skips picking.",
  },
];

export function getQrCodeSelectionModeDescription(
  mode: QrCodeSelectionMode | string,
): string {
  return (
    QrCodeSelectionModeDescriptionOptions.find((option) => option.id === mode)
      ?.description ?? ""
  );
}
