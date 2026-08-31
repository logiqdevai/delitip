import { VivaRfCodesService } from './viva-rf-codes.service';
import { VivaAuthMode, VivaHost } from '../interfaces/viva-common.interface';

describe('VivaRfCodesService', () => {
  let service: VivaRfCodesService;
  let vivaHttpClient: { request: jest.Mock };

  beforeEach(() => {
    vivaHttpClient = { request: jest.fn().mockResolvedValue(undefined) };
    service = new VivaRfCodesService(vivaHttpClient as any);
  });

  it('generates an RF code with no authentication', async () => {
    await service.generateRfCode({ orderCode: '3097103021072605' });

    expect(vivaHttpClient.request).toHaveBeenCalledWith({
      host: VivaHost.NATIVE,
      auth: VivaAuthMode.NONE,
      method: 'POST',
      path: '/web2/checkout/v2/paymentsessions',
      data: { orderCode: '3097103021072605' },
    });
  });
});
