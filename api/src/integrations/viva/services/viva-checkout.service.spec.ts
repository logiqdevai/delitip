import { VivaCheckoutService } from './viva-checkout.service';
import { VivaAuthMode, VivaHost } from '../interfaces/viva-common.interface';

describe('VivaCheckoutService', () => {
  let service: VivaCheckoutService;
  let vivaHttpClient: { request: jest.Mock };

  beforeEach(() => {
    vivaHttpClient = { request: jest.fn() };
    service = new VivaCheckoutService(vivaHttpClient as any);
  });

  it('creates a v2 payment order over OAuth2 on the api host', async () => {
    vivaHttpClient.request.mockResolvedValue({ orderCode: 123 });

    const result = await service.createOrder({ amount: 1000 });

    expect(vivaHttpClient.request).toHaveBeenCalledWith({
      host: VivaHost.API,
      auth: VivaAuthMode.OAUTH2,
      method: 'POST',
      path: '/checkout/v2/orders',
      data: { amount: 1000 },
    });
    expect(result).toEqual({ orderCode: 123 });
  });

  it('retrieves an order over Basic auth on the native host', async () => {
    vivaHttpClient.request.mockResolvedValue({ OrderCode: 123, StateId: 3 });

    const result = await service.getOrder(123);

    expect(vivaHttpClient.request).toHaveBeenCalledWith({
      host: VivaHost.NATIVE,
      auth: VivaAuthMode.BASIC,
      method: 'GET',
      path: '/api/orders/123',
    });
    expect(result).toEqual({ OrderCode: 123, StateId: 3 });
  });

  it('cancels an order', async () => {
    vivaHttpClient.request.mockResolvedValue({ Success: true, ErrorCode: 0 });

    const result = await service.cancelOrder(123);

    expect(vivaHttpClient.request).toHaveBeenCalledWith({
      host: VivaHost.NATIVE,
      auth: VivaAuthMode.BASIC,
      method: 'DELETE',
      path: '/api/orders/123',
    });
    expect(result).toEqual({ Success: true, ErrorCode: 0 });
  });

  it('updates an order', async () => {
    vivaHttpClient.request.mockResolvedValue(undefined);

    await service.updateOrder(123, { isCanceled: true });

    expect(vivaHttpClient.request).toHaveBeenCalledWith({
      host: VivaHost.NATIVE,
      auth: VivaAuthMode.BASIC,
      method: 'PATCH',
      path: '/api/orders/123',
      data: { isCanceled: true },
    });
  });

  it('retrieves the fees for an order/amount pair', async () => {
    vivaHttpClient.request.mockResolvedValue({ Fee: 100, Success: true });

    const result = await service.getOrderFees(123, 5000);

    expect(vivaHttpClient.request).toHaveBeenCalledWith({
      host: VivaHost.NATIVE,
      auth: VivaAuthMode.BASIC,
      method: 'GET',
      path: '/api/fees/123/5000',
    });
    expect(result).toEqual({ Fee: 100, Success: true });
  });
});
