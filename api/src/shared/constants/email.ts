import { EmailTemplates } from '@/integrations/notifications/resend/interfaces/mail.interfaces';

export const EmailConfig = {
    email_addresses: {
        verification: 'no-reply@delitip.com',
        alert: 'no-reply@delitip.com',
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
    }
}
