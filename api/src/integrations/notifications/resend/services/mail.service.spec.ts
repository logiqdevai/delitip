import { InternalServerErrorException } from '@nestjs/common';
import { ResendMailService } from './mail.service';

describe('ResendMailService', () => {
    let service: ResendMailService;
    let adapter: any;

    beforeEach(() => {
        adapter = { sendEmail: jest.fn() };
        service = new ResendMailService(adapter);
    });

    describe('sendEmail', () => {
        it('returns the adapter result on success', async () => {
            const response = { id: 'email_1' };
            adapter.sendEmail.mockResolvedValue(response);
            const createEmail = { to: 'a@b.com', subject: 'hi' };

            await expect(service.sendEmail(createEmail as any)).resolves.toBe(response);
            expect(adapter.sendEmail).toHaveBeenCalledWith(createEmail);
        });

        it('wraps an adapter failure as InternalServerErrorException', async () => {
            adapter.sendEmail.mockRejectedValue(new Error('boom'));

            await expect(service.sendEmail({ to: 'a@b.com', subject: 'hi' } as any)).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('sendBulkEmails', () => {
        it('sends every email and returns the results in order', async () => {
            adapter.sendEmail
                .mockResolvedValueOnce({ id: '1' })
                .mockResolvedValueOnce({ id: '2' });

            const emails = [{ to: 'a@b.com', subject: 'a' }, { to: 'c@d.com', subject: 'b' }];

            const result = await service.sendBulkEmails(emails as any);

            expect(result).toEqual([{ id: '1' }, { id: '2' }]);
            expect(adapter.sendEmail).toHaveBeenCalledTimes(2);
        });

        it('throws InternalServerErrorException when any email in the batch fails (Promise.all fails fast)', async () => {
            adapter.sendEmail
                .mockResolvedValueOnce({ id: '1' })
                .mockRejectedValueOnce(new Error('boom'));

            await expect(
                service.sendBulkEmails([{ to: 'a@b.com', subject: 'a' }, { to: 'c@d.com', subject: 'b' }] as any),
            ).rejects.toThrow(InternalServerErrorException);
        });
    });
});
