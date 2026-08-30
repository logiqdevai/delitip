import { Injectable } from '@nestjs/common';
import { VivaHttpClient } from '../http/viva-http.client';
import { VivaAuthMode, VivaHost } from '../interfaces/viva-common.interface';
import { CreateVivaSourceRequest } from '../interfaces/viva-sources.interface';

// A "source" identifies where a payment originates from (an e-commerce site
// or a card-present terminal) and is referenced by `sourceCode` when creating
// payment orders.
@Injectable()
export class VivaSourcesService {
  constructor(private readonly vivaHttpClient: VivaHttpClient) {}

  async createSource(payload: CreateVivaSourceRequest): Promise<void> {
    await this.vivaHttpClient.request<void>({
      host: VivaHost.NATIVE,
      auth: VivaAuthMode.BASIC,
      method: 'POST',
      path: '/api/sources',
      data: payload,
    });
  }
}
