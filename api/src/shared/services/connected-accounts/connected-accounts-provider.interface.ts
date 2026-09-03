// Provider-agnostic seam for "connected account" style payouts (Viva
// Marketplace today; Stripe Connect calls its own onboarded sellers
// "connected accounts" too, so the same interface/token is meant to be
// re-bound to a Stripe adapter later without touching payout-accounts/
// payouts/refunds service code — only the DI binding changes.
export const CONNECTED_ACCOUNTS_PROVIDER = 'CONNECTED_ACCOUNTS_PROVIDER';

export interface CreateConnectedAccountInput {
  email: string;
  /** Where the seller is redirected after completing hosted onboarding. */
  returnUrl: string;
  legalName?: string;
  taxNumber?: string;
}

export interface CreateConnectedAccountResult {
  accountId: string;
  /** Hosted onboarding link to send/redirect the seller to, if any. */
  onboardingUrl?: string;
}

export interface ConnectedAccountStatus {
  verified: boolean;
  payoutsEnabled: boolean;
}

export interface CreateConnectedTransferInput {
  connectedAccountId: string;
  /** Minor currency units. */
  amount: number;
  /** The settled customer payment (transaction) this transfer is associated with, for reconciliation. */
  transactionId?: string;
  description?: string;
}

export interface CreateConnectedTransferResult {
  transferId: string;
}

export interface CancelWithReversalInput {
  transactionId: string;
  /** Minor currency units. */
  amount: number;
  /** Automatically claw back the seller-side transfer as part of the cancellation. */
  reverseTransfers: boolean;
  /** Automatically return the platform's own fee/commission as part of the cancellation. */
  refundPlatformFee: boolean;
}

export interface CancelWithReversalResult {
  transactionId?: string;
}

export interface ConnectedAccountsProvider {
  createConnectedAccount(input: CreateConnectedAccountInput): Promise<CreateConnectedAccountResult>;
  getConnectedAccountStatus(accountId: string): Promise<ConnectedAccountStatus>;
  createTransfer(input: CreateConnectedTransferInput): Promise<CreateConnectedTransferResult>;
  cancelWithReversal(input: CancelWithReversalInput): Promise<CancelWithReversalResult>;
}
