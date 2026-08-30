import { EmailTemplates } from '@/integrations/notifications/resend/interfaces/mail.interfaces';

export const EmailConfig = {
    email_addresses: {
        verification: 'delitip@logiqdev.com',
        alert: 'delitip@logiqdev.com',
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
    }
}
