import type { QrCodeSelectionMode } from "@/features/qr-codes/interfaces/qr-codes.interfaces";
import { QrCodeSelectionModeFormOptions } from "@/config/constants/dropdowns/qr-codes/qr-code-selection-mode-form.options";
import type { DropdownOptionSource } from "@/hooks/use-dropdown-options";

export const QrCodeSelectionModeFilterOptions: DropdownOptionSource<QrCodeSelectionMode>[] =
  [
    { id: "all", labelKey: "dashboard.enums.qrCodeSelectionMode.all" },
    ...QrCodeSelectionModeFormOptions,
  ];
