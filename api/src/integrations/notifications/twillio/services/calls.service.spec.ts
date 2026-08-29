import { CallsService } from './calls.service';

describe('CallsService', () => {
    let service: CallsService;
    let twillioConfig: any;
    let logger: any;
    let callsCreate: jest.Mock;
    let callsFetch: jest.Mock;
    let callsFn: any;

    beforeEach(() => {
        callsCreate = jest.fn();
        callsFetch = jest.fn();
        // twillioClient.calls is used both as `.calls.create(...)` and as `.calls(sid).fetch()`,
        // so it has to be a callable function that also carries a `.create` property.
        callsFn = jest.fn(() => ({ fetch: callsFetch }));
        callsFn.create = callsCreate;

        twillioConfig = {
            getTwillioClient: jest.fn().mockReturnValue({ calls: callsFn }),
            getTwilioNumbers: jest.fn().mockReturnValue({ US: '+17089059169' }),
        };
        logger = { error: jest.fn() };
        service = new CallsService(twillioConfig, logger);
    });

    describe('makeCall', () => {
        it('builds a <Say> TwiML with the escaped message and defaults "from" to the US number', async () => {
            callsCreate.mockResolvedValue({ sid: 'CA1' });

            const result = await service.makeCall({ to: '+1555', message: `Tom & Jerry's tip` });

            expect(result).toEqual({ sid: 'CA1' });
            expect(callsCreate).toHaveBeenCalledWith(
                expect.objectContaining({
                    to: '+1555',
                    from: '+17089059169',
                    twiml: `<?xml version="1.0" encoding="UTF-8"?><Response><Say>Tom &amp; Jerry&apos;s tip</Say></Response>`,
                }),
            );
        });

        it('uses the given "from" number when provided', async () => {
            callsCreate.mockResolvedValue({ sid: 'CA1' });

            await service.makeCall({ to: '+1555', from: '+1999', message: 'hi' });

            expect(callsCreate).toHaveBeenCalledWith(expect.objectContaining({ from: '+1999' }));
        });

        it('builds a <Play> TwiML from a raw (unescaped) url when there is no message', async () => {
            callsCreate.mockResolvedValue({ sid: 'CA1' });

            await service.makeCall({ to: '+1555', url: 'https://x.com/audio.mp3?a=1&b=2' });

            expect(callsCreate).toHaveBeenCalledWith(
                expect.objectContaining({
                    twiml: `<?xml version="1.0" encoding="UTF-8"?><Response><Play>https://x.com/audio.mp3?a=1&b=2</Play></Response>`,
                }),
            );
        });

        it('does not set a twiml param at all when neither message nor url is given', async () => {
            callsCreate.mockResolvedValue({ sid: 'CA1' });

            await service.makeCall({ to: '+1555' });

            const callArg = callsCreate.mock.calls[0][0];
            expect(callArg.twiml).toBeUndefined();
        });

        it('logs and rethrows the original error on failure', async () => {
            const error = new Error('twilio rejected the call');
            callsCreate.mockRejectedValue(error);

            await expect(service.makeCall({ to: '+1555', message: 'hi' })).rejects.toThrow(error);
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('twilio rejected the call'));
        });
    });

    describe('getCall', () => {
        it('fetches the call by SID', async () => {
            callsFetch.mockResolvedValue({ sid: 'CA1', status: 'completed' });

            const result = await service.getCall('CA1');

            expect(callsFn).toHaveBeenCalledWith('CA1');
            expect(result).toEqual({ sid: 'CA1', status: 'completed' });
        });

        it('logs and rethrows the original error on failure', async () => {
            const error = new Error('not found');
            callsFetch.mockRejectedValue(error);

            await expect(service.getCall('CA1')).rejects.toThrow(error);
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('not found'));
        });
    });

    describe('handleWebhook', () => {
        let consoleLogSpy: jest.SpyInstance;

        beforeEach(() => {
            consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        });

        afterEach(() => {
            consoleLogSpy.mockRestore();
        });

        it('maps the raw Twilio webhook payload to a normalized event shape', async () => {
            const result = await service.handleWebhook({
                CallSid: 'CA1',
                CallStatus: 'completed',
                Direction: 'inbound',
                RecordingStatus: 'completed',
            });

            expect(result).toEqual({
                call_sid: 'CA1',
                call_status: 'completed',
                direction: 'inbound',
                recording_status: 'completed',
            });
        });

        it('logs and rethrows when the payload cannot be read', async () => {
            await expect(service.handleWebhook(null as any)).rejects.toThrow();
            expect(logger.error).toHaveBeenCalled();
        });
    });
});
