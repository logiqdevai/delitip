import { createHmac } from 'crypto';
import { VivaWebhooksService } from './viva-webhooks.service';
import { VivaAuthMode, VivaHost } from '../interfaces/viva-common.interface';

describe('VivaWebhooksService', () => {
  let service: VivaWebhooksService;
  let vivaHttpClient: { request: jest.Mock };

  beforeEach(() => {
    vivaHttpClient = { request: jest.fn() };
    service = new VivaWebhooksService(vivaHttpClient as any);
  });

  describe('getVerificationKey', () => {
    it('fetches the key from the native host using Basic auth', async () => {
      vivaHttpClient.request.mockResolvedValue({ Key: 'verification_key' });

      const result = await service.getVerificationKey();

      expect(vivaHttpClient.request).toHaveBeenCalledWith({
        host: VivaHost.NATIVE,
        auth: VivaAuthMode.BASIC,
        method: 'GET',
        path: '/api/messages/config/token',
      });
      expect(result).toEqual({ Key: 'verification_key' });
    });
  });

  describe('buildHandshakeResponse', () => {
    it('wraps the key under a capitalized Key field', () => {
      expect(service.buildHandshakeResponse('abc')).toEqual({ Key: 'abc' });
    });
  });

  describe('verifySignature', () => {
    const secret = 'shhh';
    const body = JSON.stringify({ requestId: '1' });

    it('accepts a signature matching the HMAC-SHA256 digest of the body', () => {
      const signature = createHmac('sha256', secret).update(body).digest('hex');

      expect(service.verifySignature(body, signature, secret)).toBe(true);
    });

    it('accepts a signature matching the HMAC-SHA1 digest when explicitly requested', () => {
      const signature = createHmac('sha1', secret).update(body).digest('hex');

      expect(service.verifySignature(body, signature, secret, 'sha1')).toBe(
        true,
      );
    });

    it('rejects a tampered body', () => {
      const signature = createHmac('sha256', secret).update(body).digest('hex');

      expect(
        service.verifySignature(body + 'tampered', signature, secret),
      ).toBe(false);
    });

    it('rejects a signature of a different length without throwing', () => {
      expect(service.verifySignature(body, 'deadbeef', secret)).toBe(false);
    });

    it('rejects a missing signature', () => {
      expect(service.verifySignature(body, '', secret)).toBe(false);
    });
  });
});
