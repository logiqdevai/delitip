import { TwillioSmsService } from './sms.service';

describe('TwillioSmsService', () => {
    let service: TwillioSmsService;
    let twillioConfig: any;
    let twillioClient: any;

    beforeEach(() => {
        twillioClient = { messages: { create: jest.fn() } };
        twillioConfig = {
            getTwillioClient: jest.fn().mockReturnValue(twillioClient),
            getShortCodes: jest.fn().mockReturnValue({ appointly: 'APPOINTLY' }),
        };
        service = new TwillioSmsService(twillioConfig);
    });

    describe('sendSms', () => {
        it('truncates a custom "from" to 10 characters', async () => {
            twillioClient.messages.create.mockResolvedValue({ sid: 's1' });

            await service.sendSms({ to: '+15551234567', from: 'SomeVeryLongSenderName', body: 'hi' });

            expect(twillioClient.messages.create).toHaveBeenCalledWith({
                to: '+15551234567',
                from: 'SomeVeryLo', // first 10 chars
                body: 'hi',
            });
        });

        it('falls back to the appointly short code when no "from" is given', async () => {
            twillioClient.messages.create.mockResolvedValue({ sid: 's1' });

            await service.sendSms({ to: '+15551234567', body: 'hi' });

            expect(twillioClient.messages.create).toHaveBeenCalledWith({
                to: '+15551234567',
                from: 'APPOINTLY',
                body: 'hi',
            });
        });

        it('wraps a client failure in a new Error', async () => {
            twillioClient.messages.create.mockRejectedValue(new Error('twilio down'));

            await expect(service.sendSms({ to: '+15551234567', body: 'hi' })).rejects.toThrow(Error);
        });
    });

    describe('sendBulkSms', () => {
        it('sends every SMS and returns the results in order', async () => {
            twillioClient.messages.create.mockResolvedValueOnce({ sid: 's1' }).mockResolvedValueOnce({ sid: 's2' });

            const result = await service.sendBulkSms([
                { to: '+1', body: 'a' },
                { to: '+2', body: 'b' },
            ]);

            expect(result).toEqual([{ sid: 's1' }, { sid: 's2' }]);
        });

        it('rejects with an Error when one SMS fails', async () => {
            twillioClient.messages.create.mockResolvedValueOnce({ sid: 's1' }).mockRejectedValueOnce(new Error('boom'));

            await expect(
                service.sendBulkSms([
                    { to: '+1', body: 'a' },
                    { to: '+2', body: 'b' },
                ]),
            ).rejects.toThrow(Error);
        });
    });
});
