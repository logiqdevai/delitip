import { VivaWalletsService } from './viva-wallets.service';
import {
  VivaAuthMode,
  VivaHost,
  VivaOAuthScope,
} from '../interfaces/viva-common.interface';

describe('VivaWalletsService', () => {
  let service: VivaWalletsService;
  let vivaHttpClient: { request: jest.Mock };

  beforeEach(() => {
    vivaHttpClient = { request: jest.fn() };
    service = new VivaWalletsService(vivaHttpClient as any);
  });

  describe('transferBalance', () => {
    it('posts to the wallet/target-wallet path using Basic auth on the native host', async () => {
      vivaHttpClient.request.mockResolvedValue({
        DebitTransactionId: 1,
        CreditTransactionId: 2,
      });

      const result = await service.transferBalance(100, 200, { amount: 500 });

      expect(vivaHttpClient.request).toHaveBeenCalledWith({
        host: VivaHost.NATIVE,
        auth: VivaAuthMode.BASIC,
        method: 'POST',
        path: '/api/wallets/100/balancetransfer/200',
        data: { amount: 500 },
      });
      expect(result).toEqual({ DebitTransactionId: 1, CreditTransactionId: 2 });
    });
  });

  describe('getMerchantWallets', () => {
    it('fetches merchant wallets over OAuth2 on the api host', async () => {
      vivaHttpClient.request.mockResolvedValue([{ walletId: 1 }]);

      const result = await service.getMerchantWallets();

      expect(vivaHttpClient.request).toHaveBeenCalledWith({
        host: VivaHost.API,
        auth: VivaAuthMode.OAUTH2,
        oauthScope: VivaOAuthScope.ACCOUNT_TRANSACTIONS,
        method: 'GET',
        path: '/merchants/v1/wallets',
      });
      expect(result).toEqual([{ walletId: 1 }]);
    });
  });

  describe('searchAccountTransactions', () => {
    it('passes pagination query params and the search payload', async () => {
      vivaHttpClient.request.mockResolvedValue([
        { accountTransactionId: 'tx_1' },
      ]);

      const result = await service.searchAccountTransactions(
        { DateFrom: '2026-01-01', DateTo: '2026-01-31' },
        { Page: 1, PageSize: 100 },
      );

      expect(vivaHttpClient.request).toHaveBeenCalledWith({
        host: VivaHost.API,
        auth: VivaAuthMode.OAUTH2,
        oauthScope: VivaOAuthScope.ACCOUNT_TRANSACTIONS,
        method: 'POST',
        path: '/dataservices/v2/accounttransactions/Search',
        query: { Page: 1, PageSize: 100 },
        data: { DateFrom: '2026-01-01', DateTo: '2026-01-31' },
      });
      expect(result).toEqual([{ accountTransactionId: 'tx_1' }]);
    });

    it('normalizes a 204 "no content" result to an empty array', async () => {
      vivaHttpClient.request.mockResolvedValue('');

      const result = await service.searchAccountTransactions({
        DateFrom: '2026-01-01',
        DateTo: '2026-01-31',
      });

      expect(result).toEqual([]);
    });
  });
});
