import { BadRequestException, Injectable } from '@nestjs/common';
import { ResendMailService } from '@/integrations/notifications/resend/services/mail.service';
import { EmailConfig } from '@/shared/constants/email';
import { CreateContactDto, ContactTopic } from './dto/create-contact.dto';

const ContactTopicLabels: Record<ContactTopic, string> = {
    sales: 'Sales & demos',
    support: 'Account support',
    billing: 'Billing',
    partnerships: 'Partnerships',
};

@Injectable()
export class ContactService {
    constructor(private readonly mailService: ResendMailService) { }

    async submit(dto: CreateContactDto) {
        try {
            await this.mailService.sendEmail({
                to: EmailConfig.email_addresses.contact,
                from: EmailConfig.email_addresses.alert,
                replyTo: dto.email,
                subject: EmailConfig.templates.contact.subject,
                template_id: EmailConfig.templates.contact.template_id,
                dynamic_template_data: {
                    topicLabel: ContactTopicLabels[dto.topic],
                    name: dto.name,
                    email: dto.email,
                    company: dto.company,
                    message: dto.message,
                },
            });

            return { message: 'Your message has been sent', code: 'CONTACT_SUCCESS' };
        } catch (error) {
            throw new BadRequestException('Failed to send message', error.message);
        }
    }
}
