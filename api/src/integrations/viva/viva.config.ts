import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

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

  getClientId(): string | undefined {
    return this.configService.get<string>('VIVA_CLIENT_ID');
  }

  getClientSecret(): string | undefined {
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
