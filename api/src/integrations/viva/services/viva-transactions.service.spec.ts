import { VivaTransactionsService } from './viva-transactions.service';
import { VivaAuthMode, VivaHost } from '../interfaces/viva-common.interface';

describe('VivaTransactionsService', () => {
  let service: VivaTransactionsService;
  let vivaHttpClient: { request: jest.Mock };

  beforeEach(() => {
    vivaHttpClient = { request: jest.fn() };
    service = new VivaTransactionsService(vivaHttpClient as any);
  });

  describe('getTransaction', () => {
    it('retrieves a checkout-v2 transaction over OAuth2 on the api host', async () => {
      vivaHttpClient.request.mockResolvedValue({
        orderCode: 123,
        statusId: 'F',
      });

      const result = await service.getTransaction('tx_1');

      expect(vivaHttpClient.request).toHaveBeenCalledWith({
        host: VivaHost.API,
        auth: VivaAuthMode.OAUTH2,
        method: 'GET',
        path: '/checkout/v2/transactions/tx_1',
      });
      expect(result).toEqual({ orderCode: 123, statusId: 'F' });
    });
  });

  describe('createCardToken', () => {
    it('creates a card token', async () => {
      vivaHttpClient.request.mockResolvedValue({ token: 'card_token_1' });

      const result = await service.createCardToken({ transactionId: 'tx_1' });

      expect(vivaHttpClient.request).toHaveBeenCalledWith({
        host: VivaHost.API,
        auth: VivaAuthMode.OAUTH2,
        method: 'POST',
        path: '/acquiring/v1/cards/tokens',
        data: { transactionId: 'tx_1' },
      });
      expect(result).toEqual({ token: 'card_token_1' });
    });
  });

  describe('increasePreauth', () => {
    it('posts to the :increasepreauth action path', async () => {
      vivaHttpClient.request.mockResolvedValue({ transactionId: 'tx_1' });

      const result = await service.increasePreauth('tx_1', { amount: 500 });

      expect(vivaHttpClient.request).toHaveBeenCalledWith({
        host: VivaHost.API,
        auth: VivaAuthMode.OAUTH2,
        method: 'POST',
        path: '/acquiring/v1/transactions/tx_1:increasepreauth',
        data: { amount: 500 },
      });
      expect(result).toEqual({ transactionId: 'tx_1' });
    });
  });

  describe('createTransaction', () => {
    it('creates a native checkout transaction over Basic auth', async () => {
      vivaHttpClient.request.mockResolvedValue({
        Success: true,
        TransactionId: 'tx_1',
      });

      const result = await service.createTransaction('order_1', {
        amount: 1000,
      });

      expect(vivaHttpClient.request).toHaveBeenCalledWith({
        host: VivaHost.NATIVE,
        auth: VivaAuthMode.BASIC,
        method: 'POST',
        path: '/api/transactions/order_1',
        data: { amount: 1000 },
      });
      expect(result).toEqual({ Success: true, TransactionId: 'tx_1' });
    });
  });

  describe('cancelTransaction', () => {
    it('sends the refund amount as a query param', async () => {
      vivaHttpClient.request.mockResolvedValue({ Success: true });

      const result = await service.cancelTransaction('tx_1', { amount: 500 });

      expect(vivaHttpClient.request).toHaveBeenCalledWith({
        host: VivaHost.NATIVE,
        auth: VivaAuthMode.BASIC,
        method: 'DELETE',
        path: '/api/transactions/tx_1',
        query: { amount: 500 },
      });
      expect(result).toEqual({ Success: true });
    });
  });

  describe('payout', () => {
    it('sends the OCT/Pay Out query params', async () => {
      vivaHttpClient.request.mockResolvedValue({ Success: true });

      const result = await service.payout('tx_1', {
        amount: 500,
        serviceId: 6,
        idempotencyKey: 'idem_1',
      });

      expect(vivaHttpClient.request).toHaveBeenCalledWith({
        host: VivaHost.NATIVE,
        auth: VivaAuthMode.BASIC,
        method: 'DELETE',
        path: '/api/transactions/tx_1',
        query: { amount: 500, serviceId: 6, idempotencyKey: 'idem_1' },
      });
      expect(result).toEqual({ Success: true });
    });
  });

  describe('cancelPartialAuthorization', () => {
    it('deletes a partial authorization over OAuth2', async () => {
      vivaHttpClient.request.mockResolvedValue(undefined);

      await service.cancelPartialAuthorization('tx_1', { amount: 500 });

      expect(vivaHttpClient.request).toHaveBeenCalledWith({
        host: VivaHost.API,
        auth: VivaAuthMode.OAUTH2,
        method: 'DELETE',
        path: '/acquiring/v1/transactions/tx_1',
        query: { amount: 500 },
      });
    });
  });

  describe('createRebate', () => {
    it('posts to the :rebate action path', async () => {
      vivaHttpClient.request.mockResolvedValue({ transactionId: 'rebate_1' });

      const result = await service.createRebate('tx_1', { amount: 200 });

      expect(vivaHttpClient.request).toHaveBeenCalledWith({
        host: VivaHost.API,
        auth: VivaAuthMode.OAUTH2,
        method: 'POST',
        path: '/acquiring/v1/transactions/tx_1:rebate',
        data: { amount: 200 },
      });
      expect(result).toEqual({ transactionId: 'rebate_1' });
    });
  });

  describe('createFastRefund', () => {
    it('posts to the :fastrefund action path', async () => {
      vivaHttpClient.request.mockResolvedValue({ transactionId: 'refund_1' });

      const result = await service.createFastRefund('tx_1', { amount: 200 });

      expect(vivaHttpClient.request).toHaveBeenCalledWith({
        host: VivaHost.API,
        auth: VivaAuthMode.OAUTH2,
        method: 'POST',
        path: '/acquiring/v1/transactions/tx_1:fastrefund',
        data: { amount: 200 },
      });
      expect(result).toEqual({ transactionId: 'refund_1' });
    });
  });

  describe('cancelRebateOrFastRefund', () => {
    it('deletes a rebate/fast refund over OAuth2', async () => {
      vivaHttpClient.request.mockResolvedValue(undefined);

      await service.cancelRebateOrFastRefund('tx_1', { amount: 200 });

      expect(vivaHttpClient.request).toHaveBeenCalledWith({
        host: VivaHost.API,
        auth: VivaAuthMode.OAUTH2,
        method: 'DELETE',
        path: '/acquiring/v1/transactions/tx_1',
        query: { amount: 200 },
      });
    });
  });
});
