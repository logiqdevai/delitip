export interface VivaCustomerInfo {
  email?: string;
  fullName?: string;
  phone?: string;
  countryCode?: string;
  requestLang?: string;
}

export interface VivaPaymentMethodFee {
  paymentMethodId?: number;
  fee?: number;
}

/** Body for `POST /checkout/v2/orders` — creates a Smart Checkout (v2) payment order. */
export interface CreatePaymentOrderRequest {
  /** Positive, non-zero amount in the currency's smallest unit. */
  amount: number;
  customerTrns?: string;
  customer?: VivaCustomerInfo;
  dynamicDescriptor?: string;
  /** Seconds given to the customer to complete the payment. */
  paymentTimeout?: number;
  /** Numeric ISO 4217 currency code. */
  currencyCode?: string;
  /** Holds the amount unavailable without charging the customer (pre-authorization). */
  preauth?: boolean;
  disableSurcharge?: boolean;
  allowRecurring?: boolean;
  /** JSON metadata converted to a base64 string. */
  saleToAcquirerData?: string;
  maxInstallments?: number;
  forceMaxInstallments?: boolean;
  /** Sends the customer an email requesting payment. */
  paymentNotification?: boolean;
  /** Tip amount already included in `amount`. */
  tipAmount?: number;
  disableExactAmount?: boolean;
  disableCash?: boolean;
  disableWallet?: boolean;
  /** Code of the payment source this order is associated with. */
  sourceCode?: string;
  /** Merchant-defined identifier or short description for the transaction. */
  merchantTrns?: string;
  tags?: string[];
  /** Saved card tokens the customer can pay with. */
  cardTokens?: string[];
  paymentMethodFees?: VivaPaymentMethodFee[];
  isCardVerification?: boolean;
  klarnaOrderOptions?: Record<string, unknown>;
}

export interface CreatePaymentOrderResponse {
  orderCode: number;
}

// Numeric on the wire (Viva returns `"StateId":3` as a JSON number, not a
// string) — a string-valued enum here silently never matches via `===`.
export const VivaOrderState = {
  PENDING: 0,
  EXPIRED: 1,
  CANCELED: 2,
  PAID: 3,
} as const;

export type VivaOrderState =
  (typeof VivaOrderState)[keyof typeof VivaOrderState];

/** Response for `GET /api/orders/{orderCode}`. */
export interface VivaOrder {
  OrderCode?: number;
  SourceCode?: string;
  Tags?: string[];
  TipAmount?: number;
  RequestLang?: string;
  MerchantTrns?: string;
  CustomerTrns?: string;
  MaxInstallments?: number;
  RequestAmount?: number;
  ExpirationDate?: string;
  StateId?: VivaOrderState;
}

export interface CancelOrderResponse {
  OrderCode?: number;
  ErrorCode?: number;
  ErrorText?: string;
  TimeStamp?: string;
  CorrelationId?: string;
  EventId?: number;
  Success?: boolean;
}

export interface UpdateOrderRequest {
  /** New order amount, in the currency's smallest unit. */
  amount?: number;
  /** Allows the order to accept multiple payments when `true`. */
  disablePaidState?: boolean;
  expirationDate?: string;
  isCanceled?: boolean;
}

/** Response for `GET /api/fees/{orderCode}/{amount}`. */
export interface VivaOrderFees {
  Fee?: number;
  BillFee?: number;
  ServiceFee?: number;
  ResellerFee?: number;
  CollectionFee?: number;
  TotalConversionFee?: number;
  ErrorCode?: number;
  ErrorText?: string | null;
  TimeStamp?: string;
  CorrelationId?: string | null;
  EventId?: number;
  Success?: boolean;
}
