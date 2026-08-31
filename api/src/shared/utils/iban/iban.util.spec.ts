import { isValidIban, maskIban } from './iban.util';

describe('isValidIban', () => {
    it.each([
        'GR16 0110 1250 0000 0001 2300 695', // official IBAN registry example (Greece)
        'GB29 NWBK 6016 1331 9268 19', // official IBAN registry example (UK)
        'DE89 3704 0044 0532 0130 00', // official IBAN registry example (Germany)
        'FR14 2004 1010 0505 0001 3M02 606', // official IBAN registry example (France)
    ])('accepts a valid IBAN with spaces: %s', (iban) => {
        expect(isValidIban(iban)).toBe(true);
    });

    it('accepts a valid IBAN with no spaces, case-insensitively', () => {
        expect(isValidIban('gr1601101250000000012300695')).toBe(true);
    });

    it('rejects an IBAN with a bad checksum', () => {
        expect(isValidIban('GR1601101250000000012300696')).toBe(false);
    });

    it('rejects a string that is not IBAN-shaped', () => {
        expect(isValidIban('not-an-iban')).toBe(false);
    });

    it('rejects an empty string', () => {
        expect(isValidIban('')).toBe(false);
    });

    it('rejects a too-short candidate', () => {
        expect(isValidIban('GR16')).toBe(false);
    });
});

describe('maskIban', () => {
    it('returns only the last 4 characters', () => {
        expect(maskIban('GR1601101250000000012300695')).toBe('0695');
    });

    it('strips spaces and uppercases before masking', () => {
        expect(maskIban('gb29 nwbk 6016 1331 9268 19')).toBe('6819');
    });
});
