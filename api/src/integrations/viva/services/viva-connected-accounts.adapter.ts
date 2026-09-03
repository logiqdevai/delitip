import { Injectable } from '@nestjs/common';
import { VivaConfig } from '../viva.config';
import { VivaMarketplaceService } from './viva-marketplace.service';
import {
  CancelWithReversalInput,
  CancelWithReversalResult,
  ConnectedAccountsProvider,
  ConnectedAccountStatus,
  CreateConnectedAccountInput,
  CreateConnectedAccountResult,
  CreateConnectedTransferInput,
  CreateConnectedTransferResult,
} from '@/shared/services/connected-accounts/connected-accounts-provider.interface';

// Adapts VivaMarketplaceService's raw Viva request/response shapes to the
// provider-agnostic ConnectedAccountsProvider interface — the only file that
// needs to change (plus a new sibling adapter + DI binding) if/when Stripe
// Connect is added as a second connected-accounts provider.
@Injectable()
export class VivaConnectedAccountsAdapter implements ConnectedAccountsProvider {
  constructor(
    private readonly vivaMarketplace: VivaMarketplaceService,
    private readonly vivaConfig: VivaConfig,
  ) {}

  async createConnectedAccount(input: CreateConnectedAccountInput): Promise<CreateConnectedAccountResult> {
    const response = await this.vivaMarketplace.createConnectedAccount({
      email: input.email,
      returnUrl: input.returnUrl,
      legalName: input.legalName,
      taxNumber: input.taxNumber,
      branding: {
        partnerName: this.vivaConfig.getMarketplacePartnerName(),
        logoUrl: this.vivaConfig.getMarketplaceLogoUrl(),
      },
    });

    if (!response.accountId) {
      throw new Error('Viva did not return an accountId for the created connected account');
    }

    return {
      accountId: response.accountId,
      onboardingUrl: response.invitation?.redirectUrl,
    };
  }

  async getConnectedAccountStatus(accountId: string): Promise<ConnectedAccountStatus> {
    const account = await this.vivaMarketplace.getConnectedAccount(accountId);
    return {
      verified: account.verified === true,
      payoutsEnabled: account.acquiringEnabled === true,
    };
  }

  async createTransfer(input: CreateConnectedTransferInput): Promise<CreateConnectedTransferResult> {
    const response = await this.vivaMarketplace.createTransfer({
      amount: input.amount,
      connectedAccountId: input.connectedAccountId,
      transactionId: input.transactionId,
      description: input.description,
    });

    if (!response.transferId) {
      throw new Error('Viva did not return a transferId for the created transfer');
    }

    return { transferId: response.transferId };
  }

  async cancelWithReversal(input: CancelWithReversalInput): Promise<CancelWithReversalResult> {
    const response = await this.vivaMarketplace.cancelTransaction(input.transactionId, {
      amount: input.amount,
      reverseTransfers: input.reverseTransfers,
      refundPlatformFee: input.refundPlatformFee,
    });

    return { transactionId: response.transactionId };
  }
}
