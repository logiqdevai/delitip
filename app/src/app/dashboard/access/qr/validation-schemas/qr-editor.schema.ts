import { z } from "zod";
import { Languages } from "@/features/stores/interfaces/stores.interfaces";
import { qrCodeFormSchema } from "@/features/qr-codes/validation-schemas/qr-codes.schema";

const languageValues = Object.values(Languages) as [
  (typeof Languages)[keyof typeof Languages],
  ...(typeof Languages)[keyof typeof Languages][],
];

const hexColor = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/, "Use a 6-digit hex color like #84cc16");

const translations = z.record(z.string(), z.string());

export const qrEditorStoreSchema = z.object({
  primary_color: hexColor,
  secondary_color: hexColor,
  welcome_message: translations,
  thank_you_message: translations,
  // Major units as typed by the user; converted to minor units on save.
  suggested_tip_amounts: z
    .array(z.string())
    .refine(
      (values) =>
        values.every((value) => {
          const trimmed = value.trim();
          if (trimmed === "") return true;
          const parsed = Number(trimmed);
          return Number.isFinite(parsed) && parsed > 0;
        }),
      "Each amount must be a positive number",
    ),
  allow_custom_tip_amount: z.boolean(),
  default_distribution_rule_id: z.string(),
  primary_language: z.enum(languageValues),
  supported_languages: z.array(z.enum(languageValues)).min(1),
  public_review_redirect_url: z
    .string()
    .trim()
    .refine((value) => {
      if (value === "") return true;
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    }, "Enter a valid URL, including https://"),
  public_review_rating_threshold: z.number().int().min(1).max(5),
});

export const qrEditorSchema = z.object({
  qr: qrCodeFormSchema,
  store: qrEditorStoreSchema,
});

export type QrEditorFormValues = z.infer<typeof qrEditorSchema>;
export type QrEditorStoreValues = z.infer<typeof qrEditorStoreSchema>;
