const ResendMock = jest.fn();
jest.mock('resend', () => ({ Resend: ResendMock }));

import { ResendConfig } from './resend.config';

function makeConfigService(apiKey: string | undefined) {
    return { get: jest.fn().mockReturnValue(apiKey) };
}

describe('ResendConfig', () => {
    beforeEach(() => {
        ResendMock.mockClear();
    });

    it('logs and leaves the client unconfigured when RESEND_API_KEY is missing', () => {
        const config = new ResendConfig(makeConfigService(undefined) as any);

        expect(ResendMock).not.toHaveBeenCalled();
        expect(() => config.getResendClient()).toThrow('Resend client is not initialized');
    });

    it('initializes the Resend client with the configured API key', () => {
        const config = new ResendConfig(makeConfigService('re_test_key') as any);

        expect(ResendMock).toHaveBeenCalledWith('re_test_key');
        expect(config.getResendClient()).toBeInstanceOf(ResendMock);
    });
});
