import { Injectable } from '@nestjs/common';
import { VivaHttpClient } from '../http/viva-http.client';
import { VivaAuthMode, VivaHost } from '../interfaces/viva-common.interface';
import {
  CancelOrderResponse,
  CreatePaymentOrderRequest,
  CreatePaymentOrderResponse,
  UpdateOrderRequest,
  VivaOrder,
  VivaOrderFees,
} from '../interfaces/viva-checkout.interface';

// Smart Checkout (v2) payment orders. The order is created via OAuth2 on the
// "api" host, while retrieval/cancellation/updates still use the native
// checkout host with Basic auth.
@Injectable()
export class VivaCheckoutService {
  constructor(private readonly vivaHttpClient: VivaHttpClient) {}

  async createOrder(
    payload: CreatePaymentOrderRequest,
  ): Promise<CreatePaymentOrderResponse> {
    return this.vivaHttpClient.request<CreatePaymentOrderResponse>({
      host: VivaHost.API,
      auth: VivaAuthMode.OAUTH2,
      method: 'POST',
      path: '/checkout/v2/orders',
      data: payload,
    });
  }

  async getOrder(orderCode: string | number): Promise<VivaOrder> {
    return this.vivaHttpClient.request<VivaOrder>({
      host: VivaHost.NATIVE,
      auth: VivaAuthMode.BASIC,
      method: 'GET',
      path: `/api/orders/${orderCode}`,
    });
  }

  async cancelOrder(orderCode: string | number): Promise<CancelOrderResponse> {
    return this.vivaHttpClient.request<CancelOrderResponse>({
      host: VivaHost.NATIVE,
      auth: VivaAuthMode.BASIC,
      method: 'DELETE',
      path: `/api/orders/${orderCode}`,
    });
  }

  async updateOrder(
    orderCode: string | number,
    payload: UpdateOrderRequest,
  ): Promise<void> {
    await this.vivaHttpClient.request<void>({
      host: VivaHost.NATIVE,
      auth: VivaAuthMode.BASIC,
      method: 'PATCH',
      path: `/api/orders/${orderCode}`,
      data: payload,
    });
  }

  // The spec declares `orderCode`/`amount` as path parameters but lists the
  // path itself as the un-templated "/api/fees" — the real endpoint takes
  // both segments positionally.
  async getOrderFees(
    orderCode: string | number,
    amount: number,
  ): Promise<VivaOrderFees> {
    return this.vivaHttpClient.request<VivaOrderFees>({
      host: VivaHost.NATIVE,
      auth: VivaAuthMode.BASIC,
      method: 'GET',
      path: `/api/fees/${orderCode}/${amount}`,
    });
  }
}
