import { Injectable } from '@nestjs/common';
import { VivaHttpClient } from '../http/viva-http.client';
import { VivaAuthMode, VivaHost } from '../interfaces/viva-common.interface';
import {
  AddWebhookSubscriptionRequest,
  DeleteWebhookSubscriptionResponse,
  SaleTransactionsExportRequest,
  SaleTransactionsExportResponse,
  SearchTransactionsQuery,
  SearchTransactionsRequest,
  SearchTransactionsResponse,
  VivaMt940Response,
  WebhookSubscription,
  WebhookSubscriptionResponse,
} from '../interfaces/viva-data-services.interface';

@Injectable()
export class VivaDataServicesService {
  constructor(private readonly vivaHttpClient: VivaHttpClient) {}

  // Returns the raw MT940 statement text for the given date, or null when
  // Viva has no data for that date (returned as a 204 with an empty body).
  async getMt940Data(reportDate: string): Promise<string | null> {
    const result = await this.vivaHttpClient.request<VivaMt940Response | ''>({
      host: VivaHost.API,
      auth: VivaAuthMode.OAUTH2,
      method: 'GET',
      path: '/dataservices/v2/merchants/mt940',
      query: { ReportDate: reportDate },
    });

    return (result && result.Response) || null;
  }

  async addWebhookSubscription(
    payload: AddWebhookSubscriptionRequest,
  ): Promise<WebhookSubscriptionResponse> {
    return this.vivaHttpClient.request<WebhookSubscriptionResponse>({
      host: VivaHost.API,
      auth: VivaAuthMode.OAUTH2,
      method: 'POST',
      path: '/dataservices/v1/webhooks/subscriptions',
      data: payload,
    });
  }

  async updateWebhookSubscription(
    subscriptionId: string,
    payload: AddWebhookSubscriptionRequest,
  ): Promise<WebhookSubscriptionResponse> {
    return this.vivaHttpClient.request<WebhookSubscriptionResponse>({
      host: VivaHost.API,
      auth: VivaAuthMode.OAUTH2,
      method: 'PUT',
      path: `/dataservices/v1/webhooks/subscriptions/${subscriptionId}`,
      data: payload,
    });
  }

  async deleteWebhookSubscription(
    subscriptionId: string,
  ): Promise<DeleteWebhookSubscriptionResponse> {
    return this.vivaHttpClient.request<DeleteWebhookSubscriptionResponse>({
      host: VivaHost.API,
      auth: VivaAuthMode.OAUTH2,
      method: 'DELETE',
      path: `/dataservices/v1/webhooks/subscriptions/${subscriptionId}`,
    });
  }

  // The spec documents a single-object response schema here, but this is a
  // list endpoint and actually returns an array of subscriptions.
  async listWebhookSubscriptions(): Promise<WebhookSubscription[]> {
    return this.vivaHttpClient.request<WebhookSubscription[]>({
      host: VivaHost.API,
      auth: VivaAuthMode.OAUTH2,
      method: 'GET',
      path: '/dataservices/v1/webhooks/subscriptions/',
    });
  }

  async requestSaleTransactionsExport(
    payload: SaleTransactionsExportRequest,
  ): Promise<SaleTransactionsExportResponse> {
    return this.vivaHttpClient.request<SaleTransactionsExportResponse>({
      host: VivaHost.API,
      auth: VivaAuthMode.OAUTH2,
      method: 'POST',
      path: '/dataservices/v1/transactions/exports',
      data: payload,
    });
  }

  async searchTransactions(
    payload: SearchTransactionsRequest,
    query?: SearchTransactionsQuery,
  ): Promise<SearchTransactionsResponse> {
    return this.vivaHttpClient.request<SearchTransactionsResponse>({
      host: VivaHost.API,
      auth: VivaAuthMode.OAUTH2,
      method: 'POST',
      path: '/dataservices/v2/transactions/Search',
      query,
      data: payload,
    });
  }
}
