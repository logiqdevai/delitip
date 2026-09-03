export const PayoutAccountStatuses = {
  PENDING: "PENDING",
  ACTIVE: "ACTIVE",
  RESTRICTED: "RESTRICTED",
  DISABLED: "DISABLED",
} as const;
export type PayoutAccountStatus =
  (typeof PayoutAccountStatuses)[keyof typeof PayoutAccountStatuses];

export const PayoutAccountOwnerTypes = {
  STORE: "STORE",
  USER: "USER",
} as const;
export type PayoutAccountOwnerType =
  (typeof PayoutAccountOwnerTypes)[keyof typeof PayoutAccountOwnerTypes];

export const PaymentProviders = {
  VIVA: "VIVA",
  STRIPE: "STRIPE",
  PAYPAL: "PAYPAL",
} as const;
export type PaymentProvider =
  (typeof PaymentProviders)[keyof typeof PaymentProviders];

export const PayoutMethods = {
  IBAN: "IBAN",
  CONNECTED_ACCOUNT: "CONNECTED_ACCOUNT",
} as const;
export type PayoutMethod = (typeof PayoutMethods)[keyof typeof PayoutMethods];

export interface PayoutAccount {
  id: string;
  owner_type: PayoutAccountOwnerType;
  store_id?: string | null;
  user_id?: string | null;
  provider: PaymentProvider;
  provider_account_id: string;
  status: PayoutAccountStatus;
  payout_method: PayoutMethod;
  bank_account_id?: string | null;
  iban_last4?: string | null;
  beneficiary_name?: string | null;
  connected_account_id?: string | null;
  onboarding_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreatePayoutAccountPayload {
  payout_method?: PayoutMethod;
  iban?: string;
  beneficiary_name?: string;
  friendly_name?: string;
}
