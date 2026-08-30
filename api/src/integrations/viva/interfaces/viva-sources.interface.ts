export interface CreateVivaSourceRequest {
  /** A unique code that is exchanged between your application and the API. */
  sourceCode: string;
  /** A meaningful name that will help you identify the source in the Web Self Care environment. */
  name: string;
  /** The primary domain of your site (no protocol/paths). Required for e-commerce sources. */
  domain?: string;
  /** `true` when your site's protocol is HTTPS. Required for e-commerce sources. */
  isSecure?: boolean;
  /** Relative URL path shown after a failed transaction. Required for e-commerce sources. */
  pathFail?: string;
  /** Relative URL path shown after a successful transaction. Required for e-commerce sources. */
  pathSuccess?: string;
  /** Contact phone number. Required for card-present sources. */
  phone?: string;
  /** softPOS/card terminal address. Required for card-present sources. */
  address?: string;
  /** Wallet ID the source is linked to. Required for card-present sources. */
  walletId?: number;
  /** Whether the source is associated with in-person payments. Required for card-present sources. */
  isPhysical?: boolean;
  /** softPOS/card terminal latitude. Required for card-present sources. */
  latitude?: number;
  /** softPOS/card terminal longitude. Required for card-present sources. */
  longitude?: number;
  /** Description shown on the cardholder's bank statement (max 22 chars). */
  transactionDescriptor?: string;
}
