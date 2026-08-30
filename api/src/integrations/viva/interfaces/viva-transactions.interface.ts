export type VivaTransactionStatus =
  | 'F'
  | 'A'
  | 'C'
  | 'E'
  | 'M'
  | 'R'
  | 'X'
  | 'MA'
  | 'MI'
  | 'ML'
  | 'MS'
  | 'MW';

/** Response for `GET /checkout/v2/transactions/{transactionId}`. */
export interface VivaTransaction {
  email?: string;
  bankId?: string;
  amount?: number;
  switching?: boolean;
  orderCode?: number;
  SourceCode?: string;
  statusId?: VivaTransactionStatus;
  fullName?: string;
  insDate?: string;
  cardNumber?: string;
  currencyCode?: string;
  customerTrns?: string;
  merchantTrns?: string;
  tipAmount?: number;
  transactionTypeId?: number;
  recurringSupport?: boolean;
  authorizationId?: string;
  totalInstallments?: number;
  cardCountryCode?: string;
  surchargeAmount?: number;
  cardIssuingBank?: string;
  currentInstallment?: number;
  originalAmount?: number;
  conversionRate?: number;
  cardUniqueReference?: string;
  originalCurrencyCode?: string;
  eventId?: number;
  cardExpirationDate?: string;
  cardTypeId?: number;
  primaryAccountNumberLast4Digits?: string;
  digitalWalletId?: number;
  loyaltyTransactions?: unknown[];
}

export interface CreateCardTokenRequest {
  /** The unique ID of the initial transaction. */
  transactionId?: string;
  /** The Group ID, for merchant group functionality. */
  groupId?: string;
  cardTokenType?: string;
}

export interface CreateCardTokenResponse {
  /** The token associated with the card used for the specific transaction. */
  token?: string;
}

export interface IncreasePreauthRequest {
  /** Amount to add to the original authorized amount, in the currency's smallest unit. */
  amount: number;
  customerTrns?: string;
  merchantTrns?: string;
  sourceCode?: string;
  currencyCode?: string;
  idempotencyKey?: string;
}

export interface CreateNativeTransactionRequest {
  /** Amount in the currency's smallest unit. */
  amount: number;
  installments?: number;
  customerTrns?: string;
  merchantTrns?: string;
  sourceCode?: string;
  /** Tip value (if applicable), already included in `amount`. */
  tipAmount?: number;
  currencyCode?: string;
}

export interface CancelNativeTransactionQuery {
  /** Amount to refund, in the currency's smallest unit. */
  amount: number;
  sourceCode?: string;
  merchantTrns?: string;
  customerTrns?: string;
  currencyCode?: string;
}

export interface PayoutQuery {
  /** Amount to pay out, in the currency's smallest unit. */
  amount: number;
  /** 6 for an OCT, 14 for a Pay Out. */
  serviceId: number;
  idempotencyKey: string;
  sourceCode?: number;
  merchantTrns?: string;
  customerTrns?: string;
  currencyCode?: string;
}

/** Shared response shape for native checkout create/cancel/payout transaction calls. */
export interface VivaNativeTransactionResult {
  Emv?: string;
  Amount?: number;
  StatusId?: string;
  CurrencyCode?: string;
  TransactionId?: string;
  ReferenceNumber?: number;
  AuthorizationId?: string;
  /** Wire field is literally named "Retrieval Reference Number" (with a space) in Viva's schema. */
  retrievalReferenceNumber?: string;
  ThreeDSecureStatusId?: number;
  ErrorCode?: number;
  ErrorText?: string;
  TimeStamp?: string;
  CorrelationId?: string;
  EventId?: number;
  Success?: boolean;
}

export interface CancelPartialAuthQuery {
  /** Amount to cancel, in the currency's smallest unit. */
  amount: number;
  sourceCode?: string;
  merchantTrns?: string;
  idempotencyKey?: string;
}

export interface RebateOrFastRefundRequest {
  /** Amount the merchant wishes to give back to the client. */
  amount: number;
  /** Defaults to "Default" when not provided. */
  sourceCode?: string;
  merchantTrns?: string;
  idempotencyKey?: string;
}

export interface CancelRebateOrFastRefundQuery {
  /** Amount to cancel; must equal the original rebate/fast refund amount. */
  amount: number;
  sourceCode?: string;
  merchantTrns?: string;
  currencyCode?: string;
  idempotencyKey?: string;
}
