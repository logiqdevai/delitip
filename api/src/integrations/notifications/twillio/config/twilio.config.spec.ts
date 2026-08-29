import { ShortCodeTypes } from '../interfaces/sms.interfaces';
import { TwillioConfig } from './twilio.config';

const fakeTwilioSdkClient = { calls: jest.fn(), messages: { create: jest.fn() } };
const twilioFactory = jest.fn((...args: any[]) => fakeTwilioSdkClient);

jest.mock('twilio', () => (...args: any[]) => twilioFactory(...args));

const buildConfigService = (overrides: Record<string, any> = {}) => ({
    get: jest.fn((key: string) => overrides[key]),
});

describe('TwillioConfig', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('does not construct a client when credentials are missing', () => {
        const config = new TwillioConfig(buildConfigService({ TWILIO_ACCOUNT_SID: 'sid-only' }) as any);

        expect(twilioFactory).not.toHaveBeenCalled();
        expect(config.getTwillioClient()).toBeUndefined();
    });

    it('constructs a client with the account SID and auth token when both are present', () => {
        const config = new TwillioConfig(
            buildConfigService({ TWILIO_ACCOUNT_SID: 'sid1', TWILIO_AUTH_TOKEN: 'token1' }) as any,
        );

        expect(twilioFactory).toHaveBeenCalledWith('sid1', 'token1');
        expect(config.getTwillioClient()).toBe(fakeTwilioSdkClient);
    });

    it('returns the static US Twilio number map', () => {
        const config = new TwillioConfig(buildConfigService({}) as any);

        expect(config.getTwilioNumbers()).toEqual({ US: '+17089059169' });
    });

    it('getTwilioNumber returns the number for a known country and undefined for an unknown one', () => {
        const config = new TwillioConfig(buildConfigService({}) as any);

        expect(config.getTwilioNumber('US')).toBe('+17089059169');
        expect(config.getTwilioNumber('GR')).toBeUndefined();
    });

    it('returns the static short codes', () => {
        const config = new TwillioConfig(buildConfigService({}) as any);

        expect(config.getShortCodes()).toEqual(ShortCodeTypes);
    });
});
