import { VivaResellersService } from './viva-resellers.service';
import { VivaAuthMode, VivaHost } from '../interfaces/viva-common.interface';

describe('VivaResellersService', () => {
  let service: VivaResellersService;
  let vivaHttpClient: { request: jest.Mock };

  beforeEach(() => {
    vivaHttpClient = { request: jest.fn() };
    service = new VivaResellersService(vivaHttpClient as any);
  });

  describe('validateCashPayment', () => {
    it('checks cash payment eligibility over OAuth2 on the api host', async () => {
      vivaHttpClient.request.mockResolvedValue(undefined);

      await service.validateCashPayment({ phone: '2101234567', amount: 1000 });

      expect(vivaHttpClient.request).toHaveBeenCalledWith({
        host: VivaHost.API,
        auth: VivaAuthMode.OAUTH2,
        method: 'POST',
        path: '/resellers/v1/transactions/cashPayments:validate',
        data: { phone: '2101234567', amount: 1000 },
      });
    });
  });

  describe('validateBillPayment', () => {
    it('checks bill payment eligibility', async () => {
      vivaHttpClient.request.mockResolvedValue(undefined);

      await service.validateBillPayment({ phone: '2101234567', amount: 1000 });

      expect(vivaHttpClient.request).toHaveBeenCalledWith({
        host: VivaHost.API,
        auth: VivaAuthMode.OAUTH2,
        method: 'POST',
        path: '/resellers/v1/transactions/billPayments:validate',
        data: { phone: '2101234567', amount: 1000 },
      });
    });
  });

  describe('resendCashPaymentOtp', () => {
    it('sends phone/countryCode as query params', async () => {
      vivaHttpClient.request.mockResolvedValue(undefined);

      await service.resendCashPaymentOtp('2101234567', 'GR');

      expect(vivaHttpClient.request).toHaveBeenCalledWith({
        host: VivaHost.API,
        auth: VivaAuthMode.OAUTH2,
        method: 'POST',
        path: '/resellers/v1/transactions/cashPayments:sendotp',
        query: { phone: '2101234567', countryCode: 'GR' },
      });
    });
  });

  describe('resendBillPaymentOtp', () => {
    it('sends phone/countryCode as query params', async () => {
      vivaHttpClient.request.mockResolvedValue(undefined);

      await service.resendBillPaymentOtp('2101234567');

      expect(vivaHttpClient.request).toHaveBeenCalledWith({
        host: VivaHost.API,
        auth: VivaAuthMode.OAUTH2,
        method: 'POST',
        path: '/resellers/v1/transactions/billPayments:sendotp',
        query: { phone: '2101234567', countryCode: undefined },
      });
    });
  });

  describe('createCashPayment', () => {
    it('creates a cash payment and returns the fee breakdown', async () => {
      vivaHttpClient.request.mockResolvedValue({
        transactionId: 'tx_1',
        totalFee: 5,
      });

      const result = await service.createCashPayment({
        phone: '2101234567',
        amount: 1000,
        orderCode: 123,
      });

      expect(vivaHttpClient.request).toHaveBeenCalledWith({
        host: VivaHost.API,
        auth: VivaAuthMode.OAUTH2,
        method: 'POST',
        path: '/resellers/v1/transactions/cashPayments',
        data: { phone: '2101234567', amount: 1000, orderCode: 123 },
      });
      expect(result).toEqual({ transactionId: 'tx_1', totalFee: 5 });
    });
  });

  describe('createBillPayment', () => {
    it('creates a bill payment and returns the fee breakdown', async () => {
      vivaHttpClient.request.mockResolvedValue({
        transactionId: 'tx_1',
        billFee: 2,
      });

      const result = await service.createBillPayment({
        billId: 1,
        amount: 1000,
      });

      expect(vivaHttpClient.request).toHaveBeenCalledWith({
        host: VivaHost.API,
        auth: VivaAuthMode.OAUTH2,
        method: 'POST',
        path: '/resellers/v1/transactions/billPayments',
        data: { billId: 1, amount: 1000 },
      });
      expect(result).toEqual({ transactionId: 'tx_1', billFee: 2 });
    });
  });

  describe('createOrder', () => {
    it('creates a reseller order and returns the order/RF codes', async () => {
      vivaHttpClient.request.mockResolvedValue({
        orderCode: 123,
        rfPaymentCode: 'RF123',
      });

      const result = await service.createOrder({
        amount: 1000,
        targetWalletId: 55,
      });

      expect(vivaHttpClient.request).toHaveBeenCalledWith({
        host: VivaHost.API,
        auth: VivaAuthMode.OAUTH2,
        method: 'POST',
        path: '/resellers/v1/orders',
        data: { amount: 1000, targetWalletId: 55 },
      });
      expect(result).toEqual({ orderCode: 123, rfPaymentCode: 'RF123' });
    });
  });
});
