import { Injectable } from '@nestjs/common';
import { VivaHttpClient } from '../http/viva-http.client';
import { VivaAuthMode, VivaHost } from '../interfaces/viva-common.interface';
import {
  CreateBankTransferFeeRequest,
  ExecuteBankTransferRequest,
  LinkBankAccountRequest,
  ListBankAccountsQuery,
  UpdateBankAccountRequest,
  VivaBankAccount,
  VivaBankTransferExecutionResponse,
  VivaBankTransferFeeResponse,
  VivaInstructionTypesResponse,
} from '../interfaces/viva-bank-transfers.interface';

@Injectable()
export class VivaBankTransfersService {
  constructor(private readonly vivaHttpClient: VivaHttpClient) {}

  async linkBankAccount(
    payload: LinkBankAccountRequest,
  ): Promise<VivaBankAccount> {
    return this.vivaHttpClient.request<VivaBankAccount>({
      host: VivaHost.API,
      auth: VivaAuthMode.OAUTH2,
      method: 'POST',
      path: '/banktransfers/v1/bankaccounts',
      data: payload,
    });
  }

  async listBankAccounts(
    query?: ListBankAccountsQuery,
  ): Promise<VivaBankAccount[]> {
    return this.vivaHttpClient.request<VivaBankAccount[]>({
      host: VivaHost.API,
      auth: VivaAuthMode.OAUTH2,
      method: 'GET',
      path: '/banktransfers/v1/bankaccounts',
      query,
    });
  }

  async getBankAccount(bankAccountId: string): Promise<VivaBankAccount> {
    return this.vivaHttpClient.request<VivaBankAccount>({
      host: VivaHost.API,
      auth: VivaAuthMode.OAUTH2,
      method: 'GET',
      path: `/banktransfers/v1/bankaccounts/${bankAccountId}`,
    });
  }

  async updateBankAccount(
    bankAccountId: string,
    payload: UpdateBankAccountRequest,
  ): Promise<VivaBankAccount> {
    return this.vivaHttpClient.request<VivaBankAccount>({
      host: VivaHost.API,
      auth: VivaAuthMode.OAUTH2,
      method: 'PATCH',
      path: `/banktransfers/v1/bankaccounts/${bankAccountId}`,
      data: payload,
    });
  }

  async getInstructionTypes(
    bankAccountId: string,
    amount: number,
  ): Promise<VivaInstructionTypesResponse> {
    return this.vivaHttpClient.request<VivaInstructionTypesResponse>({
      host: VivaHost.API,
      auth: VivaAuthMode.OAUTH2,
      method: 'GET',
      path: `/banktransfers/v1/bankaccounts/${bankAccountId}/instructiontypes`,
      query: { amount },
    });
  }

  async createBankTransferFee(
    bankAccountId: string,
    payload: CreateBankTransferFeeRequest,
  ): Promise<VivaBankTransferFeeResponse> {
    return this.vivaHttpClient.request<VivaBankTransferFeeResponse>({
      host: VivaHost.API,
      auth: VivaAuthMode.OAUTH2,
      method: 'POST',
      path: `/banktransfers/v1/bankaccounts/${bankAccountId}/fees`,
      data: payload,
    });
  }

  async executeBankTransfer(
    bankAccountId: string,
    payload: ExecuteBankTransferRequest,
  ): Promise<VivaBankTransferExecutionResponse> {
    return this.vivaHttpClient.request<VivaBankTransferExecutionResponse>({
      host: VivaHost.API,
      auth: VivaAuthMode.OAUTH2,
      method: 'POST',
      path: `/banktransfers/v1/bankaccounts/${bankAccountId}:send`,
      data: payload,
    });
  }
}
