import { VivaMarketplaceService } from './viva-marketplace.service';
import { VivaAuthMode, VivaHost } from '../interfaces/viva-common.interface';

describe('VivaMarketplaceService', () => {
  let service: VivaMarketplaceService;
  let vivaHttpClient: { request: jest.Mock };

  beforeEach(() => {
    vivaHttpClient = { request: jest.fn() };
    service = new VivaMarketplaceService(vivaHttpClient as any);
  });

  describe('createConnectedAccount', () => {
    it('creates a connected account over OAuth2 on the api host', async () => {
      vivaHttpClient.request.mockResolvedValue({
        accountId: 'acc_1',
        invitation: { url: 'https://x' },
      });

      const payload = {
        email: 'a@b.com',
        returnUrl: 'https://return',
        branding: { name: 'Store' },
      };
      const result = await service.createConnectedAccount(payload);

      expect(vivaHttpClient.request).toHaveBeenCalledWith({
        host: VivaHost.API,
        auth: VivaAuthMode.OAUTH2,
        method: 'POST',
        path: '/platforms/v1/accounts',
        data: payload,
      });
      expect(result).toEqual({
        accountId: 'acc_1',
        invitation: { url: 'https://x' },
      });
    });
  });

  describe('getConnectedAccount', () => {
    it('retrieves a connected account by id', async () => {
      vivaHttpClient.request.mockResolvedValue({
        accountId: 'acc_1',
        verified: true,
      });

      const result = await service.getConnectedAccount('acc_1');

      expect(vivaHttpClient.request).toHaveBeenCalledWith({
        host: VivaHost.API,
        auth: VivaAuthMode.OAUTH2,
        method: 'GET',
        path: '/platforms/v1/accounts/acc_1',
      });
      expect(result).toEqual({ accountId: 'acc_1', verified: true });
    });
  });

  describe('updateConnectedAccount', () => {
    it('patches connected account payout attributes', async () => {
      vivaHttpClient.request.mockResolvedValue(undefined);

      await service.updateConnectedAccount('acc_1', {
        payouts: { iban: 'GR1234' },
      });

      expect(vivaHttpClient.request).toHaveBeenCalledWith({
        host: VivaHost.API,
        auth: VivaAuthMode.OAUTH2,
        method: 'PATCH',
        path: '/platforms/v1/accounts/acc_1',
        data: { payouts: { iban: 'GR1234' } },
      });
    });
  });

  describe('createTransfer', () => {
    it('sends funds to a connected account', async () => {
      vivaHttpClient.request.mockResolvedValue({
        transferId: 'tr_1',
        executed: '2026-01-01',
      });

      const payload = { amount: 1000, connectedAccountId: 'acc_1' };
      const result = await service.createTransfer(payload);

      expect(vivaHttpClient.request).toHaveBeenCalledWith({
        host: VivaHost.API,
        auth: VivaAuthMode.OAUTH2,
        method: 'POST',
        path: '/platforms/v1/transfers',
        data: payload,
      });
      expect(result).toEqual({ transferId: 'tr_1', executed: '2026-01-01' });
    });
  });

  describe('reverseTransfer', () => {
    it('posts to the :reverse path for the given transfer', async () => {
      vivaHttpClient.request.mockResolvedValue({
        transferId: 'tr_1',
        executed: '2026-01-01',
      });

      const result = await service.reverseTransfer('tr_1', { amount: 500 });

      expect(vivaHttpClient.request).toHaveBeenCalledWith({
        host: VivaHost.API,
        auth: VivaAuthMode.OAUTH2,
        method: 'POST',
        path: '/platforms/v1/transfers/tr_1:reverse',
        data: { amount: 500 },
      });
      expect(result).toEqual({ transferId: 'tr_1', executed: '2026-01-01' });
    });
  });

  describe('createMarketplaceOrder', () => {
    it('creates a marketplace-aware payment order', async () => {
      vivaHttpClient.request.mockResolvedValue({ orderCode: 123 });

      const payload = {
        amount: 1000,
        transfer: { amount: 100, connectedAccountId: 'acc_1' },
      };
      const result = await service.createMarketplaceOrder(payload);

      expect(vivaHttpClient.request).toHaveBeenCalledWith({
        host: VivaHost.API,
        auth: VivaAuthMode.OAUTH2,
        method: 'POST',
        path: '/checkout/v2/orders',
        data: payload,
      });
      expect(result).toEqual({ orderCode: 123 });
    });
  });

  describe('cancelTransaction', () => {
    it('cancels a marketplace transaction with reverseTransfers/refundPlatformFee query params', async () => {
      vivaHttpClient.request.mockResolvedValue({ transactionId: 'txn_1' });

      const query = {
        amount: 1000,
        reverseTransfers: true,
        refundPlatformFee: true,
      };
      const result = await service.cancelTransaction('txn_1', query);

      expect(vivaHttpClient.request).toHaveBeenCalledWith({
        host: VivaHost.API,
        auth: VivaAuthMode.OAUTH2,
        method: 'DELETE',
        path: '/acquiring/v1/transactions/txn_1',
        query,
      });
      expect(result).toEqual({ transactionId: 'txn_1' });
    });
  });
});
