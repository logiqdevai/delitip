import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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

const providers = [
  VivaConfig,
  VivaHttpClient,
  VivaAuthService,
  VivaCheckoutService,
  VivaTransactionsService,
  VivaRfCodesService,
  VivaSourcesService,
  VivaWalletsService,
  VivaBankTransfersService,
  VivaMarketplaceService,
  VivaResellersService,
  VivaDataServicesService,
  VivaWebhooksService,
];

@Module({
  imports: [ConfigModule],
  providers,
  exports: providers,
})
export class VivaIntegrationModule {}
