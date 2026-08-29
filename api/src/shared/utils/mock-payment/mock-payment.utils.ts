import { randomBytes } from 'crypto';

// Stand-in for a real payment processor. DelyTip currently ships with no
// live payment/subscription integration, so tips and connected accounts are
// simulated as instantly successful and reference ids are locally generated.
export function generateMockPaymentReference(): string {
    return `MOCK-${randomBytes(8).toString('hex').toUpperCase()}`;
}

export function generateMockProviderAccountId(): string {
    return `mock_acct_${randomBytes(10).toString('hex')}`;
}
