export const VivaHost = {
  ACCOUNTS: 'accounts',
  API: 'api',
  NATIVE: 'native',
} as const;

export type VivaHost = (typeof VivaHost)[keyof typeof VivaHost];

export const VivaAuthMode = {
  OAUTH2: 'oauth2',
  BASIC: 'basic',
  NONE: 'none',
} as const;

export type VivaAuthMode = (typeof VivaAuthMode)[keyof typeof VivaAuthMode];

// Viva's merchant portal grants OAuth2 client-credentials access per API
// permission group, not per merchant account — "Smart Checkout" and
// "Account Transactions" (which gates the Bank Transfer API) are issued as
// two separate client id/secret pairs, each only valid for its own group of
// endpoints. Only relevant when auth is OAUTH2; ignored otherwise.
export const VivaOAuthScope = {
  CHECKOUT: 'checkout',
  ACCOUNT_TRANSACTIONS: 'account_transactions',
  // Marketplace/connected-accounts endpoints (`/platforms/v1/*`) require the
  // `urn:viva:payments:core:api:platform` OAuth2 scope per Viva's spec —
  // issued as its own client id/secret pair, same per-permission-group model
  // as ACCOUNT_TRANSACTIONS.
  PLATFORM: 'platform',
} as const;

export type VivaOAuthScope =
  (typeof VivaOAuthScope)[keyof typeof VivaOAuthScope];

export type VivaHttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface VivaRequestOptions {
  host: VivaHost;
  auth: VivaAuthMode;
  /** Defaults to CHECKOUT when auth is OAUTH2 and this is omitted. */
  oauthScope?: VivaOAuthScope;
  method: VivaHttpMethod;
  path: string;
  query?: object;
  data?: unknown;
  headers?: Record<string, string>;
}

/**
 * Viva's API generations return errors in different shapes (native checkout
 * v1 uses PascalCase Error* fields, OAuth2-secured v2/v1 APIs use lowercase
 * status/message/eventId). This normalized shape captures both so callers
 * can inspect whichever fields the upstream call actually returned.
 */
export interface VivaErrorResponse {
  status?: number;
  message?: string;
  eventId?: number;
  ErrorCode?: number;
  ErrorText?: string;
  EventId?: number;
  Success?: boolean;
  errors?: Record<string, string[]>;
}

export interface VivaPagination {
  page?: number;
  pageSize?: number;
  orderBy?: 'Ascending' | 'Descending';
}
