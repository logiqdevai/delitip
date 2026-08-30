import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { VivaConfig } from '../viva.config';
import { VivaOAuthTokenResponse } from '../interfaces/viva-auth.interface';

// Viva's OAuth2 client-credentials tokens are valid for ~1 hour. We cache the
// token in-memory and share a single in-flight refresh across concurrent
// callers so a burst of requests never triggers duplicate token requests.
@Injectable()
export class VivaAuthService {
  private readonly logger = new Logger(VivaAuthService.name);
  private accessToken?: string;
  private expiresAt = 0;
  private pendingRequest?: Promise<string>;

  constructor(private readonly vivaConfig: VivaConfig) {}

  async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.expiresAt) {
      return this.accessToken;
    }

    if (!this.pendingRequest) {
      this.pendingRequest = this.requestNewToken().finally(() => {
        this.pendingRequest = undefined;
      });
    }

    return this.pendingRequest;
  }

  private async requestNewToken(): Promise<string> {
    const clientId = this.vivaConfig.getClientId();
    const clientSecret = this.vivaConfig.getClientSecret();

    if (!clientId || !clientSecret) {
      throw new Error(
        'Viva OAuth2 credentials (VIVA_CLIENT_ID / VIVA_CLIENT_SECRET) are required',
      );
    }

    const body = new URLSearchParams({ grant_type: 'client_credentials' });

    const response = await axios.post<VivaOAuthTokenResponse>(
      `${this.vivaConfig.getAccountsBaseUrl()}/connect/token`,
      body.toString(),
      {
        auth: { username: clientId, password: clientSecret },
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      },
    );

    this.accessToken = response.data.access_token;
    this.expiresAt =
      Date.now() + Math.max(response.data.expires_in - 60, 0) * 1000;

    this.logger.debug('Viva OAuth2 access token refreshed');

    return this.accessToken;
  }
}
