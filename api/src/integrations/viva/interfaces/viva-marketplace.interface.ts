export interface VivaAddress {
  address?: string;
  city?: string;
  zipCode?: string;
  countryCode?: string;
}

export interface VivaMarketplaceBranding {
  name?: string;
  logo?: string;
  primaryColor?: string;
}

export interface VivaPayoutsConfig {
  iban?: string;
  bankAccountId?: string;
}

export interface VivaConnectedAccountInvitation {
  url?: string;
  expirationDate?: string;
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
