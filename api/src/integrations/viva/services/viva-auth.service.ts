import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { VivaConfig } from '../viva.config';
import { VivaOAuthTokenResponse } from '../interfaces/viva-auth.interface';
import { VivaOAuthScope } from '../interfaces/viva-common.interface';

interface CachedToken {
  accessToken?: string;
  expiresAt: number;
  pendingRequest?: Promise<string>;
}

// Viva's OAuth2 client-credentials tokens are valid for ~1 hour. Each
// permission scope (Smart Checkout vs. Account Transactions) is a distinct
// client id/secret pair issued by Viva, so each gets its own cached token
// and its own shared in-flight refresh — a burst of requests for one scope
// never triggers duplicate token requests, and the two scopes never share
// or clobber each other's token.
@Injectable()
export class VivaAuthService {
  private readonly logger = new Logger(VivaAuthService.name);
  private readonly tokens = new Map<VivaOAuthScope, CachedToken>();

  constructor(private readonly vivaConfig: VivaConfig) {}

  async getAccessToken(
    scope: VivaOAuthScope = VivaOAuthScope.CHECKOUT,
  ): Promise<string> {
    const cached = this.tokens.get(scope);

    if (cached?.accessToken && Date.now() < cached.expiresAt) {
      return cached.accessToken;
    }

    if (!cached?.pendingRequest) {
      const pendingRequest = this.requestNewToken(scope).finally(() => {
        const entry = this.tokens.get(scope);
        if (entry) entry.pendingRequest = undefined;
      });
      this.tokens.set(scope, { ...cached, expiresAt: cached?.expiresAt ?? 0, pendingRequest });
      return pendingRequest;
    }

    return cached.pendingRequest;
  }

  private async requestNewToken(scope: VivaOAuthScope): Promise<string> {
    const clientId = this.vivaConfig.getClientId(scope);
    const clientSecret = this.vivaConfig.getClientSecret(scope);

    if (!clientId || !clientSecret) {
      throw new Error(
        `Viva OAuth2 credentials for scope "${scope}" are not configured`,
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

    const accessToken = response.data.access_token;
    const expiresAt =
      Date.now() + Math.max(response.data.expires_in - 60, 0) * 1000;

    this.tokens.set(scope, { accessToken, expiresAt, pendingRequest: undefined });
    this.logger.debug(`Viva OAuth2 access token refreshed (scope=${scope})`);

    return accessToken;
  }
}
