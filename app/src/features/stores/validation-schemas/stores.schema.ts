import { z } from "zod";
import {
  Currencies,
  StoreIndustries,
} from "@/features/stores/interfaces/stores.interfaces";

const storeIndustryValues = Object.values(StoreIndustries) as [
  (typeof StoreIndustries)[keyof typeof StoreIndustries],
  ...(typeof StoreIndustries)[keyof typeof StoreIndustries][],
];

const currencyValues = Object.values(Currencies) as [
  (typeof Currencies)[keyof typeof Currencies],
  ...(typeof Currencies)[keyof typeof Currencies][],
];

export const businessSetupSchema = z.object({
  name: z.string().trim().min(1, "Business name is required"),
  industry: z.enum(storeIndustryValues),
  timezone: z.string().trim().min(1, "Timezone is required"),
  currency: z.enum(currencyValues),
  address_line: z.string().trim().optional(),
});

export type BusinessSetupFormData = z.infer<typeof businessSetupSchema>;

export const storeProfileFormSchema = z.object({
  name: z.string().trim().min(1, "Business name is required"),
  industry: z.enum(storeIndustryValues),
  timezone: z.string().trim().min(1, "Timezone is required"),
  currency: z.enum(currencyValues),
  address_line: z.string().trim().optional(),
  city: z.string().trim().optional(),
  country: z.string().trim().optional(),
  postal_code: z.string().trim().optional(),
});

export type StoreProfileFormData = z.infer<typeof storeProfileFormSchema>;
