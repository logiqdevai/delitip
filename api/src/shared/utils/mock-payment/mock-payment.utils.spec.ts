import { generateMockPaymentReference, generateMockProviderAccountId } from './mock-payment.utils';

describe('generateMockPaymentReference', () => {
    it('is prefixed with MOCK- followed by 16 uppercase hex characters', () => {
        const ref = generateMockPaymentReference();

        expect(ref).toMatch(/^MOCK-[0-9A-F]{16}$/);
    });

    it('does not produce colliding values across repeated calls', () => {
        const refs = new Set(Array.from({ length: 20 }, () => generateMockPaymentReference()));

        expect(refs.size).toBe(20);
    });
});

describe('generateMockProviderAccountId', () => {
    it('is prefixed with mock_acct_ followed by 20 lowercase hex characters', () => {
        const id = generateMockProviderAccountId();

        expect(id).toMatch(/^mock_acct_[0-9a-f]{20}$/);
    });

    it('does not produce colliding values across repeated calls', () => {
        const ids = new Set(Array.from({ length: 20 }, () => generateMockProviderAccountId()));

        expect(ids.size).toBe(20);
    });
});
