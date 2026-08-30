import axios from 'axios';
import { VivaHttpClient } from './viva-http.client';
import { VivaApiException } from './viva-api.exception';
import { VivaConfig } from '../viva.config';
import { VivaAuthService } from '../services/viva-auth.service';
import { VivaAuthMode, VivaHost } from '../interfaces/viva-common.interface';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('VivaHttpClient', () => {
  let client: VivaHttpClient;
  let vivaConfig: jest.Mocked<VivaConfig>;
  let vivaAuthService: jest.Mocked<VivaAuthService>;

  beforeEach(() => {
    jest.clearAllMocks();
    vivaConfig = {
      getAccountsBaseUrl: jest
        .fn()
        .mockReturnValue('https://demo-accounts.vivapayments.com'),
      getApiBaseUrl: jest
        .fn()
        .mockReturnValue('https://demo-api.vivapayments.com'),
      getNativeBaseUrl: jest
        .fn()
        .mockReturnValue('https://demo.vivapayments.com'),
      getBasicAuthHeader: jest.fn().mockReturnValue('Basic dGVzdA=='),
    } as any;
    vivaAuthService = {
      getAccessToken: jest.fn().mockResolvedValue('token_1'),
    } as any;
    client = new VivaHttpClient(vivaConfig, vivaAuthService);
  });

  it('resolves the "api" host and injects a Bearer token for OAuth2-secured calls', async () => {
    mockedAxios.request.mockResolvedValue({ data: { ok: true } });

    const result = await client.request({
      host: VivaHost.API,
      auth: VivaAuthMode.OAUTH2,
      method: 'GET',
      path: '/foo',
    });

    expect(result).toEqual({ ok: true });
    expect(mockedAxios.request).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: 'https://demo-api.vivapayments.com',
        url: '/foo',
        method: 'GET',
        headers: expect.objectContaining({ Authorization: 'Bearer token_1' }),
      }),
    );
  });

  it('resolves the "native" host and injects a Basic auth header for Basic-secured calls', async () => {
    mockedAxios.request.mockResolvedValue({ data: { ok: true } });

    await client.request({
      host: VivaHost.NATIVE,
      auth: VivaAuthMode.BASIC,
      method: 'POST',
      path: '/api/sources',
      data: { name: 'x' },
    });

    expect(mockedAxios.request).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: 'https://demo.vivapayments.com',
        headers: expect.objectContaining({
          Authorization: 'Basic dGVzdA==',
          'Content-Type': 'application/json',
        }),
      }),
    );
    expect(vivaAuthService.getAccessToken).not.toHaveBeenCalled();
  });

  it('sends no Authorization header when auth mode is none', async () => {
    mockedAxios.request.mockResolvedValue({ data: { ok: true } });

    await client.request({
      host: VivaHost.NATIVE,
      auth: VivaAuthMode.NONE,
      method: 'POST',
      path: '/x',
    });

    const call = mockedAxios.request.mock.calls[0][0] as any;
    expect(call.headers.Authorization).toBeUndefined();
  });

  it('normalizes an upstream error response into a VivaApiException', async () => {
    mockedAxios.request.mockRejectedValue({
      response: { status: 400, data: { message: 'Invalid amount' } },
      message: 'Request failed with status code 400',
    });

    await expect(
      client.request({
        host: VivaHost.API,
        auth: VivaAuthMode.OAUTH2,
        method: 'POST',
        path: '/checkout/v2/orders',
      }),
    ).rejects.toMatchObject({
      status: 400,
      response: { message: 'Invalid amount' },
    });
  });

  it('falls back to the ErrorText field used by native checkout v1 responses', async () => {
    mockedAxios.request.mockRejectedValue({
      response: {
        status: 400,
        data: { ErrorCode: 1008, ErrorText: 'Invalid TransactionId' },
      },
      message: 'Request failed with status code 400',
    });

    await expect(
      client.request({
        host: VivaHost.NATIVE,
        auth: VivaAuthMode.BASIC,
        method: 'POST',
        path: '/api/transactions/1',
      }),
    ).rejects.toThrow(VivaApiException);
  });

  it('maps a network failure (no response) to a 502', async () => {
    mockedAxios.request.mockRejectedValue({ message: 'connect ECONNREFUSED' });

    await expect(
      client.request({
        host: VivaHost.API,
        auth: VivaAuthMode.OAUTH2,
        method: 'GET',
        path: '/foo',
      }),
    ).rejects.toMatchObject({ status: 502 });
  });
});
