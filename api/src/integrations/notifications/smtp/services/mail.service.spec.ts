import { InternalServerErrorException } from '@nestjs/common';
import { SmtpMailService } from './mail.service';

describe('SmtpMailService', () => {
    let service: SmtpMailService;
    let smtpAdapter: any;

    beforeEach(() => {
        smtpAdapter = { sendEmail: jest.fn() };
        service = new SmtpMailService(smtpAdapter);
    });

    describe('sendEmail', () => {
        it('returns the adapter result on success', async () => {
            smtpAdapter.sendEmail.mockResolvedValue({ messageId: 'm1' });

            await expect(service.sendEmail({ to: 'a@b.com', subject: 'hi' } as any)).resolves.toEqual({
                messageId: 'm1',
            });
        });

        it('wraps an adapter failure in InternalServerErrorException', async () => {
            smtpAdapter.sendEmail.mockRejectedValue(new Error('smtp down'));

            await expect(service.sendEmail({ to: 'a@b.com', subject: 'hi' } as any)).rejects.toThrow(
                InternalServerErrorException,
            );
        });
    });

    describe('sendBulkEmails', () => {
        it('sends every email and returns the results in order', async () => {
            smtpAdapter.sendEmail.mockResolvedValueOnce({ messageId: 'm1' }).mockResolvedValueOnce({ messageId: 'm2' });

            const result = await service.sendBulkEmails([
                { to: 'a@b.com', subject: 'a' } as any,
                { to: 'c@d.com', subject: 'b' } as any,
            ]);

            expect(result).toEqual([{ messageId: 'm1' }, { messageId: 'm2' }]);
            expect(smtpAdapter.sendEmail).toHaveBeenCalledTimes(2);
        });

        it('throws InternalServerErrorException with the bulk-specific message when one email fails', async () => {
            smtpAdapter.sendEmail.mockResolvedValueOnce({ messageId: 'm1' }).mockRejectedValueOnce(new Error('boom'));

            await expect(
                service.sendBulkEmails([{ to: 'a@b.com', subject: 'a' } as any, { to: 'c@d.com', subject: 'b' } as any]),
            ).rejects.toThrow('Failed to send bulk emails with SMTP');
        });
    });
});
