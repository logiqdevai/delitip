export interface VivaMt940Response {
  Response?: string;
}

export interface AddWebhookSubscriptionRequest {
  /** URL that will receive the webhook POST requests. */
  url: string;
  /**
   * Merchant-defined secret used to generate the SHA-1/SHA-256 HMAC
   * signatures Viva sends in the `Viva-Signature` / `Viva-Signature-256`
   * headers of each webhook delivery, so the sender can be verified.
   */
  secret: string;
  /** WebHook subscription events (e.g. "SaleTransactionsFileGenerated"). */
  events: string[];
}

export interface WebhookSubscriptionResponse {
  /** Id of the subscription. Store it to later update/delete it. */
  subscriptionId?: string;
}

export interface DeleteWebhookSubscriptionResponse {
  message?: string;
}

export interface WebhookSubscription {
  url?: string;
  subscriptionId?: string;
  events?: string[];
}

export interface SaleTransactionsExportRequest {
  /** Request identifier. If not provided, a new identifier is generated. */
  Id?: string;
  /** Date of the sale transaction records. */
  Date: string;
  /** File extension of the requested file (currently only "csv" is supported). */
  FileType?: string;
}

export interface SaleTransactionsExportResponse {
  requestId?: string;
}

/**
 * Payload Viva POSTs to your own webhook URL once the requested sale
 * transactions file is ready. Not an outbound call — this shape is for
 * typing whatever controller receives that delivery.
 */
export interface VivaSaleTransactionsExportWebhookPayload {
  requestId?: string;
  Text?: string;
  Link?: string;
  Authorized?: boolean;
  ExpirationDate?: string;
  FileType?: string;
}

export interface SearchTransactionsQuery {
  PageSize?: number;
  Page?: number;
  OrderBy?: 'Ascending' | 'Descending';
}

export interface SearchTransactionsRequest {
  insDateFrom?: string;
  insDateTo?: string;
  ClearanceDateFrom?: string;
  ClearanceDateTo?: string;
  TransactionTypeIds?: number[];
  StatusIds?: string[];
  TransactionIds?: string[];
  SourceTerminalId?: string;
  OrderCode?: string;
  ResellerSourceCode?: string;
  AmountFrom?: number;
  AmountTo?: number;
  CurrencyCode?: string;
  MerchantTrns?: string;
}

export interface SearchTransactionsResponse {
  currentPage?: number;
  pageSize?: number;
  data?: unknown[];
  links?: unknown[];
}
