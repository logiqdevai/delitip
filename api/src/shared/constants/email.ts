import { EmailTemplates } from '@/integrations/notifications/resend/interfaces/mail.interfaces';

export const NO_REPLY_EMAIL_ADDRESS = 'no-reply@logiqdev.com';
export const REPLY_TO_EMAIL_ADDRESS = 'info@logiqdev.com';

export const EmailConfig = {
    email_addresses: {
        verification: NO_REPLY_EMAIL_ADDRESS,
        alert: NO_REPLY_EMAIL_ADDRESS,
        contact: 'petrosrodinos@gmail.com',
    },
    templates: {
        waitlist: {
            subject: 'Delitip - Waitlist',
            template_id: EmailTemplates.WAITLIST,
        },
        password_reset: {
            subject: 'Reset your password',
            template_id: EmailTemplates.PASSWORD_RESET,
        },
        employee_invite: {
            subject: 'Welcome to Delitip — set up your account',
            template_id: EmailTemplates.EMPLOYEE_INVITE,
        },
        contact: {
            subject: 'New contact form message',
            template_id: EmailTemplates.CONTACT,
        },
        payout_request_submitted: {
            subject: 'New payout request to review',
            template_id: EmailTemplates.PAYOUT_REQUEST_SUBMITTED,
        },
        payout_request_approved: {
            subject: 'Your payout request was approved',
            template_id: EmailTemplates.PAYOUT_REQUEST_APPROVED,
        },
        payout_request_rejected: {
            subject: 'Your payout request needs attention',
            template_id: EmailTemplates.PAYOUT_REQUEST_REJECTED,
        },
    }
}
