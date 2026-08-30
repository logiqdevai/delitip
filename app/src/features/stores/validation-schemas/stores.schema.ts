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

const parsedAddressSchema = z.object({
  placeId: z.string(),
  formattedAddress: z.string(),
  streetAddress: z.string().optional(),
  subpremise: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  stateCode: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  countryCode: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

export const businessSetupSchema = z.object({
  name: z.string().trim().min(1, "Business name is required"),
  industry: z.enum(storeIndustryValues),
  timezone: z.string().trim().min(1, "Timezone is required"),
  currency: z.enum(currencyValues),
  address_line: z.string().trim().optional(),
  city: z.string().trim().optional(),
  country: z.string().trim().optional(),
  postal_code: z.string().trim().optional(),
  full_address: parsedAddressSchema.optional(),
});

export type BusinessSetupFormData = z.infer<typeof businessSetupSchema>;

export const storeProfileFormSchema = z.object({
  name: z.string().trim().min(1, "Business name is required"),
  industry: z.enum(storeIndustryValues),
  address_line: z.string().trim().optional(),
  city: z.string().trim().optional(),
  country: z.string().trim().optional(),
  postal_code: z.string().trim().optional(),
  full_address: parsedAddressSchema.optional(),
});

export type StoreProfileFormData = z.infer<typeof storeProfileFormSchema>;
