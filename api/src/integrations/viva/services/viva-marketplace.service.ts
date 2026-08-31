import { Injectable } from '@nestjs/common';
import { VivaHttpClient } from '../http/viva-http.client';
import { VivaAuthMode, VivaHost } from '../interfaces/viva-common.interface';
import {
  CancelMarketplaceTransactionQuery,
  CancelMarketplaceTransactionResponse,
  ConnectedAccount,
  CreateConnectedAccountRequest,
  CreateConnectedAccountResponse,
  CreateMarketplaceOrderRequest,
  CreateMarketplaceOrderResponse,
  CreateMarketplaceTransferRequest,
  MarketplaceTransferResponse,
  ReverseTransferRequest,
  UpdateConnectedAccountRequest,
} from '../interfaces/viva-marketplace.interface';

// Viva's multi-tenant marketplace/platform features: onboarding connected
// seller accounts, moving funds to/from them, and creating marketplace-aware
// payment orders and cancellations.
@Injectable()
export class VivaMarketplaceService {
  constructor(private readonly vivaHttpClient: VivaHttpClient) {}

  async createConnectedAccount(
    payload: CreateConnectedAccountRequest,
  ): Promise<CreateConnectedAccountResponse> {
    return this.vivaHttpClient.request<CreateConnectedAccountResponse>({
      host: VivaHost.API,
      auth: VivaAuthMode.OAUTH2,
      method: 'POST',
      path: '/platforms/v1/accounts',
      data: payload,
    });
  }

  async getConnectedAccount(accountId: string): Promise<ConnectedAccount> {
    return this.vivaHttpClient.request<ConnectedAccount>({
      host: VivaHost.API,
      auth: VivaAuthMode.OAUTH2,
      method: 'GET',
      path: `/platforms/v1/accounts/${accountId}`,
    });
  }

  async updateConnectedAccount(
    accountId: string,
    payload: UpdateConnectedAccountRequest,
  ): Promise<void> {
    await this.vivaHttpClient.request<void>({
      host: VivaHost.API,
      auth: VivaAuthMode.OAUTH2,
      method: 'PATCH',
      path: `/platforms/v1/accounts/${accountId}`,
      data: payload,
    });
  }

  async createTransfer(
    payload: CreateMarketplaceTransferRequest,
  ): Promise<MarketplaceTransferResponse> {
    return this.vivaHttpClient.request<MarketplaceTransferResponse>({
      host: VivaHost.API,
      auth: VivaAuthMode.OAUTH2,
      method: 'POST',
      path: '/platforms/v1/transfers',
      data: payload,
    });
  }

  async reverseTransfer(
    transferId: string,
    payload: ReverseTransferRequest,
  ): Promise<MarketplaceTransferResponse> {
    return this.vivaHttpClient.request<MarketplaceTransferResponse>({
      host: VivaHost.API,
      auth: VivaAuthMode.OAUTH2,
      method: 'POST',
      path: `/platforms/v1/transfers/${transferId}:reverse`,
      data: payload,
    });
  }

  async createMarketplaceOrder(
    payload: CreateMarketplaceOrderRequest,
  ): Promise<CreateMarketplaceOrderResponse> {
    return this.vivaHttpClient.request<CreateMarketplaceOrderResponse>({
      host: VivaHost.API,
      auth: VivaAuthMode.OAUTH2,
      method: 'POST',
      path: '/checkout/v2/orders',
      data: payload,
    });
  }

  async cancelTransaction(
    transactionId: string,
    query: CancelMarketplaceTransactionQuery,
  ): Promise<CancelMarketplaceTransactionResponse> {
    return this.vivaHttpClient.request<CancelMarketplaceTransactionResponse>({
      host: VivaHost.API,
      auth: VivaAuthMode.OAUTH2,
      method: 'DELETE',
      path: `/acquiring/v1/transactions/${transactionId}`,
      query,
    });
  }
}
