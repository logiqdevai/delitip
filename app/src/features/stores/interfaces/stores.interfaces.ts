import type { ParsedAddress } from "@/components/ui/address-autocomplete";

export const StoreIndustries = {
  RESTAURANT: "RESTAURANT",
  CAFE: "CAFE",
  BAR: "BAR",
  HOTEL: "HOTEL",
  SALON: "SALON",
  SPA: "SPA",
  RETAIL: "RETAIL",
  BARBERSHOP: "BARBERSHOP",
  FITNESS: "FITNESS",
  FOOD_TRUCK: "FOOD_TRUCK",
  CLEANING: "CLEANING",
  OTHER: "OTHER",
} as const;
export type StoreIndustry =
  (typeof StoreIndustries)[keyof typeof StoreIndustries];

export const Languages = {
  EN: "EN",
  EL: "EL",
  ES: "ES",
  FR: "FR",
  DE: "DE",
  IT: "IT",
  PT: "PT",
  TR: "TR",
  RU: "RU",
  AR: "AR",
  ZH: "ZH",
} as const;
export type Language = (typeof Languages)[keyof typeof Languages];

export const StoreTranslatableFields = {
  WELCOME_MESSAGE: "welcome_message",
  THANK_YOU_MESSAGE: "thank_you_message",
} as const;
export type StoreTranslatableField =
  (typeof StoreTranslatableFields)[keyof typeof StoreTranslatableFields];

export interface UpdateStoreTranslationPayload {
  language: Language;
  text: string;
}

export const Currencies = {
  EUR: "EUR",
  USD: "USD",
  GBP: "GBP",
  TRY: "TRY",
  RUB: "RUB",
  AED: "AED",
  CNY: "CNY",
} as const;
export type Currency = (typeof Currencies)[keyof typeof Currencies];

export interface StoreDocumentRef {
  id: string;
  url: string;
}

export interface Store {
  id: string;
  organization_id: string;
  name: string;
  slug: string;
  industry: StoreIndustry;
  is_active: boolean;
  logo_document_id?: string | null;
  cover_document_id?: string | null;
  logo_document?: StoreDocumentRef | null;
  cover_document?: StoreDocumentRef | null;
  primary_color?: string | null;
  secondary_color?: string | null;
  welcome_message?: Record<string, string> | null;
  thank_you_message?: Record<string, string> | null;
  address_line?: string | null;
  city?: string | null;
  country?: string | null;
  postal_code?: string | null;
  full_address?: ParsedAddress | null;
  timezone: string;
  primary_language: Language;
  supported_languages: Language[];
  currency: Currency;
  suggested_tip_amounts: number[];
  allow_custom_tip_amount: boolean;
  public_review_redirect_url?: string | null;
  public_review_rating_threshold?: number | null;
  default_distribution_rule_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateStorePayload {
  name: string;
  industry: StoreIndustry;
  primary_language?: Language;
  supported_languages?: Language[];
  currency?: Currency;
  timezone?: string;
  address_line?: string;
  city?: string;
  country?: string;
  postal_code?: string;
  full_address?: ParsedAddress;
}

export interface UpdateStorePayload {
  name?: string;
  industry?: StoreIndustry;
  is_active?: boolean;
  logo_document_id?: string | null;
  cover_document_id?: string | null;
  primary_color?: string;
  secondary_color?: string;
  suggested_tip_amounts?: number[];
  allow_custom_tip_amount?: boolean;
  public_review_redirect_url?: string;
  public_review_rating_threshold?: number;
  default_distribution_rule_id?: string;
  welcome_message?: string;
  thank_you_message?: string;
  primary_language?: Language;
  supported_languages?: Language[];
  currency?: Currency;
  timezone?: string;
  address_line?: string;
  city?: string;
  country?: string;
  postal_code?: string;
  full_address?: ParsedAddress;
}

export interface PublicStore {
  id: string;
  name: string;
  slug: string;
  industry: StoreIndustry;
  logo_url?: string | null;
  cover_url?: string | null;
  primary_color?: string | null;
  secondary_color?: string | null;
  welcome_message?: string | null;
  thank_you_message?: string | null;
  address_line?: string | null;
  city?: string | null;
  country?: string | null;
  postal_code?: string | null;
  currency: Currency;
  suggested_tip_amounts: number[];
  allow_custom_tip_amount: boolean;
  primary_language: Language;
  supported_languages: Language[];
  public_review_rating_threshold?: number | null;
}
