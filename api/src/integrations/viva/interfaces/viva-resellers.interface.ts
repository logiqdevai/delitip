export interface ValidateCashPaymentRequest {
  phone?: string;
  amount?: number;
  orderCode?: number;
  /** A unique 20-digit code that allows a payment by bank deposit without knowing the order code. */
  rfPaymentCode?: string;
  countryCode?: string;
}

export interface ValidateBillPaymentRequest {
  phone?: string;
  amount?: number;
  countryCode?: string;
}

export interface CreateCashPaymentRequest {
  phone?: string;
  amount?: number;
  orderCode?: number;
  merchantId?: string;
  rfPaymentCode?: string;
  countryCode?: string;
  oneTimePassword?: string;
  resellerSourceCode?: string;
  /** Mandatory only when the eligibility check responded with eventId 109101. */
  tags?: string[];
}

export interface CashPaymentResponse {
  email?: string;
  amount?: number;
  merchantId?: string;
  orderCode?: number;
  onTopFee?: number;
  totalFee?: number;
  tags?: string[];
  companyName?: string;
  transactionId?: string;
  serviceFee?: number;
  channelName?: string;
  currencyCode?: string;
  currencyName?: string;
  resellerFee?: number;
  collectionFee?: number;
  clearanceDate?: string;
  amountWithoutFee?: number;
  resellerSourceName?: string;
  merchantReceiptUrl?: string;
  totalConversionFee?: number;
  resellerSourceAddress?: string;
}

export interface CreateBillPaymentRequest {
  vat?: string;
  amount?: number;
  phone?: string;
  date?: string;
  lastName?: string;
  orderCode?: number;
  firstName?: string;
  /** Mandatory only when the eligibility check responded with eventId 109101. */
  tags?: string[];
  countryCode?: string;
  merchantTrns?: string;
  oneTimePassword?: string;
  billId?: number;
  resellerSourceCode?: string;
}

export interface BillPaymentResponse {
  email?: string;
  amount?: number;
  orderCode?: number;
  billFee?: number;
  onTopFee?: number;
  totalFee?: number;
  tags?: string[];
  sourceCode?: string;
  serviceFee?: number;
  companyName?: string;
  channelName?: string;
  transactionId?: string;
  currencyCode?: string;
  currencyName?: string;
  resellerFee?: number;
  collectionFee?: number;
  clearanceDate?: string;
  amountWithoutFee?: number;
  resellerSourceName?: string;
  merchantReceiptUrl?: string;
  totalConversionFee?: number;
  resellerSourceAddress?: string;
}

export interface CreateResellerOrderRequest {
  amount?: number;
  email?: string;
  phone?: string;
  /** Used only when creating an order for a wallet top-up. */
  productId?: string;
  fullName?: string;
  merchantId?: string;
  countryCode?: string;
  /** Two-letter ISO 639-1 language code the payment form is displayed in. */
  requestLang?: string;
  currencyCode?: string;
  merchantTrns?: string;
  customerTrns?: string;
  /** Destination wallet ID for a wallet top-up order. */
  targetWalletId?: number;
  disableExactAmount?: boolean;
  resellerSourceCode?: string;
}

export interface CreateResellerOrderResponse {
  orderCode?: number;
  rfPaymentCode?: string;
}
