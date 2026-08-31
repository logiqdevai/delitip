import { Injectable } from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'crypto';
import { VivaHttpClient } from '../http/viva-http.client';
import { VivaAuthMode, VivaHost } from '../interfaces/viva-common.interface';
import {
  VivaWebhookHandshakeResponse,
  VivaWebhookVerificationKeyResponse,
} from '../interfaces/viva-webhooks.interface';

@Injectable()
export class VivaWebhooksService {
  constructor(private readonly vivaHttpClient: VivaHttpClient) {}

  // Generates the verification key that must be echoed back (as `Key`) from
  // your webhook endpoint so Viva can complete the handshake for that URL.
  async getVerificationKey(): Promise<VivaWebhookVerificationKeyResponse> {
    return this.vivaHttpClient.request<VivaWebhookVerificationKeyResponse>({
      host: VivaHost.NATIVE,
      auth: VivaAuthMode.BASIC,
      method: 'GET',
      path: '/api/messages/config/token',
    });
  }

  buildHandshakeResponse(key: string): VivaWebhookHandshakeResponse {
    return { Key: key };
  }

  // Verifies the HMAC hex digest Viva sends in the `Viva-Signature` /
  // `Viva-Signature-256` headers for Data Services webhook deliveries
  // (e.g. the File Request API's SaleTransactionsFileGenerated event).
  verifySignature(
    rawBody: string | Buffer,
    signature: string,
    secret: string,
    algorithm: 'sha1' | 'sha256' = 'sha256',
  ): boolean {
    if (!signature) return false;

    const expected = createHmac(algorithm, secret)
      .update(rawBody)
      .digest('hex');
    const expectedBuffer = Buffer.from(expected, 'hex');
    const signatureBuffer = Buffer.from(signature, 'hex');

    if (expectedBuffer.length !== signatureBuffer.length) return false;

    return timingSafeEqual(expectedBuffer, signatureBuffer);
  }
}
