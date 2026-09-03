// Viva webhook EventTypeId values relevant to this integration.
// https://developer.viva.com — Settings > API Access > Webhooks
export const VivaWebhookEventTypeId = {
  TRANSACTION_PAYMENT_CREATED: 1796,
  TRANSACTION_REVERSAL_CREATED: 1797,
  TRANSACTION_FAILED: 1798,
  TRANSACTION_PRICE_CALCULATED: 1799,
  COMMAND_BANK_TRANSFER_CREATED: 768,
  COMMAND_BANK_TRANSFER_EXECUTED: 769,
  // Fires when a customer cancels checkout via Smart Checkout's cancel/back
  // button (or via API) — the one case Viva's docs otherwise say produces no
  // webhook at all. EventData carries MerchantTrns/OrderCode/IsCancelled.
  ORDER_UPDATED: 4865,
  // Marketplace/connected-accounts events. UNVERIFIED — sourced from a
  // search snippet in docs/VIVA_MARKETPLACE_MIGRATION_RESEARCH.md, not
  // found in either downloaded Viva OpenAPI spec (api/docs/viva/*.yaml).
  // Confirm against the real sandbox merchant portal's webhook event-type
  // list before relying on these alone — PayoutAccountsService's
  // sweepPendingAccounts cron re-verifies connected accounts independently
  // of these IDs being correct, so promotion still works even if they're wrong.
  ACCOUNT_CONNECTED: 8193,
  ACCOUNT_VERIFICATION_STATUS_CHANGED: 8194,
  TRANSFER_CREATED: 8448,
} as const;

// Viva's checkout-v2 transaction statusId — 'F' (Finalized) is the only
// value that means "the customer's payment succeeded."
export const VIVA_TRANSACTION_STATUS_SUCCESS = 'F';
