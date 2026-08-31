import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosError } from 'axios';
import { VivaConfig } from '../viva.config';
import { VivaAuthService } from '../services/viva-auth.service';
import { VivaApiException } from './viva-api.exception';
import {
  VivaAuthMode,
  VivaErrorResponse,
  VivaHost,
  VivaRequestOptions,
} from '../interfaces/viva-common.interface';

// Thin HTTP wrapper shared by every Viva domain service. Centralizes base-url
// resolution (Viva splits its API across an OAuth accounts host, a REST "api"
// host and a legacy "native" host used by Basic-Auth secured endpoints),
// auth header injection and error normalization.
@Injectable()
export class VivaHttpClient {
  private readonly logger = new Logger(VivaHttpClient.name);

  constructor(
    private readonly vivaConfig: VivaConfig,
    private readonly vivaAuthService: VivaAuthService,
  ) {}

  async request<T = unknown>(options: VivaRequestOptions): Promise<T> {
    const headers = await this.resolveHeaders(options);

    try {
      const response = await axios.request<T>({
        baseURL: this.resolveBaseUrl(options.host),
        url: options.path,
        method: options.method,
        params: options.query,
        data: options.data,
        headers,
      });

      return response.data;
    } catch (error) {
      throw this.toVivaException(error as AxiosError);
    }
  }

  private resolveBaseUrl(host: VivaHost): string {
    switch (host) {
      case VivaHost.ACCOUNTS:
        return this.vivaConfig.getAccountsBaseUrl();
      case VivaHost.NATIVE:
        return this.vivaConfig.getNativeBaseUrl();
      case VivaHost.API:
      default:
        return this.vivaConfig.getApiBaseUrl();
    }
  }

  private async resolveHeaders(
    options: VivaRequestOptions,
  ): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      Accept: 'application/json',
      ...options.headers,
    };

    if (options.auth === VivaAuthMode.OAUTH2) {
      headers.Authorization = `Bearer ${await this.vivaAuthService.getAccessToken()}`;
    } else if (options.auth === VivaAuthMode.BASIC) {
      headers.Authorization = this.vivaConfig.getBasicAuthHeader();
    }

    if (options.data !== undefined && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    return headers;
  }

  private toVivaException(error: AxiosError): VivaApiException {
    if (error.response) {
      const data = error.response.data as VivaErrorResponse | undefined;
      const message = data?.message || data?.ErrorText || error.message;

      this.logger.error(`Viva API error ${error.response.status}: ${message}`);

      return new VivaApiException(error.response.status, message, data);
    }

    this.logger.error(`Viva API request failed: ${error.message}`);

    return new VivaApiException(502, 'Failed to reach Viva API');
  }
}
