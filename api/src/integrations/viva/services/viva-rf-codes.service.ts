import { Injectable } from '@nestjs/common';
import { VivaHttpClient } from '../http/viva-http.client';
import { VivaAuthMode, VivaHost } from '../interfaces/viva-common.interface';
import { GenerateRfCodeRequest } from '../interfaces/viva-rf-codes.interface';

// RF codes let a Greek merchant's customer pay a payment order via bank
// transfer using a standard Reference Number. Generation requires no
// authentication.
@Injectable()
export class VivaRfCodesService {
  constructor(private readonly vivaHttpClient: VivaHttpClient) {}

  async generateRfCode(payload: GenerateRfCodeRequest): Promise<void> {
    await this.vivaHttpClient.request<void>({
      host: VivaHost.NATIVE,
      auth: VivaAuthMode.NONE,
      method: 'POST',
      path: '/web2/checkout/v2/paymentsessions',
      data: payload,
    });
  }
}
