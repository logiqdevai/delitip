import { ensureUniqueQrCode } from './qr-code.utils';

describe('ensureUniqueQrCode', () => {
    it('returns an 8-character alphanumeric code on the first try when it does not exist yet', async () => {
        const exists = jest.fn().mockResolvedValue(false);

        const code = await ensureUniqueQrCode(exists);

        expect(code).toMatch(/^[A-Za-z0-9]{8}$/);
        expect(exists).toHaveBeenCalledTimes(1);
        expect(exists).toHaveBeenCalledWith(code);
    });

    it('regenerates and retries until a candidate that does not already exist is found', async () => {
        const exists = jest.fn()
            .mockResolvedValueOnce(true)
            .mockResolvedValueOnce(true)
            .mockResolvedValueOnce(false);

        const code = await ensureUniqueQrCode(exists);

        expect(exists).toHaveBeenCalledTimes(3);
        expect(code).toMatch(/^[A-Za-z0-9]{8}$/);
        // the final accepted candidate is whatever the last call was checked with
        expect(exists).toHaveBeenLastCalledWith(code);
    });

    it('generates different candidates across repeated collisions rather than looping on the same string forever', async () => {
        const seen = new Set<string>();
        const exists = jest.fn().mockImplementation(async (candidate: string) => {
            if (seen.has(candidate)) return false; // safety net so the test itself can't hang
            seen.add(candidate);
            return seen.size < 5; // force a handful of retries
        });

        const code = await ensureUniqueQrCode(exists);

        expect(seen.size).toBeGreaterThanOrEqual(5);
        expect(code).toMatch(/^[A-Za-z0-9]{8}$/);
    });
});
