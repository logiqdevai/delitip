import { Injectable } from '@nestjs/common';
import { VivaHttpClient } from '../http/viva-http.client';
import {
  VivaAuthMode,
  VivaHost,
  VivaOAuthScope,
} from '../interfaces/viva-common.interface';
import {
  BalanceTransferResponse,
  CreateBalanceTransferRequest,
  SearchAccountTransactionsQuery,
  SearchAccountTransactionsRequest,
  VivaAccountTransaction,
  VivaMerchantWallet,
} from '../interfaces/viva-wallets.interface';

@Injectable()
export class VivaWalletsService {
  constructor(private readonly vivaHttpClient: VivaHttpClient) {}

  async transferBalance(
    walletId: number,
    targetWalletId: number,
    payload: CreateBalanceTransferRequest,
  ): Promise<BalanceTransferResponse> {
    return this.vivaHttpClient.request<BalanceTransferResponse>({
      host: VivaHost.NATIVE,
      auth: VivaAuthMode.BASIC,
      method: 'POST',
      path: `/api/wallets/${walletId}/balancetransfer/${targetWalletId}`,
      data: payload,
    });
  }

  // Confirmed empirically against Viva's demo sandbox: the Smart Checkout
  // client is rejected (403) here — wallet/account endpoints live under the
  // same "Account Transactions" permission group as the Bank Transfer API,
  // not Checkout.
  async getMerchantWallets(): Promise<VivaMerchantWallet[]> {
    return this.vivaHttpClient.request<VivaMerchantWallet[]>({
      host: VivaHost.API,
      auth: VivaAuthMode.OAUTH2,
      oauthScope: VivaOAuthScope.ACCOUNT_TRANSACTIONS,
      method: 'GET',
      path: '/merchants/v1/wallets',
    });
  }

  // Page through results starting at Page=1 until a "204 No Content"
  // response signals there are no more account transactions to return.
  async searchAccountTransactions(
    payload: SearchAccountTransactionsRequest,
    query?: SearchAccountTransactionsQuery,
  ): Promise<VivaAccountTransaction[]> {
    const result = await this.vivaHttpClient.request<
      VivaAccountTransaction[] | ''
    >({
      host: VivaHost.API,
      auth: VivaAuthMode.OAUTH2,
      oauthScope: VivaOAuthScope.ACCOUNT_TRANSACTIONS,
      method: 'POST',
      path: '/dataservices/v2/accounttransactions/Search',
      query,
      data: payload,
    });

    return result || [];
  }
}
