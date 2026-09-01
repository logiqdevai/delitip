import { Body, Controller, Get, HttpCode, Post, UseGuards } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { VivaWebhooksService } from '@/integrations/viva/services/viva-webhooks.service';
import { PaymentWebhooksService } from '../services/payment-webhooks.service';
import { VivaWebhookPayloadDto } from '../dto/viva-webhook-payload.dto';
import { VivaIpAllowlistGuard } from '../guards/viva-ip-allowlist.guard';

// Not part of the public API surface (no auth token, Viva-only caller) —
// excluded from Swagger.
@ApiExcludeController()
@Controller('webhooks/viva')
export class VivaWebhooksController {
  constructor(
    private readonly vivaWebhooksService: VivaWebhooksService,
    private readonly paymentWebhooksService: PaymentWebhooksService,
  ) {}

  // One-time handshake Viva performs when a webhook URL is registered in
  // the merchant portal — it GETs this URL and expects the cached
  // verification key echoed back.
  @Get()
  async getHandshake() {
    const { Key } = await this.vivaWebhooksService.getVerificationKey();
    return this.vivaWebhooksService.buildHandshakeResponse(Key);
  }

  @Post()
  @HttpCode(200)
  @UseGuards(VivaIpAllowlistGuard)
  async handleWebhook(@Body() payload: VivaWebhookPayloadDto) {
    // Always ack fast — processing errors are recorded on the WebhookEvent
    // row for follow-up, not surfaced as a non-2xx (which would just queue
    // up Viva's 24x hourly retry loop for a bug that retrying won't fix).
    await this.paymentWebhooksService.process(payload);
    return { received: true };
  }
}
