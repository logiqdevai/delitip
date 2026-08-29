import { InternalServerErrorException } from '@nestjs/common';
import { ResendAdapter } from './resend.adapter';

describe('ResendAdapter', () => {
    let adapter: ResendAdapter;
    let resendConfig: any;
    let templateService: any;
    let send: jest.Mock;

    beforeEach(() => {
        send = jest.fn().mockResolvedValue({ id: 'email_1' });
        resendConfig = { getResendClient: jest.fn().mockReturnValue({ emails: { send } }) };
        templateService = { renderTemplate: jest.fn() };
        adapter = new ResendAdapter(resendConfig, templateService);
    });

    it('sends a raw-html email using the configured default "from" address when none is given', async () => {
        const result = await adapter.sendEmail({ to: 'a@b.com', subject: 'hi', html: '<p>hi</p>' } as any);

        expect(result).toEqual({ id: 'email_1' });
        expect(send).toHaveBeenCalledWith(
            expect.objectContaining({
                from: 'info@appointmy.com',
                to: 'a@b.com',
                subject: 'hi',
                html: '<p>hi</p>',
            }),
        );
        expect(templateService.renderTemplate).not.toHaveBeenCalled();
    });

    it('uses the explicit "from" address when provided', async () => {
        await adapter.sendEmail({ to: 'a@b.com', subject: 'hi', from: 'custom@x.com' } as any);

        expect(send).toHaveBeenCalledWith(expect.objectContaining({ from: 'custom@x.com' }));
    });

    it('renders the template and uses it as html when template_id is set', async () => {
        templateService.renderTemplate.mockResolvedValue('<p>rendered</p>');

        await adapter.sendEmail({
            to: 'a@b.com',
            subject: 'hi',
            template_id: 'waitlist',
            dynamic_template_data: { name: 'Nikos' },
        } as any);

        expect(templateService.renderTemplate).toHaveBeenCalledWith('waitlist', { name: 'Nikos' });
        expect(send).toHaveBeenCalledWith(expect.objectContaining({ html: '<p>rendered</p>' }));
    });

    it('defaults dynamic_template_data to an empty object when a template is used without data', async () => {
        templateService.renderTemplate.mockResolvedValue('<p>rendered</p>');

        await adapter.sendEmail({ to: 'a@b.com', subject: 'hi', template_id: 'waitlist' } as any);

        expect(templateService.renderTemplate).toHaveBeenCalledWith('waitlist', {});
    });

    it('passes through cc/bcc/replyTo/headers/text', async () => {
        await adapter.sendEmail({
            to: 'a@b.com',
            subject: 'hi',
            text: 'plain',
            cc: ['cc@x.com'],
            bcc: ['bcc@x.com'],
            replyTo: 'reply@x.com',
            headers: { 'X-Test': '1' },
        } as any);

        expect(send).toHaveBeenCalledWith(
            expect.objectContaining({
                text: 'plain',
                cc: ['cc@x.com'],
                bcc: ['bcc@x.com'],
                replyTo: 'reply@x.com',
                headers: { 'X-Test': '1' },
            }),
        );
    });

    it('wraps a send failure as InternalServerErrorException', async () => {
        send.mockRejectedValue(new Error('network down'));

        await expect(adapter.sendEmail({ to: 'a@b.com', subject: 'hi' } as any)).rejects.toThrow(InternalServerErrorException);
    });

    it('wraps a template rendering failure as InternalServerErrorException', async () => {
        templateService.renderTemplate.mockRejectedValue(new Error('template missing'));

        await expect(
            adapter.sendEmail({ to: 'a@b.com', subject: 'hi', template_id: 'waitlist' } as any),
        ).rejects.toThrow(InternalServerErrorException);
    });
});
