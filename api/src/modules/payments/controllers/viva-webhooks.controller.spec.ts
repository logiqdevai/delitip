import { VivaWebhooksController } from './viva-webhooks.controller';

describe('VivaWebhooksController', () => {
  let controller: VivaWebhooksController;
  let vivaWebhooksService: any;
  let paymentWebhooksService: any;

  beforeEach(() => {
    vivaWebhooksService = {
      getVerificationKey: jest.fn(),
      buildHandshakeResponse: jest.fn((key: string) => ({ Key: key })),
    };
    paymentWebhooksService = { process: jest.fn() };
    controller = new VivaWebhooksController(vivaWebhooksService, paymentWebhooksService);
  });

  describe('getHandshake', () => {
    // Regression test: Viva's real response uses a capitalized `Key` field
    // (confirmed against developer.viva.com's own example payload). An
    // earlier version of this controller destructured lowercase `key`,
    // which was always undefined, silently echoing `{}` back to Viva and
    // failing webhook URL verification in the merchant portal.
    it('echoes back the capitalized Key field from Viva', async () => {
      vivaWebhooksService.getVerificationKey.mockResolvedValue({ Key: 'abc123' });

      const result = await controller.getHandshake();

      expect(vivaWebhooksService.buildHandshakeResponse).toHaveBeenCalledWith('abc123');
      expect(result).toEqual({ Key: 'abc123' });
    });
  });

  describe('handleWebhook', () => {
    it('processes the payload and always acks', async () => {
      const payload = { EventTypeId: 1796, MessageId: 'm1' };

      const result = await controller.handleWebhook(payload as any);

      expect(paymentWebhooksService.process).toHaveBeenCalledWith(payload);
      expect(result).toEqual({ received: true });
    });
  });
});
