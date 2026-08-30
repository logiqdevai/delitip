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

export type VivaHttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface VivaRequestOptions {
  host: VivaHost;
  auth: VivaAuthMode;
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
