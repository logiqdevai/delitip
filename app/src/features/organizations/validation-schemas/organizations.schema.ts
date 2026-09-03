import { z } from "zod";

export const taxDetailsFormSchema = z.object({
  legal_name: z.string().trim().optional(),
  vat_number: z.string().trim().optional(),
});

export type TaxDetailsFormData = z.infer<typeof taxDetailsFormSchema>;
