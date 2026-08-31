import { VivaBankTransfersService } from './viva-bank-transfers.service';
import { VivaAuthMode, VivaHost } from '../interfaces/viva-common.interface';

describe('VivaBankTransfersService', () => {
  let service: VivaBankTransfersService;
  let vivaHttpClient: { request: jest.Mock };

  beforeEach(() => {
    vivaHttpClient = { request: jest.fn() };
    service = new VivaBankTransfersService(vivaHttpClient as any);
  });

  describe('linkBankAccount', () => {
    it('links a bank account over OAuth2 on the api host', async () => {
      vivaHttpClient.request.mockResolvedValue({ bankAccountId: 'ba_1' });

      const payload = { iban: 'GR1234567890', beneficiaryName: 'John Doe' };
      const result = await service.linkBankAccount(payload);

      expect(vivaHttpClient.request).toHaveBeenCalledWith({
        host: VivaHost.API,
        auth: VivaAuthMode.OAUTH2,
        method: 'POST',
        path: '/banktransfers/v1/bankaccounts',
        data: payload,
      });
      expect(result).toEqual({ bankAccountId: 'ba_1' });
    });
  });

  describe('listBankAccounts', () => {
    it('passes the filter query params', async () => {
      vivaHttpClient.request.mockResolvedValue([{ bankAccountId: 'ba_1' }]);

      const result = await service.listBankAccounts({
        isArchived: false,
        maxResults: 10,
      });

      expect(vivaHttpClient.request).toHaveBeenCalledWith({
        host: VivaHost.API,
        auth: VivaAuthMode.OAUTH2,
        method: 'GET',
        path: '/banktransfers/v1/bankaccounts',
        query: { isArchived: false, maxResults: 10 },
      });
      expect(result).toEqual([{ bankAccountId: 'ba_1' }]);
    });
  });

  describe('getBankAccount', () => {
    it('retrieves a bank account by id', async () => {
      vivaHttpClient.request.mockResolvedValue({ bankAccountId: 'ba_1' });

      const result = await service.getBankAccount('ba_1');

      expect(vivaHttpClient.request).toHaveBeenCalledWith({
        host: VivaHost.API,
        auth: VivaAuthMode.OAUTH2,
        method: 'GET',
        path: '/banktransfers/v1/bankaccounts/ba_1',
      });
      expect(result).toEqual({ bankAccountId: 'ba_1' });
    });
  });

  describe('updateBankAccount', () => {
    it('updates the archive status and metadata', async () => {
      vivaHttpClient.request.mockResolvedValue({
        bankAccountId: 'ba_1',
        isArchived: true,
      });

      const result = await service.updateBankAccount('ba_1', { archive: true });

      expect(vivaHttpClient.request).toHaveBeenCalledWith({
        host: VivaHost.API,
        auth: VivaAuthMode.OAUTH2,
        method: 'PATCH',
        path: '/banktransfers/v1/bankaccounts/ba_1',
        data: { archive: true },
      });
      expect(result).toEqual({ bankAccountId: 'ba_1', isArchived: true });
    });
  });

  describe('getInstructionTypes', () => {
    it('passes the required amount query param', async () => {
      vivaHttpClient.request.mockResolvedValue({
        supportsInstant: true,
        instructionTypes: [1, 2],
      });

      const result = await service.getInstructionTypes('ba_1', 5000);

      expect(vivaHttpClient.request).toHaveBeenCalledWith({
        host: VivaHost.API,
        auth: VivaAuthMode.OAUTH2,
        method: 'GET',
        path: '/banktransfers/v1/bankaccounts/ba_1/instructiontypes',
        query: { amount: 5000 },
      });
      expect(result).toEqual({
        supportsInstant: true,
        instructionTypes: [1, 2],
      });
    });
  });

  describe('createBankTransferFee', () => {
    it('creates a bank transfer fee command', async () => {
      vivaHttpClient.request.mockResolvedValue({
        fee: 1.5,
        bankCommandId: 'cmd_1',
      });

      const payload = { amount: 5000, walletId: 1, instructionType: [1] };
      const result = await service.createBankTransferFee('ba_1', payload);

      expect(vivaHttpClient.request).toHaveBeenCalledWith({
        host: VivaHost.API,
        auth: VivaAuthMode.OAUTH2,
        method: 'POST',
        path: '/banktransfers/v1/bankaccounts/ba_1/fees',
        data: payload,
      });
      expect(result).toEqual({ fee: 1.5, bankCommandId: 'cmd_1' });
    });
  });

  describe('executeBankTransfer', () => {
    it('sends the outgoing bank transfer using the literal :send path segment', async () => {
      vivaHttpClient.request.mockResolvedValue({
        walletTransactionId: 'wtx_1',
      });

      const payload = { amount: 5000, walletId: 1, bankCommandId: 'cmd_1' };
      const result = await service.executeBankTransfer('ba_1', payload);

      expect(vivaHttpClient.request).toHaveBeenCalledWith({
        host: VivaHost.API,
        auth: VivaAuthMode.OAUTH2,
        method: 'POST',
        path: '/banktransfers/v1/bankaccounts/ba_1:send',
        data: payload,
      });
      expect(result).toEqual({ walletTransactionId: 'wtx_1' });
    });
  });
});
