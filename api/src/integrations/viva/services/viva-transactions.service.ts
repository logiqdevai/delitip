import { Injectable } from '@nestjs/common';
import { VivaHttpClient } from '../http/viva-http.client';
import { VivaAuthMode, VivaHost } from '../interfaces/viva-common.interface';
import {
  CancelNativeTransactionQuery,
  CancelPartialAuthQuery,
  CancelRebateOrFastRefundQuery,
  CreateCardTokenRequest,
  CreateCardTokenResponse,
  CreateNativeTransactionRequest,
  IncreasePreauthRequest,
  PayoutQuery,
  RebateOrFastRefundRequest,
  VivaNativeTransactionResult,
  VivaTransaction,
} from '../interfaces/viva-transactions.interface';

// Card tokenization, checkout-v2 transaction retrieval, native checkout
// transaction create/cancel/payout, and acquiring preauth/rebate/refund
// operations. Native checkout calls use Basic auth on the "native" host;
// everything else is OAuth2 on the "api" host.
@Injectable()
export class VivaTransactionsService {
  constructor(private readonly vivaHttpClient: VivaHttpClient) {}

  async getTransaction(transactionId: string): Promise<VivaTransaction> {
    return this.vivaHttpClient.request<VivaTransaction>({
      host: VivaHost.API,
      auth: VivaAuthMode.OAUTH2,
      method: 'GET',
      path: `/checkout/v2/transactions/${transactionId}`,
    });
  }

  async createCardToken(
    payload: CreateCardTokenRequest,
  ): Promise<CreateCardTokenResponse> {
    return this.vivaHttpClient.request<CreateCardTokenResponse>({
      host: VivaHost.API,
      auth: VivaAuthMode.OAUTH2,
      method: 'POST',
      path: '/acquiring/v1/cards/tokens',
      data: payload,
    });
  }

  async increasePreauth(
    transactionId: string,
    payload: IncreasePreauthRequest,
  ): Promise<{ transactionId?: string }> {
    return this.vivaHttpClient.request<{ transactionId?: string }>({
      host: VivaHost.API,
      auth: VivaAuthMode.OAUTH2,
      method: 'POST',
      path: `/acquiring/v1/transactions/${transactionId}:increasepreauth`,
      data: payload,
    });
  }

  async createTransaction(
    transactionId: string,
    payload: CreateNativeTransactionRequest,
  ): Promise<VivaNativeTransactionResult> {
    return this.vivaHttpClient.request<VivaNativeTransactionResult>({
      host: VivaHost.NATIVE,
      auth: VivaAuthMode.BASIC,
      method: 'POST',
      path: `/api/transactions/${transactionId}`,
      data: payload,
    });
  }

  async cancelTransaction(
    transactionId: string,
    query: CancelNativeTransactionQuery,
  ): Promise<VivaNativeTransactionResult> {
    return this.vivaHttpClient.request<VivaNativeTransactionResult>({
      host: VivaHost.NATIVE,
      auth: VivaAuthMode.BASIC,
      method: 'DELETE',
      path: `/api/transactions/${transactionId}`,
      query,
    });
  }

  async payout(
    transactionId: string,
    query: PayoutQuery,
  ): Promise<VivaNativeTransactionResult> {
    return this.vivaHttpClient.request<VivaNativeTransactionResult>({
      host: VivaHost.NATIVE,
      auth: VivaAuthMode.BASIC,
      method: 'DELETE',
      path: `/api/transactions/${transactionId}`,
      query,
    });
  }

  async cancelPartialAuthorization(
    transactionId: string,
    query: CancelPartialAuthQuery,
  ): Promise<void> {
    await this.vivaHttpClient.request<void>({
      host: VivaHost.API,
      auth: VivaAuthMode.OAUTH2,
      method: 'DELETE',
      path: `/acquiring/v1/transactions/${transactionId}`,
      query,
    });
  }

  async createRebate(
    transactionId: string,
    payload: RebateOrFastRefundRequest,
  ): Promise<{ transactionId?: string }> {
    return this.vivaHttpClient.request<{ transactionId?: string }>({
      host: VivaHost.API,
      auth: VivaAuthMode.OAUTH2,
      method: 'POST',
      path: `/acquiring/v1/transactions/${transactionId}:rebate`,
      data: payload,
    });
  }

  async createFastRefund(
    transactionId: string,
    payload: RebateOrFastRefundRequest,
  ): Promise<{ transactionId?: string }> {
    return this.vivaHttpClient.request<{ transactionId?: string }>({
      host: VivaHost.API,
      auth: VivaAuthMode.OAUTH2,
      method: 'POST',
      path: `/acquiring/v1/transactions/${transactionId}:fastrefund`,
      data: payload,
    });
  }

  async cancelRebateOrFastRefund(
    transactionId: string,
    query: CancelRebateOrFastRefundQuery,
  ): Promise<void> {
    await this.vivaHttpClient.request<void>({
      host: VivaHost.API,
      auth: VivaAuthMode.OAUTH2,
      method: 'DELETE',
      path: `/acquiring/v1/transactions/${transactionId}`,
      query,
    });
  }
}
