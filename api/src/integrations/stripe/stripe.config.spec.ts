import { Logger } from '@nestjs/common';
import { StripeConfig } from './stripe.config';

// The real `stripe` SDK must never be constructed in tests: `new Stripe(key)` in this
// sandboxed environment blocks on outbound network I/O (observed: a 3-test file took ~21
// minutes before this mock was added). Mock the module so `new Stripe(...)` is a cheap fake.
const mockStripeInstance = { __isMockStripeClient: true };
const MockStripe = jest.fn().mockImplementation(() => mockStripeInstance);
jest.mock('stripe', () => ({
    __esModule: true,
    // must be a real constructor function (not an arrow fn) since production code calls `new Stripe(...)`
    default: function (...args: any[]) {
        return MockStripe(...args);
    },
}));

describe('StripeConfig', () => {
    let configService: any;
    let errorSpy: jest.SpyInstance;

    beforeEach(() => {
        MockStripe.mockClear();
        configService = { get: jest.fn() };
        errorSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
    });

    afterEach(() => {
        errorSpy.mockRestore();
    });

    it('initializes a Stripe client when STRIPE_SECRET_KEY is configured', () => {
        configService.get.mockReturnValue('sk_test_123');

        const config = new StripeConfig(configService);

        expect(config.getStripeClient()).toBe(mockStripeInstance);
        expect(MockStripe).toHaveBeenCalledWith('sk_test_123', expect.objectContaining({ apiVersion: expect.any(String) }));
        expect(errorSpy).not.toHaveBeenCalled();
    });

    it('logs an error and leaves the client unset when STRIPE_SECRET_KEY is missing', () => {
        configService.get.mockReturnValue(undefined);

        const config = new StripeConfig(configService);

        expect(config.getStripeClient()).toBeUndefined();
        expect(errorSpy).toHaveBeenCalledWith('Stripe not initialized');
        expect(MockStripe).not.toHaveBeenCalled();
    });

    it('returns the set of webhook events the integration cares about', () => {
        configService.get.mockReturnValue('sk_test_123');
        const config = new StripeConfig(configService);

        const events = config.getRelativeEvents();

        expect(events).toBeInstanceOf(Set);
        expect(events.size).toBe(11);
        expect(events.has('charge.succeeded')).toBe(true);
        expect(events.has('checkout.session.completed')).toBe(true);
        expect(events.has('not.a.real.event')).toBe(false);
    });
});
