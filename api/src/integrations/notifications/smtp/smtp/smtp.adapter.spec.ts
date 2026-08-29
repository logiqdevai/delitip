import { InternalServerErrorException } from '@nestjs/common';
import { EmailTemplates } from '../../resend/interfaces/mail.interfaces';
import { SmtpAdapter } from './smtp.adapter';

describe('SmtpAdapter', () => {
    let adapter: SmtpAdapter;
    let smtpConfig: any;
    let templateService: any;
    let transporter: any;

    beforeEach(() => {
        transporter = { sendMail: jest.fn().mockResolvedValue({ messageId: 'm1' }) };
        smtpConfig = {
            getTransporter: jest.fn().mockReturnValue(transporter),
            getDefaultFrom: jest.fn().mockReturnValue('default@x.com'),
        };
        templateService = { renderTemplate: jest.fn() };
        adapter = new SmtpAdapter(smtpConfig, templateService);
    });

    it('sends a plain HTML email using the given "from" address', async () => {
        const result = await adapter.sendEmail({
            to: 'a@b.com',
            from: 'explicit@x.com',
            subject: 'Hi',
            html: '<p>hi</p>',
        } as any);

        expect(result).toEqual({ messageId: 'm1' });
        expect(transporter.sendMail).toHaveBeenCalledWith(
            expect.objectContaining({ from: 'explicit@x.com', to: 'a@b.com', subject: 'Hi', html: '<p>hi</p>' }),
        );
        expect(templateService.renderTemplate).not.toHaveBeenCalled();
    });

    it('falls back to smtpConfig.getDefaultFrom() when no "from" is given', async () => {
        await adapter.sendEmail({ to: 'a@b.com', subject: 'Hi' } as any);

        expect(transporter.sendMail).toHaveBeenCalledWith(expect.objectContaining({ from: 'default@x.com' }));
    });

    it('falls back to the configured confirmation address when getDefaultFrom() is falsy', async () => {
        smtpConfig.getDefaultFrom.mockReturnValue('');

        await adapter.sendEmail({ to: 'a@b.com', subject: 'Hi' } as any);

        expect(transporter.sendMail).toHaveBeenCalledWith(expect.objectContaining({ from: 'info@appointmy.com' }));
    });

    it('renders a template and uses it as the HTML body when template_id is given', async () => {
        templateService.renderTemplate.mockResolvedValue('<p>rendered</p>');

        await adapter.sendEmail({
            to: 'a@b.com',
            subject: 'Hi',
            template_id: EmailTemplates.WAITLIST,
            dynamic_template_data: { name: 'Nikos' },
        } as any);

        expect(templateService.renderTemplate).toHaveBeenCalledWith(EmailTemplates.WAITLIST, { name: 'Nikos' });
        expect(transporter.sendMail).toHaveBeenCalledWith(expect.objectContaining({ html: '<p>rendered</p>' }));
    });

    it('defaults dynamic_template_data to an empty object when omitted', async () => {
        templateService.renderTemplate.mockResolvedValue('<p>rendered</p>');

        await adapter.sendEmail({ to: 'a@b.com', subject: 'Hi', template_id: EmailTemplates.WAITLIST } as any);

        expect(templateService.renderTemplate).toHaveBeenCalledWith(EmailTemplates.WAITLIST, {});
    });

    it('wraps a transporter failure in InternalServerErrorException', async () => {
        transporter.sendMail.mockRejectedValue(new Error('smtp down'));

        await expect(adapter.sendEmail({ to: 'a@b.com', subject: 'Hi' } as any)).rejects.toThrow(
            InternalServerErrorException,
        );
    });

    it('wraps a getTransporter() failure (unconfigured SMTP) in InternalServerErrorException', async () => {
        smtpConfig.getTransporter.mockImplementation(() => {
            throw new Error('SMTP transporter is not initialized');
        });

        await expect(adapter.sendEmail({ to: 'a@b.com', subject: 'Hi' } as any)).rejects.toThrow(
            InternalServerErrorException,
        );
    });
});
