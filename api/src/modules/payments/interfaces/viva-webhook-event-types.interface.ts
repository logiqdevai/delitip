// Viva webhook EventTypeId values relevant to this integration.
// https://developer.viva.com — Settings > API Access > Webhooks
export const VivaWebhookEventTypeId = {
  TRANSACTION_PAYMENT_CREATED: 1796,
  TRANSACTION_REVERSAL_CREATED: 1797,
  TRANSACTION_FAILED: 1798,
  TRANSACTION_PRICE_CALCULATED: 1799,
  COMMAND_BANK_TRANSFER_CREATED: 768,
  COMMAND_BANK_TRANSFER_EXECUTED: 769,
} as const;

// Viva's checkout-v2 transaction statusId — 'F' (Finalized) is the only
// value that means "the customer's payment succeeded."
export const VIVA_TRANSACTION_STATUS_SUCCESS = 'F';
