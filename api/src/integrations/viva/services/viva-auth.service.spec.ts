import axios from 'axios';
import { VivaAuthService } from './viva-auth.service';
import { VivaConfig } from '../viva.config';
import { VivaOAuthScope } from '../interfaces/viva-common.interface';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('VivaAuthService', () => {
  let service: VivaAuthService;
  let vivaConfig: jest.Mocked<VivaConfig>;

  beforeEach(() => {
    jest.clearAllMocks();
    vivaConfig = {
      getAccountsBaseUrl: jest
        .fn()
        .mockReturnValue('https://demo-accounts.vivapayments.com'),
      getClientId: jest.fn().mockReturnValue('client_id'),
      getClientSecret: jest.fn().mockReturnValue('client_secret'),
    } as any;
    service = new VivaAuthService(vivaConfig);
  });

  it('requests a token using client-credentials Basic auth against the accounts host', async () => {
    mockedAxios.post.mockResolvedValue({
      data: { access_token: 'token_1', token_type: 'Bearer', expires_in: 3600 },
    });

    const token = await service.getAccessToken();

    expect(token).toBe('token_1');
    expect(mockedAxios.post).toHaveBeenCalledWith(
      'https://demo-accounts.vivapayments.com/connect/token',
      'grant_type=client_credentials',
      expect.objectContaining({
        auth: { username: 'client_id', password: 'client_secret' },
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }),
    );
  });

  it('caches the token and does not request a new one before it expires', async () => {
    mockedAxios.post.mockResolvedValue({
      data: { access_token: 'token_1', token_type: 'Bearer', expires_in: 3600 },
    });

    await service.getAccessToken();
    await service.getAccessToken();

    expect(mockedAxios.post).toHaveBeenCalledTimes(1);
  });

  it('shares a single in-flight refresh across concurrent callers', async () => {
    let resolveRequest: (value: any) => void;
    mockedAxios.post.mockReturnValue(
      new Promise((resolve) => {
        resolveRequest = resolve;
      }) as any,
    );

    const first = service.getAccessToken();
    const second = service.getAccessToken();

    resolveRequest!({
      data: { access_token: 'token_1', token_type: 'Bearer', expires_in: 3600 },
    });

    await Promise.all([first, second]);

    expect(mockedAxios.post).toHaveBeenCalledTimes(1);
  });

  it('throws when OAuth2 credentials are not configured', async () => {
    vivaConfig.getClientId.mockReturnValue(undefined);

    await expect(service.getAccessToken()).rejects.toThrow(
      'Viva OAuth2 credentials',
    );
  });

  describe('per-scope token isolation', () => {
    it('requests separate tokens for CHECKOUT and ACCOUNT_TRANSACTIONS using each scope\'s own client credentials', async () => {
      vivaConfig.getClientId.mockImplementation(
        (scope?: string) =>
          scope === VivaOAuthScope.ACCOUNT_TRANSACTIONS ? 'at_client_id' : 'checkout_client_id',
      );
      vivaConfig.getClientSecret.mockImplementation(
        (scope?: string) =>
          scope === VivaOAuthScope.ACCOUNT_TRANSACTIONS ? 'at_secret' : 'checkout_secret',
      );
      mockedAxios.post
        .mockResolvedValueOnce({
          data: { access_token: 'checkout_token', token_type: 'Bearer', expires_in: 3600 },
        })
        .mockResolvedValueOnce({
          data: { access_token: 'account_transactions_token', token_type: 'Bearer', expires_in: 3600 },
        });

      const checkoutToken = await service.getAccessToken(VivaOAuthScope.CHECKOUT);
      const accountTransactionsToken = await service.getAccessToken(
        VivaOAuthScope.ACCOUNT_TRANSACTIONS,
      );

      expect(checkoutToken).toBe('checkout_token');
      expect(accountTransactionsToken).toBe('account_transactions_token');
      expect(mockedAxios.post).toHaveBeenCalledTimes(2);
      expect(mockedAxios.post).toHaveBeenNthCalledWith(
        1,
        expect.any(String),
        expect.any(String),
        expect.objectContaining({ auth: { username: 'checkout_client_id', password: 'checkout_secret' } }),
      );
      expect(mockedAxios.post).toHaveBeenNthCalledWith(
        2,
        expect.any(String),
        expect.any(String),
        expect.objectContaining({ auth: { username: 'at_client_id', password: 'at_secret' } }),
      );
    });

    it('caches each scope independently — fetching one does not force a refetch of the other', async () => {
      mockedAxios.post.mockResolvedValue({
        data: { access_token: 'token_1', token_type: 'Bearer', expires_in: 3600 },
      });

      await service.getAccessToken(VivaOAuthScope.CHECKOUT);
      await service.getAccessToken(VivaOAuthScope.CHECKOUT);
      await service.getAccessToken(VivaOAuthScope.ACCOUNT_TRANSACTIONS);
      await service.getAccessToken(VivaOAuthScope.ACCOUNT_TRANSACTIONS);

      expect(mockedAxios.post).toHaveBeenCalledTimes(2);
    });
  });
});
