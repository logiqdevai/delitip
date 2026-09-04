import { Test, TestingModule } from '@nestjs/testing';
import { VivaIntegrationModule } from './viva.module';
import { VivaConfig } from './viva.config';
import { VivaHttpClient } from './http/viva-http.client';
import { VivaAuthService } from './services/viva-auth.service';
import { VivaCheckoutService } from './services/viva-checkout.service';
import { VivaTransactionsService } from './services/viva-transactions.service';
import { VivaRfCodesService } from './services/viva-rf-codes.service';
import { VivaSourcesService } from './services/viva-sources.service';
import { VivaWalletsService } from './services/viva-wallets.service';
import { VivaBankTransfersService } from './services/viva-bank-transfers.service';
import { VivaMarketplaceService } from './services/viva-marketplace.service';
import { VivaResellersService } from './services/viva-resellers.service';
import { VivaDataServicesService } from './services/viva-data-services.service';
import { VivaWebhooksService } from './services/viva-webhooks.service';
import { VivaConnectedAccountsAdapter } from './services/viva-connected-accounts.adapter';
import { CONNECTED_ACCOUNTS_PROVIDER } from '@/shared/services/connected-accounts/connected-accounts-provider.interface';

describe('VivaIntegrationModule', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [VivaIntegrationModule],
    }).compile();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it.each([
    ['VivaConfig', VivaConfig],
    ['VivaHttpClient', VivaHttpClient],
    ['VivaAuthService', VivaAuthService],
    ['VivaCheckoutService', VivaCheckoutService],
    ['VivaTransactionsService', VivaTransactionsService],
    ['VivaRfCodesService', VivaRfCodesService],
    ['VivaSourcesService', VivaSourcesService],
    ['VivaWalletsService', VivaWalletsService],
    ['VivaBankTransfersService', VivaBankTransfersService],
    ['VivaMarketplaceService', VivaMarketplaceService],
    ['VivaResellersService', VivaResellersService],
    ['VivaDataServicesService', VivaDataServicesService],
    ['VivaWebhooksService', VivaWebhooksService],
    ['VivaConnectedAccountsAdapter', VivaConnectedAccountsAdapter],
  ])('should resolve %s', (_name, token) => {
    expect(module.get(token as any)).toBeInstanceOf(token as any);
  });

  it('binds CONNECTED_ACCOUNTS_PROVIDER to the Viva adapter', () => {
    expect(module.get(CONNECTED_ACCOUNTS_PROVIDER)).toBeInstanceOf(VivaConnectedAccountsAdapter);
  });
});
