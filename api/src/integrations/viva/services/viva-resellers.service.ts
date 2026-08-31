import { Injectable } from '@nestjs/common';
import { VivaHttpClient } from '../http/viva-http.client';
import { VivaAuthMode, VivaHost } from '../interfaces/viva-common.interface';
import {
  BillPaymentResponse,
  CashPaymentResponse,
  CreateBillPaymentRequest,
  CreateCashPaymentRequest,
  CreateResellerOrderRequest,
  CreateResellerOrderResponse,
  ValidateBillPaymentRequest,
  ValidateCashPaymentRequest,
} from '../interfaces/viva-resellers.interface';

// Resellers act on behalf of a merchant to collect cash/bill payments (e.g.
// at a physical point of sale) or create top-up orders. Every endpoint is
// secured with OAuth2 on the "api" host.
@Injectable()
export class VivaResellersService {
  constructor(private readonly vivaHttpClient: VivaHttpClient) {}

  async validateCashPayment(
    payload: ValidateCashPaymentRequest,
  ): Promise<void> {
    await this.vivaHttpClient.request<void>({
      host: VivaHost.API,
      auth: VivaAuthMode.OAUTH2,
      method: 'POST',
      path: '/resellers/v1/transactions/cashPayments:validate',
      data: payload,
    });
  }

  async validateBillPayment(
    payload: ValidateBillPaymentRequest,
  ): Promise<void> {
    await this.vivaHttpClient.request<void>({
      host: VivaHost.API,
      auth: VivaAuthMode.OAUTH2,
      method: 'POST',
      path: '/resellers/v1/transactions/billPayments:validate',
      data: payload,
    });
  }

  async resendCashPaymentOtp(
    phone: string,
    countryCode?: string,
  ): Promise<void> {
    await this.vivaHttpClient.request<void>({
      host: VivaHost.API,
      auth: VivaAuthMode.OAUTH2,
      method: 'POST',
      path: '/resellers/v1/transactions/cashPayments:sendotp',
      query: { phone, countryCode },
    });
  }

  async resendBillPaymentOtp(
    phone: string,
    countryCode?: string,
  ): Promise<void> {
    await this.vivaHttpClient.request<void>({
      host: VivaHost.API,
      auth: VivaAuthMode.OAUTH2,
      method: 'POST',
      path: '/resellers/v1/transactions/billPayments:sendotp',
      query: { phone, countryCode },
    });
  }

  async createCashPayment(
    payload: CreateCashPaymentRequest,
  ): Promise<CashPaymentResponse> {
    return this.vivaHttpClient.request<CashPaymentResponse>({
      host: VivaHost.API,
      auth: VivaAuthMode.OAUTH2,
      method: 'POST',
      path: '/resellers/v1/transactions/cashPayments',
      data: payload,
    });
  }

  async createBillPayment(
    payload: CreateBillPaymentRequest,
  ): Promise<BillPaymentResponse> {
    return this.vivaHttpClient.request<BillPaymentResponse>({
      host: VivaHost.API,
      auth: VivaAuthMode.OAUTH2,
      method: 'POST',
      path: '/resellers/v1/transactions/billPayments',
      data: payload,
    });
  }

  async createOrder(
    payload: CreateResellerOrderRequest,
  ): Promise<CreateResellerOrderResponse> {
    return this.vivaHttpClient.request<CreateResellerOrderResponse>({
      host: VivaHost.API,
      auth: VivaAuthMode.OAUTH2,
      method: 'POST',
      path: '/resellers/v1/orders',
      data: payload,
    });
  }
}
