import { VivaConnectedAccountsAdapter } from './viva-connected-accounts.adapter';

describe('VivaConnectedAccountsAdapter', () => {
  let adapter: VivaConnectedAccountsAdapter;
  let vivaMarketplace: {
    createConnectedAccount: jest.Mock;
    getConnectedAccount: jest.Mock;
    createTransfer: jest.Mock;
    cancelTransaction: jest.Mock;
  };
  let vivaConfig: { getMarketplacePartnerName: jest.Mock; getMarketplaceLogoUrl: jest.Mock };

  beforeEach(() => {
    vivaMarketplace = {
      createConnectedAccount: jest.fn(),
      getConnectedAccount: jest.fn(),
      createTransfer: jest.fn(),
      cancelTransaction: jest.fn(),
    };
    vivaConfig = {
      getMarketplacePartnerName: jest.fn().mockReturnValue('Delitip'),
      getMarketplaceLogoUrl: jest.fn().mockReturnValue('https://delitip.com/logo.png'),
    };
    adapter = new VivaConnectedAccountsAdapter(vivaMarketplace as any, vivaConfig as any);
  });

  describe('createConnectedAccount', () => {
    it('sends platform branding and maps the invitation redirectUrl to onboardingUrl', async () => {
      vivaMarketplace.createConnectedAccount.mockResolvedValue({
        accountId: 'acc_1',
        invitation: { redirectUrl: 'https://onboard' },
      });

      const result = await adapter.createConnectedAccount({
        email: 'a@b.com',
        returnUrl: 'https://return',
        legalName: 'Store LLC',
      });

      expect(vivaMarketplace.createConnectedAccount).toHaveBeenCalledWith({
        email: 'a@b.com',
        returnUrl: 'https://return',
        legalName: 'Store LLC',
        taxNumber: undefined,
        branding: { partnerName: 'Delitip', logoUrl: 'https://delitip.com/logo.png' },
      });
      expect(result).toEqual({ accountId: 'acc_1', onboardingUrl: 'https://onboard' });
    });

    it('throws when Viva does not return an accountId', async () => {
      vivaMarketplace.createConnectedAccount.mockResolvedValue({});

      await expect(
        adapter.createConnectedAccount({ email: 'a@b.com', returnUrl: 'https://return' }),
      ).rejects.toThrow();
    });
  });

  describe('getConnectedAccountStatus', () => {
    it('maps verified/acquiringEnabled to verified/payoutsEnabled', async () => {
      vivaMarketplace.getConnectedAccount.mockResolvedValue({ verified: true, acquiringEnabled: false });

      const result = await adapter.getConnectedAccountStatus('acc_1');

      expect(vivaMarketplace.getConnectedAccount).toHaveBeenCalledWith('acc_1');
      expect(result).toEqual({ verified: true, payoutsEnabled: false });
    });

    it('defaults both flags to false when Viva omits them', async () => {
      vivaMarketplace.getConnectedAccount.mockResolvedValue({});

      const result = await adapter.getConnectedAccountStatus('acc_1');

      expect(result).toEqual({ verified: false, payoutsEnabled: false });
    });
  });

  describe('createTransfer', () => {
    it('creates a transfer and returns its id', async () => {
      vivaMarketplace.createTransfer.mockResolvedValue({ transferId: 'tr_1' });

      const result = await adapter.createTransfer({
        connectedAccountId: 'acc_1',
        amount: 500,
        transactionId: 'txn_1',
        description: 'Delitip tip payout',
      });

      expect(vivaMarketplace.createTransfer).toHaveBeenCalledWith({
        amount: 500,
        connectedAccountId: 'acc_1',
        transactionId: 'txn_1',
        description: 'Delitip tip payout',
      });
      expect(result).toEqual({ transferId: 'tr_1' });
    });

    it('throws when Viva does not return a transferId', async () => {
      vivaMarketplace.createTransfer.mockResolvedValue({});

      await expect(adapter.createTransfer({ connectedAccountId: 'acc_1', amount: 500 })).rejects.toThrow();
    });
  });

  describe('cancelWithReversal', () => {
    it('cancels the transaction with reversal/fee flags', async () => {
      vivaMarketplace.cancelTransaction.mockResolvedValue({ transactionId: 'txn_1' });

      const result = await adapter.cancelWithReversal({
        transactionId: 'txn_1',
        amount: 500,
        reverseTransfers: true,
        refundPlatformFee: true,
      });

      expect(vivaMarketplace.cancelTransaction).toHaveBeenCalledWith('txn_1', {
        amount: 500,
        reverseTransfers: true,
        refundPlatformFee: true,
      });
      expect(result).toEqual({ transactionId: 'txn_1' });
    });
  });
});
