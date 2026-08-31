import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { VivaConfig } from '@/integrations/viva/viva.config';
import { isIpAllowed } from '@/shared/utils/ip/ip-allowlist.util';

// Viva sends no webhook signature/HMAC (see VivaWebhooksService), so an IP
// allowlist is the only authenticity gate available before parsing the
// body — the mandatory re-fetch-before-trusting check in
// PaymentWebhooksService is the real verification, this is just a filter.
@Injectable()
export class VivaIpAllowlistGuard implements CanActivate {
  private readonly logger = new Logger(VivaIpAllowlistGuard.name);

  constructor(private readonly vivaConfig: VivaConfig) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const allowlist = this.vivaConfig.getWebhookIpAllowlist();

    if (allowlist.length === 0) {
      this.logger.warn(
        'VIVA_WEBHOOK_IP_ALLOWLIST is not configured — allowing all webhook senders. Set it before going live.',
      );
      return true;
    }

    const clientIp: string =
      request.ip ?? request.connection?.remoteAddress ?? '';

    if (!isIpAllowed(clientIp, allowlist)) {
      this.logger.warn(`Rejected webhook from disallowed IP: ${clientIp}`);
      throw new ForbiddenException('Sender IP not allowed');
    }

    return true;
  }
}
