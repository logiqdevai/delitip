import type { QrCodeSelectionMode } from "@/features/qr-codes/interfaces/qr-codes.interfaces";
import { QrCodeSelectionModeFormOptions } from "@/config/constants/dropdowns/qr-codes/qr-code-selection-mode-form.options";

export const QrCodeSelectionModeFilterOptions: {
  id: QrCodeSelectionMode | "all";
  label: string;
}[] = [
  { id: "all", label: "All selection modes" },
  ...QrCodeSelectionModeFormOptions,
];
