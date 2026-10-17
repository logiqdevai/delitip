import { EmailTemplates } from '@/integrations/notifications/resend/interfaces/mail.interfaces';
import { NO_REPLY_EMAIL_ADDRESS } from '@/shared/constants/email';

const EmailAddress = NO_REPLY_EMAIL_ADDRESS

export const EmailConfig = {
    email_addresses: {
        verification: EmailAddress,
        confirmation: EmailAddress,
    },
    templates: {
        waitlist: {
            subject: 'Waitlist',
            template_id: EmailTemplates.WAITLIST,
        },
    }
}
