import { VivaDataServicesService } from './viva-data-services.service';
import { VivaAuthMode, VivaHost } from '../interfaces/viva-common.interface';

describe('VivaDataServicesService', () => {
  let service: VivaDataServicesService;
  let vivaHttpClient: { request: jest.Mock };

  beforeEach(() => {
    vivaHttpClient = { request: jest.fn() };
    service = new VivaDataServicesService(vivaHttpClient as any);
  });

  describe('getMt940Data', () => {
    it('fetches MT940 data for the given report date over OAuth2', async () => {
      vivaHttpClient.request.mockResolvedValue({ Response: 'MT940-RAW-DATA' });

      const result = await service.getMt940Data('2026-01-01');

      expect(vivaHttpClient.request).toHaveBeenCalledWith({
        host: VivaHost.API,
        auth: VivaAuthMode.OAUTH2,
        method: 'GET',
        path: '/dataservices/v2/merchants/mt940',
        query: { ReportDate: '2026-01-01' },
      });
      expect(result).toBe('MT940-RAW-DATA');
    });

    it('returns null when there is no data for the date (204 No Content)', async () => {
      vivaHttpClient.request.mockResolvedValue('');

      const result = await service.getMt940Data('2026-01-01');

      expect(result).toBeNull();
    });
  });

  describe('addWebhookSubscription', () => {
    it('adds a subscription over OAuth2', async () => {
      vivaHttpClient.request.mockResolvedValue({ subscriptionId: 'sub_1' });

      const payload = {
        url: 'https://www.myapi.com/webhooks/receive',
        secret: 'shhh',
        events: ['SaleTransactionsFileGenerated'],
      };
      const result = await service.addWebhookSubscription(payload);

      expect(vivaHttpClient.request).toHaveBeenCalledWith({
        host: VivaHost.API,
        auth: VivaAuthMode.OAUTH2,
        method: 'POST',
        path: '/dataservices/v1/webhooks/subscriptions',
        data: payload,
      });
      expect(result).toEqual({ subscriptionId: 'sub_1' });
    });
  });

  describe('updateWebhookSubscription', () => {
    it('updates a subscription by id', async () => {
      vivaHttpClient.request.mockResolvedValue({ subscriptionId: 'sub_1' });

      const payload = {
        url: 'https://www.myapi.com/webhooks/receive',
        secret: 'shhh',
        events: ['SaleTransactionsFileGenerated'],
      };
      await service.updateWebhookSubscription('sub_1', payload);

      expect(vivaHttpClient.request).toHaveBeenCalledWith({
        host: VivaHost.API,
        auth: VivaAuthMode.OAUTH2,
        method: 'PUT',
        path: '/dataservices/v1/webhooks/subscriptions/sub_1',
        data: payload,
      });
    });
  });

  describe('deleteWebhookSubscription', () => {
    it('deletes a subscription by id', async () => {
      vivaHttpClient.request.mockResolvedValue({ message: 'Deleted' });

      const result = await service.deleteWebhookSubscription('sub_1');

      expect(vivaHttpClient.request).toHaveBeenCalledWith({
        host: VivaHost.API,
        auth: VivaAuthMode.OAUTH2,
        method: 'DELETE',
        path: '/dataservices/v1/webhooks/subscriptions/sub_1',
      });
      expect(result).toEqual({ message: 'Deleted' });
    });
  });

  describe('listWebhookSubscriptions', () => {
    it('lists all subscriptions', async () => {
      vivaHttpClient.request.mockResolvedValue([
        {
          subscriptionId: 'sub_1',
          url: 'https://x',
          events: ['SaleTransactionsFileGenerated'],
        },
      ]);

      const result = await service.listWebhookSubscriptions();

      expect(vivaHttpClient.request).toHaveBeenCalledWith({
        host: VivaHost.API,
        auth: VivaAuthMode.OAUTH2,
        method: 'GET',
        path: '/dataservices/v1/webhooks/subscriptions/',
      });
      expect(result).toEqual([
        {
          subscriptionId: 'sub_1',
          url: 'https://x',
          events: ['SaleTransactionsFileGenerated'],
        },
      ]);
    });
  });

  describe('requestSaleTransactionsExport', () => {
    it('requests a sale transactions file export', async () => {
      vivaHttpClient.request.mockResolvedValue({ requestId: 'req_1' });

      const payload = { Date: '2026-01-01', FileType: 'csv' };
      const result = await service.requestSaleTransactionsExport(payload);

      expect(vivaHttpClient.request).toHaveBeenCalledWith({
        host: VivaHost.API,
        auth: VivaAuthMode.OAUTH2,
        method: 'POST',
        path: '/dataservices/v1/transactions/exports',
        data: payload,
      });
      expect(result).toEqual({ requestId: 'req_1' });
    });
  });

  describe('searchTransactions', () => {
    it('passes pagination query params and the search payload', async () => {
      vivaHttpClient.request.mockResolvedValue({
        currentPage: 1,
        pageSize: 50,
        data: [],
        links: [],
      });

      const payload = { insDateFrom: '2026-01-01', insDateTo: '2026-01-31' };
      const query = { Page: 1, PageSize: 50, OrderBy: 'Descending' as const };
      const result = await service.searchTransactions(payload, query);

      expect(vivaHttpClient.request).toHaveBeenCalledWith({
        host: VivaHost.API,
        auth: VivaAuthMode.OAUTH2,
        method: 'POST',
        path: '/dataservices/v2/transactions/Search',
        query,
        data: payload,
      });
      expect(result).toEqual({
        currentPage: 1,
        pageSize: 50,
        data: [],
        links: [],
      });
    });
  });
});
