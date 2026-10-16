import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { ResendMailService } from '@/integrations/notifications/resend/services/mail.service';
import { EmailConfig } from '@/shared/constants/email';
import { AppUrls } from '@/shared/config/app-urls';
import { AlertType, AuthRole, InvoiceCheckStatus, InvoiceCheckVerdict, OrganizationRole } from 'generated/prisma';
import { InvoiceCheckIssue, InvoiceCheckIssueDescriptions } from '../utils/invoice-verification.utils';

const formatDate = (value: Date) =>
  value.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

// Everything that leaves the system when a payout request changes hands:
// the admin email on submission, and the Store-side alert + owner email on
// approval/rejection. All methods swallow their own errors — a notification
// must never fail the business action that triggered it.
@Injectable()
export class PayoutRequestNotificationsService {
  private readonly logger = new Logger(PayoutRequestNotificationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: ResendMailService,
  ) {}

  async notifyAdminsSubmitted(requestId: string): Promise<void> {
    try {
      const request = await this.prisma.payoutRequest.findUnique({
        where: { id: requestId },
        include: { store: { select: { name: true } } },
      });
      if (!request) return;

      const admins = await this.prisma.user.findMany({
        where: { role: { in: [AuthRole.ADMIN, AuthRole.SUPER_ADMIN] }, is_archived: false },
        select: { email: true },
      });
      const recipients = admins.length > 0 ? admins.map((admin) => admin.email) : [EmailConfig.email_addresses.contact];

      const issues = ((request.check_issues as InvoiceCheckIssue[] | null) ?? []).map(
        (code) => InvoiceCheckIssueDescriptions[code] ?? code,
      );
      const { verdictLabel, verdictClass } = this.describeVerdict(request.check_status, request.check_verdict);

      await this.sendToEach(recipients, {
        subject: `${EmailConfig.templates.payout_request_submitted.subject} — ${request.store.name}`,
        template_id: EmailConfig.templates.payout_request_submitted.template_id,
        dynamic_template_data: {
          storeName: request.store.name,
          amount: request.amount / 100,
          ownShareAmount: request.own_share_amount / 100,
          heldForStaffAmount: request.held_for_staff_amount / 100,
          currency: request.currency,
          distributionCount: request.distribution_count,
          periodFrom: formatDate(request.period_from),
          periodTo: formatDate(request.period_to),
          invoiceNumber: request.invoice_number,
          storeNote: request.store_note,
          verdictLabel,
          verdictClass,
          issues,
          reviewUrl: AppUrls.adminPayoutRequest(request.id),
        },
      });
    } catch (error) {
      this.logger.error(`Could not notify admins about payout request ${requestId}: ${error?.message ?? error}`);
    }
  }

  async notifyStoreReviewed(requestId: string, outcome: 'APPROVED' | 'REJECTED'): Promise<void> {
    try {
      const request = await this.prisma.payoutRequest.findUnique({
        where: { id: requestId },
        include: {
          store: { select: { id: true, name: true, organization_id: true } },
          requested_by: { select: { email: true, first_name: true } },
        },
      });
      if (!request) return;

      const amountLabel = `${request.currency} ${(request.amount / 100).toFixed(2)}`;
      const approved = outcome === 'APPROVED';

      await this.prisma.alert.create({
        data: {
          store_id: request.store.id,
          type: approved ? AlertType.PAYOUT_REQUEST_APPROVED : AlertType.PAYOUT_REQUEST_REJECTED,
          title: approved ? 'Payout approved' : 'Payout request not approved',
          message: approved
            ? `Your payout of ${amountLabel} was approved and the bank transfer has started.${request.admin_note ? ` Note: ${request.admin_note}` : ''}`
            : `Your payout request for ${amountLabel} was not approved: ${request.admin_note ?? 'see your payouts page'}. Your tips were released so you can submit a corrected invoice.`,
        },
      });

      const owners = await this.prisma.organizationMember.findMany({
        where: {
          organization_id: request.store.organization_id,
          role: OrganizationRole.OWNER,
          OR: [{ store_id: null }, { store_id: request.store.id }],
        },
        include: { user: { select: { email: true, first_name: true, is_archived: true } } },
      });

      const byEmail = new Map<string, string>();
      for (const owner of owners) {
        if (!owner.user.is_archived) byEmail.set(owner.user.email, owner.user.first_name ?? '');
      }
      if (request.requested_by) byEmail.set(request.requested_by.email, request.requested_by.first_name ?? '');

      const template = approved ? EmailConfig.templates.payout_request_approved : EmailConfig.templates.payout_request_rejected;

      await Promise.all(
        Array.from(byEmail.entries()).map(([email, firstName]) =>
          this.sendToEach([email], {
            subject: template.subject,
            template_id: template.template_id,
            dynamic_template_data: {
              recipientName: firstName || 'there',
              storeName: request.store.name,
              amount: request.amount / 100,
              currency: request.currency,
              distributionCount: request.distribution_count,
              periodFrom: formatDate(request.period_from),
              periodTo: formatDate(request.period_to),
              invoiceNumber: request.invoice_number,
              adminNote: request.admin_note,
              payoutsUrl: AppUrls.storePayouts,
            },
          }),
        ),
      );
    } catch (error) {
      this.logger.error(`Could not notify store about payout request ${requestId}: ${error?.message ?? error}`);
    }
  }

  private describeVerdict(status: InvoiceCheckStatus, verdict: InvoiceCheckVerdict | null) {
    if (status === InvoiceCheckStatus.SKIPPED) return { verdictLabel: 'Not checked (disabled)', verdictClass: 'skipped' };
    if (status === InvoiceCheckStatus.FAILED) return { verdictLabel: 'Check failed — review manually', verdictClass: 'unreadable' };
    if (status !== InvoiceCheckStatus.COMPLETED || !verdict) return { verdictLabel: 'Check pending', verdictClass: 'skipped' };
    switch (verdict) {
      case InvoiceCheckVerdict.MATCH:
        return { verdictLabel: 'Looks correct', verdictClass: 'match' };
      case InvoiceCheckVerdict.MISMATCH:
        return { verdictLabel: 'Mismatch found', verdictClass: 'mismatch' };
      default:
        return { verdictLabel: 'Could not read invoice', verdictClass: 'unreadable' };
    }
  }

  // sendBulkEmails fails fast on the first error; one bad address must not
  // stop the others from hearing about the request.
  private async sendToEach(
    recipients: string[],
    email: { subject: string; template_id: string; dynamic_template_data: Record<string, unknown> },
  ) {
    await Promise.all(
      recipients.map(async (to) => {
        try {
          await this.mailService.sendEmail({ to, from: EmailConfig.email_addresses.alert, ...email });
        } catch (error) {
          this.logger.warn(`Payout request email to ${to} failed: ${error?.message ?? error}`);
        }
      }),
    );
  }
}
