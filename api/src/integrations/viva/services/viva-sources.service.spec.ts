import { VivaSourcesService } from './viva-sources.service';
import { VivaAuthMode, VivaHost } from '../interfaces/viva-common.interface';

describe('VivaSourcesService', () => {
  let service: VivaSourcesService;
  let vivaHttpClient: { request: jest.Mock };

  beforeEach(() => {
    vivaHttpClient = { request: jest.fn().mockResolvedValue(undefined) };
    service = new VivaSourcesService(vivaHttpClient as any);
  });

  it('creates a source over Basic auth on the native host', async () => {
    const payload = {
      sourceCode: '1234',
      name: 'API test',
      domain: 'example.com',
    };

    await service.createSource(payload);

    expect(vivaHttpClient.request).toHaveBeenCalledWith({
      host: VivaHost.NATIVE,
      auth: VivaAuthMode.BASIC,
      method: 'POST',
      path: '/api/sources',
      data: payload,
    });
  });
});
