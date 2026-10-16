import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { PlatformFinanceConfig } from '@/shared/config/platform-finance/platform-finance.config';
import { GcsService } from '@/integrations/storage/gcs/services/gcs.service';
import { AiService } from '@/integrations/ai/services/ai.service';
import { AiProviders } from '@/integrations/ai/interfaces/ai.interface';
import { InvoiceCheckStatus } from 'generated/prisma';
import {
  INVOICE_EXTRACTION_MODEL,
  INVOICE_EXTRACTION_PROMPT,
  INVOICE_EXTRACTION_SYSTEM_PROMPT,
  InvoiceExtractionSchema,
} from '../utils/invoice-extraction.schema';
import { verifyInvoice } from '../utils/invoice-verification.utils';

export const INVOICE_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png'];
export const INVOICE_MIME_TYPES = ['application/pdf', ...INVOICE_IMAGE_MIME_TYPES];

// Reads the uploaded invoice with a cheap OpenAI model and compares it with
// what the Store was told to invoice. Purely advisory: it never approves or
// rejects anything, it only saves a verdict and a list of issues so the admin
// can review in seconds instead of minutes.
@Injectable()
export class InvoiceVerificationService {
  private readonly logger = new Logger(InvoiceVerificationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly platformFinanceConfig: PlatformFinanceConfig,
    private readonly gcsService: GcsService,
    private readonly aiService: AiService,
  ) {}

  // Never throws: every outcome, including an exception, is written to the
  // request row so the admin UI can show it and offer a re-run.
  async verify(requestId: string): Promise<void> {
    const request = await this.prisma.payoutRequest.findUnique({
      where: { id: requestId },
      include: {
        invoice_document: true,
        store: { select: { organization: { select: { vat_number: true } } } },
      },
    });
    if (!request) return;

    const [enabled, platformDetails] = await Promise.all([
      this.platformFinanceConfig.isPayoutInvoiceAiCheckEnabled(),
      this.platformFinanceConfig.getPlatformInvoiceDetails(),
    ]);
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');

    if (!enabled || !apiKey) {
      await this.prisma.payoutRequest.update({
        where: { id: requestId },
        data: { check_status: InvoiceCheckStatus.SKIPPED, check_verdict: null, check_issues: [], checked_at: new Date() },
      });
      return;
    }

    await this.prisma.payoutRequest.update({
      where: { id: requestId },
      data: { check_status: InvoiceCheckStatus.PENDING },
    });

    const model = INVOICE_EXTRACTION_MODEL;

    try {
      const { buffer } = await this.gcsService.downloadImage({ filename: request.invoice_document.filename });

      const { response: extracted, usage } = await this.aiService.generateObjectFromFile({
        provider: AiProviders.openai,
        model,
        buffer,
        mimeType: request.invoice_document.mimetype,
        filename: request.invoice_document.filename.split('/').pop(),
        schema: InvoiceExtractionSchema,
        system: INVOICE_EXTRACTION_SYSTEM_PROMPT,
        prompt: INVOICE_EXTRACTION_PROMPT,
      });

      const { verdict, issues } = verifyInvoice(extracted, {
        amount: request.amount,
        currency: request.currency,
        organization_vat_number: request.store.organization.vat_number,
        platform_vat_number: platformDetails.vat_number,
        invoice_number: request.invoice_number,
        period_to: request.period_to,
        is_image: INVOICE_IMAGE_MIME_TYPES.includes(request.invoice_document.mimetype),
      });

      await this.prisma.payoutRequest.update({
        where: { id: requestId },
        data: {
          check_status: InvoiceCheckStatus.COMPLETED,
          check_verdict: verdict,
          check_issues: issues,
          check_extracted: extracted,
          check_model: model,
          check_cost_usd: usage?.totalCost ?? null,
          checked_at: new Date(),
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Invoice check failed for payout request ${requestId}: ${message}`);
      await this.prisma.payoutRequest.update({
        where: { id: requestId },
        data: {
          check_status: InvoiceCheckStatus.FAILED,
          check_verdict: null,
          check_issues: [],
          check_extracted: { error: message },
          check_model: model,
          checked_at: new Date(),
        },
      });
    }
  }
}
