import { z } from "zod";
import { QrCodeSelectionModes } from "@/features/qr-codes/interfaces/qr-codes.interfaces";

const selectionModeValues = Object.values(QrCodeSelectionModes) as [
  (typeof QrCodeSelectionModes)[keyof typeof QrCodeSelectionModes],
  ...(typeof QrCodeSelectionModes)[keyof typeof QrCodeSelectionModes][],
];

export const qrCodeFormSchema = z.object({
  label: z.string().trim().min(1, "Label is required"),
  selection_mode: z.enum(selectionModeValues),
  employee_ids: z.array(z.string()),
  spot_ids: z.array(z.string()),
  distribution_rule_id: z.string().optional(),
  is_active: z.boolean(),
});

export type QrCodeFormData = z.infer<typeof qrCodeFormSchema>;
