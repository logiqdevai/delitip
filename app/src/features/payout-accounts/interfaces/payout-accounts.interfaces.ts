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

export interface PayoutAccount {
  id: string;
  owner_type: PayoutAccountOwnerType;
  store_id?: string | null;
  user_id?: string | null;
  provider: PaymentProvider;
  provider_account_id: string;
  status: PayoutAccountStatus;
  created_at: string;
  updated_at: string;
}

export interface CreatePayoutAccountPayload {
  provider?: PaymentProvider;
}
