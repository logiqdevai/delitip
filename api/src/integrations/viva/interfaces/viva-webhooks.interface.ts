// Viva's actual response is capitalized `Key` (confirmed against
// developer.viva.com's own example payload: `{"Key": "B3248222..."}`) —
// do not lowercase this, a prior version of this interface did and silently
// broke the handshake (buildHandshakeResponse received `undefined`, which
// JSON.stringify drops, so the endpoint returned `{}` instead of the key).
export interface VivaWebhookVerificationKeyResponse {
  Key: string;
}

/**
 * Shape your own webhook endpoint must respond with (note the capitalized
 * `Key`) so Viva can complete the webhook handshake for that URL.
 */
export interface VivaWebhookHandshakeResponse {
  Key: string;
}

/**
 * Headers Viva attaches to a Data Services webhook delivery (e.g. the File
 * Request API's SaleTransactionsFileGenerated event). Signatures are HMAC hex
 * digests of the raw request body, keyed with the subscription's secret.
 */
export interface VivaWebhookHeaders {
  'viva-signature'?: string;
  'viva-signature-256'?: string;
  'viva-delivery-id'?: string;
  'viva-event'?: string;
}

export interface VivaFileRequestWebhookPayload {
  requestId?: string;
  Text?: string;
  Link?: string;
  Authorized?: boolean;
  ExpirationDate?: string;
  FileType?: string;
}
