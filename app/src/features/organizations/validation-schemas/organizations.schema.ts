import { z } from "zod";
import { parsedAddressSchema } from "@/features/stores/validation-schemas/stores.schema";

export const taxDetailsFormSchema = z.object({
  legal_name: z.string().trim().optional(),
  vat_number: z.string().trim().optional(),
  profession: z.string().trim().optional(),
  doy: z.string().trim().optional(),
  address_line: z.string().trim().optional(),
  city: z.string().trim().optional(),
  country: z.string().trim().optional(),
  postal_code: z.string().trim().optional(),
  full_address: parsedAddressSchema.optional(),
});

export type TaxDetailsFormData = z.infer<typeof taxDetailsFormSchema>;
