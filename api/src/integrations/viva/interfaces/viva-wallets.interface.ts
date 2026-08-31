export interface CreateBalanceTransferRequest {
  /** Positive, non-zero amount to transfer, in the currency's smallest unit. */
  amount: number;
  /** Text summarizing the transfer reason, shown on the target account statement. */
  description?: string;
  /** The Viva transaction ID generated during a related sale, if applicable. */
  saleTransactionId?: string;
  /** Short description. */
  customerTrns?: string;
}

export interface BalanceTransferResponse {
  /** Unique identifier for the debit taken from the source wallet. */
  DebitTransactionId?: number;
  /** Unique identifier for the credit sent to the target wallet. */
  CreditTransactionId?: number;
}

export interface VivaMerchantWallet {
  iban?: number;
  walletId?: number;
  amount?: number;
  isPrimary?: boolean;
  available?: number;
  overdraft?: number;
  currencyCode?: number;
  friendlyName?: string;
}

export interface SearchAccountTransactionsRequest {
  /** Start date of the search window. */
  DateFrom: string;
  /** End date of the search window. */
  DateTo: string;
  WalletId?: number;
  SubTypeIds?: string[];
  AmountFrom?: number;
  AmountTo?: number;
}

export interface SearchAccountTransactionsQuery {
  /** Maximum value 500. */
  PageSize?: number;
  /** Start at 1 and increase by one until a "204 No Content" response is returned. */
  Page?: number;
  OrderBy?: 'Ascending' | 'Descending';
}

export interface VivaAccountTransaction {
  accountTransactionId?: string;
  created?: string;
  personId?: string;
  walletId?: number;
  typeId?: number;
  subTypeId?: number;
  amount?: number;
  currencyCode?: number;
  targetAmount?: number;
  targetAvailable?: number;
  valueDate?: string;
  isAuthorization?: boolean;
  counterPart?: string;
  userDescription?: string;
  tag?: string;
}
