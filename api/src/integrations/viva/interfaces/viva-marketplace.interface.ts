export interface VivaAddress {
  address?: string;
  city?: string;
  zipCode?: string;
  countryCode?: string;
}

export interface VivaMarketplaceBranding {
  /** The name of the marketplace, shown as the header/title during onboarding. Required by Viva. */
  partnerName: string;
  /** The URL of the brand logo shown during onboarding. Required by Viva. */
  logoUrl: string;
  primaryColor?: string;
}

export interface VivaConnectedAccountBankAccount {
  iban?: string;
  friendlyName?: string;
  beneficiaryName: string;
  branchCode?: string;
  accountNumber?: string;
  countryCode?: string;
}

// To be used for sellers that wish to automatically receive their payouts to
// a 3rd-party bank account outside Viva on a defined schedule — leave empty
// for manual handling of payouts. Matches Viva's actual nested
// `mp_createaccount_request.payouts` shape (confirmed against
// api/docs/viva/viva-payment-api.yaml), not a bare {iban} pair.
export interface VivaPayoutsConfig {
  statementDescriptor?: string;
  /** Required when interval is weekly (2). 1=Sunday..7=Saturday. */
  dayOfWeek?: number;
  /** Required when interval is monthly (3). */
  dayOfMonth?: number;
  /** 1=daily, 2=weekly, 3=monthly. */
  interval?: number;
  amountThreshold?: number;
  disable?: boolean;
  bankAccount?: VivaConnectedAccountBankAccount;
}

export interface VivaConnectedAccountInvitation {
  email?: string;
  /** The invitation URL to send the seller so they can start onboarding. */
  redirectUrl?: string;
  created?: string;
}

export interface CreateConnectedAccountRequest {
  email: string;
  mobile?: string;
  legalName?: string;
  tradeName?: string;
  taxNumber?: string;
  /** The URL that the seller will be redirected to upon completing the onboarding process. */
  returnUrl: string;
  address?: VivaAddress;
  /** Branding information of the marketplace, shown during onboarding. */
  branding: VivaMarketplaceBranding;
  /** Used for sellers that wish to automatically receive their payouts to a 3rd-party bank account. */
  payouts?: VivaPayoutsConfig;
}

export interface CreateConnectedAccountResponse {
  accountId?: string;
  invitation?: VivaConnectedAccountInvitation;
}

export interface ConnectedAccount {
  accountId?: string;
  email?: string;
  payouts?: VivaPayoutsConfig;
  verified?: boolean;
  acquiringEnabled?: boolean;
  created?: string;
  invitation?: VivaConnectedAccountInvitation;
}

export interface UpdateConnectedAccountRequest {
  /** Leave empty for manual handling of payouts. */
  payouts?: VivaPayoutsConfig;
}

export interface CreateMarketplaceTransferRequest {
  amount: number;
  connectedAccountId: string;
  description?: string;
  /** The customer payment (transaction) this transfer is associated with. */
  transactionId?: string;
}

export interface ReverseTransferRequest {
  /** Amount to reverse. Omit to reverse the full amount. */
  amount?: number;
}

export interface MarketplaceTransferResponse {
  transferId?: string;
  executed?: string;
}

export interface VivaMarketplaceAutoTransfer {
  amount?: number;
  connectedAccountId?: string;
}

/** Body for `POST /checkout/v2/orders` when creating a marketplace-aware payment order. */
export interface CreateMarketplaceOrderRequest {
  amount: number;
  preauth?: boolean;
  tipAmount?: number;
  dynamicDescriptor?: string;
  disableCash?: boolean;
  tags?: string[];
  sourceCode?: string;
  disableWallet?: boolean;
  paymentTimeout?: number;
  customerTrns?: string;
  merchantTrns?: string;
  allowRecurring?: boolean;
  saleToAcquirerData?: string;
  maxInstallments?: number;
  disableExactAmount?: boolean;
  paymentNotification?: boolean;
  currencyCode?: string;
  customer?: Record<string, unknown>;
  cardTokens?: string[];
  isCardVerification?: boolean;
  /** Automatic transfer to a connected account performed upon settlement of the payment. */
  transfer?: VivaMarketplaceAutoTransfer;
  klarnaOrderOptions?: Record<string, unknown>;
}

export interface CreateMarketplaceOrderResponse {
  orderCode: number;
}

export interface CancelMarketplaceTransactionQuery {
  amount: number;
  sourceCode?: string;
  merchantTrns?: string;
  idempotencyKey?: string;
  /** Automatically return the funds from the connected account back to the platform. */
  reverseTransfers?: boolean;
  /** Automatically return the platform fee to the connected account. */
  refundPlatformFee?: boolean;
}

export interface CancelMarketplaceTransactionResponse {
  transactionId?: string;
}
