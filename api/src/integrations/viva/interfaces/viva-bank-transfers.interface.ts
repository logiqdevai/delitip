export interface VivaBankAccount {
  iban?: string;
  bankAccountId?: string;
  bankId?: string;
  isArchived?: boolean;
  bankName?: string;
  swiftCode?: string;
  created?: string;
  friendlyName?: string;
  beneficiaryName?: string;
  secondaryReferenceData?: string;
  isVivaIban?: boolean;
  purposeId?: number;
  accountTypeId?: number;
}

export interface LinkBankAccountRequest {
  /** IBAN of the beneficiary account (max 31 chars). */
  iban: string;
  /** Legal name on the bank account. */
  beneficiaryName: string;
  /** User-defined alias/description for the account. */
  friendlyName?: string;
  /** Secondary Reference Data (UK only). */
  secondaryReferenceData?: string;
  /** Payment purpose (UK only). */
  purposeId?: number;
  /** Whether the account is Business or Personal (UK only). */
  accountTypeId?: number;
}

export interface ListBankAccountsQuery {
  skip?: number;
  maxResults?: number;
  iban?: string;
  isArchived?: boolean;
  bankAccountId?: string;
}

export interface UpdateBankAccountRequest {
  /** The desired bank account status. */
  archive: boolean;
  friendlyName?: string;
  beneficiaryName?: string;
}

export interface VivaInstructionTypesResponse {
  supportsBatch?: boolean;
  supportsInstant?: boolean;
  descriptionRequired?: boolean;
  instructionTypes?: number[];
}

export interface CreateBankTransferFeeRequest {
  /** The amount of the requested outgoing bank transfer. */
  amount: number;
  /** The wallet id from which the amount will be transferred. */
  walletId: number;
  isInstant?: boolean;
  /** The instruction type(s) for this bank transfer. */
  instructionType: number[];
}

export interface VivaBankTransferFeeResponse {
  fee?: number;
  isInstant?: boolean;
  bankCommandId?: string;
  commissionType?: number;
  beneficiaryNames?: string[];
}

export interface ExecuteBankTransferRequest {
  /** The amount of the requested outgoing bank transfer. */
  amount: number;
  /** The wallet id from which the amount will be transferred. */
  walletId: number;
  description?: string;
  /** Id of the bank transfer fee command associated with a specific fee/instruction type. */
  bankCommandId?: string;
  /** Finnish reference number for the bank transfer. */
  structuredRemittanceInfo?: string;
}

export interface VivaBankTransferExecutionResponse {
  fee?: number;
  commandId?: string;
  isInstant?: boolean;
  walletTransactionId?: string;
}
