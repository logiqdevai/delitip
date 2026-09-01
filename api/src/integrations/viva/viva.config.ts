import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { VivaOAuthScope } from './interfaces/viva-common.interface';

export const VivaEnvironment = {
  DEMO: 'demo',
  PRODUCTION: 'production',
} as const;

export type VivaEnvironment =
  (typeof VivaEnvironment)[keyof typeof VivaEnvironment];

@Injectable()
export class VivaConfig {
  private readonly logger = new Logger(VivaConfig.name);
  private readonly environment: VivaEnvironment;

  constructor(private readonly configService: ConfigService) {
    this.environment =
      this.configService.get<VivaEnvironment>('VIVA_ENVIRONMENT') ??
      VivaEnvironment.DEMO;

    if (!this.getClientId() || !this.getClientSecret()) {
      this.logger.warn(
        'Viva OAuth2 credentials are not configured (VIVA_CLIENT_ID / VIVA_CLIENT_SECRET)',
      );
    }

    if (
      !this.configService.get<string>('VIVA_ACCOUNT_TRANSACTIONS_CLIENT_ID')
    ) {
      this.logger.warn(
        'VIVA_ACCOUNT_TRANSACTIONS_CLIENT_ID/SECRET not set — Bank Transfer API calls (IBAN linking, payouts) will fall back to the Smart Checkout client, which is likely unauthorized for that permission group.',
      );
    }
  }

  isSandbox(): boolean {
    return this.environment !== VivaEnvironment.PRODUCTION;
  }

  getEnvironment(): VivaEnvironment {
    return this.environment;
  }

  getAccountsBaseUrl(): string {
    return this.isSandbox()
      ? 'https://demo-accounts.vivapayments.com'
      : 'https://accounts.vivapayments.com';
  }

  getApiBaseUrl(): string {
    return this.isSandbox()
      ? 'https://demo-api.vivapayments.com'
      : 'https://api.vivapayments.com';
  }

  getNativeBaseUrl(): string {
    return this.isSandbox()
      ? 'https://demo.vivapayments.com'
      : 'https://www.vivapayments.com';
  }

  // Viva issues a separate OAuth2 client id/secret per API permission group
  // (Smart Checkout vs. Account Transactions/Bank Transfer) rather than one
  // pair for the whole merchant account. ACCOUNT_TRANSACTIONS falls back to
  // the checkout pair when unset, so a single-credential setup (checkout
  // only, no payouts configured yet) keeps working exactly as before.
  getClientId(scope: VivaOAuthScope = VivaOAuthScope.CHECKOUT): string | undefined {
    if (scope === VivaOAuthScope.ACCOUNT_TRANSACTIONS) {
      return (
        this.configService.get<string>('VIVA_ACCOUNT_TRANSACTIONS_CLIENT_ID') ??
        this.configService.get<string>('VIVA_CLIENT_ID')
      );
    }
    return this.configService.get<string>('VIVA_CLIENT_ID');
  }

  getClientSecret(scope: VivaOAuthScope = VivaOAuthScope.CHECKOUT): string | undefined {
    if (scope === VivaOAuthScope.ACCOUNT_TRANSACTIONS) {
      return (
        this.configService.get<string>('VIVA_ACCOUNT_TRANSACTIONS_CLIENT_SECRET') ??
        this.configService.get<string>('VIVA_CLIENT_SECRET')
      );
    }
    return this.configService.get<string>('VIVA_CLIENT_SECRET');
  }

  getMerchantId(): string | undefined {
    return this.configService.get<string>('VIVA_MERCHANT_ID');
  }

  getApiKey(): string | undefined {
    return this.configService.get<string>('VIVA_API_KEY');
  }

  getDefaultSourceCode(): string | undefined {
    return this.configService.get<string>('VIVA_SOURCE_CODE');
  }

  getWalletId(): number | undefined {
    return this.configService.get<number>('VIVA_WALLET_ID');
  }

  // Comma-separated CIDR/IP list — Viva has no webhook HMAC, so this
  // allowlist plus the mandatory re-fetch-before-trusting pattern is the
  // only authenticity check available. Empty means "not configured yet";
  // callers should treat that as fail-closed, not as "allow everything".
  getWebhookIpAllowlist(): string[] {
    const raw = this.configService.get<string>('VIVA_WEBHOOK_IP_ALLOWLIST');
    if (!raw) return [];
    return raw
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean);
  }

  getBasicAuthHeader(): string {
    const merchantId = this.getMerchantId();
    const apiKey = this.getApiKey();

    if (!merchantId || !apiKey) {
      throw new Error(
        'Viva merchant credentials (VIVA_MERCHANT_ID / VIVA_API_KEY) are required',
      );
    }

    return `Basic ${Buffer.from(`${merchantId}:${apiKey}`).toString('base64')}`;
  }
}
