import { Prisma } from 'generated/prisma';
import { slugify, ensureUniqueSlug, isUniqueSlugConflict, withUniqueSlugRetry } from './slug.utils';

function slugConflictError() {
    return new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        clientVersion: '7.0.0',
        meta: { target: ['slug'] },
    });
}

describe('slugify', () => {
    it('lowercases and hyphenates spaces', () => {
        expect(slugify('My Coffee Shop')).toBe('my-coffee-shop');
    });

    it('strips diacritics/accents', () => {
        expect(slugify('Café Déjà Vu')).toBe('cafe-deja-vu');
    });

    it('replaces runs of non-alphanumeric characters with a single hyphen', () => {
        expect(slugify('Hello!!  World??')).toBe('hello-world');
    });

    it('trims leading/trailing hyphens', () => {
        expect(slugify('--Hello World--')).toBe('hello-world');
    });

    it('truncates to 60 characters', () => {
        const long = 'a'.repeat(100);
        const result = slugify(long);
        expect(result.length).toBe(60);
        expect(result).toBe('a'.repeat(60));
    });

    it('falls back to "store" when the result is empty', () => {
        expect(slugify('!!!')).toBe('store');
        expect(slugify('')).toBe('store');
        expect(slugify('   ')).toBe('store');
    });

    it('preserves digits', () => {
        expect(slugify('Store 123')).toBe('store-123');
    });
});

describe('ensureUniqueSlug', () => {
    it('returns the base slug when it does not already exist', async () => {
        const exists = jest.fn().mockResolvedValue(false);

        const result = await ensureUniqueSlug('My Store', exists);

        expect(result).toBe('my-store');
        expect(exists).toHaveBeenCalledTimes(1);
        expect(exists).toHaveBeenCalledWith('my-store');
    });

    it('appends an incrementing suffix until a free slug is found', async () => {
        const exists = jest.fn()
            .mockResolvedValueOnce(true) // "my-store"
            .mockResolvedValueOnce(true) // "my-store-1"
            .mockResolvedValueOnce(false); // "my-store-2"

        const result = await ensureUniqueSlug('My Store', exists);

        expect(result).toBe('my-store-2');
        expect(exists).toHaveBeenNthCalledWith(1, 'my-store');
        expect(exists).toHaveBeenNthCalledWith(2, 'my-store-1');
        expect(exists).toHaveBeenNthCalledWith(3, 'my-store-2');
    });

    it('slugifies the base before checking uniqueness', async () => {
        const exists = jest.fn().mockResolvedValue(false);

        const result = await ensureUniqueSlug('Wëird!! Name??', exists);

        expect(result).toBe('weird-name');
    });
});

describe('isUniqueSlugConflict', () => {
    it('recognizes a P2002 error targeting the slug column', () => {
        expect(isUniqueSlugConflict(slugConflictError())).toBe(true);
    });

    it('rejects a P2002 error targeting a different column', () => {
        const err = new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
            code: 'P2002',
            clientVersion: '7.0.0',
            meta: { target: ['email'] },
        });
        expect(isUniqueSlugConflict(err)).toBe(false);
    });

    it('rejects non-Prisma errors', () => {
        expect(isUniqueSlugConflict(new Error('boom'))).toBe(false);
    });
});

describe('withUniqueSlugRetry', () => {
    it('returns the result on first success without retrying', async () => {
        const operation = jest.fn().mockResolvedValue('ok');

        const result = await withUniqueSlugRetry(operation);

        expect(result).toBe('ok');
        expect(operation).toHaveBeenCalledTimes(1);
    });

    it('retries the whole operation on a slug conflict and returns the eventual success', async () => {
        const operation = jest.fn().mockRejectedValueOnce(slugConflictError()).mockResolvedValueOnce('ok');

        const result = await withUniqueSlugRetry(operation);

        expect(result).toBe('ok');
        expect(operation).toHaveBeenCalledTimes(2);
    });

    it('gives up after maxAttempts and rethrows the last slug conflict', async () => {
        const operation = jest.fn().mockRejectedValue(slugConflictError());

        await expect(withUniqueSlugRetry(operation, 3)).rejects.toThrow('Unique constraint failed');
        expect(operation).toHaveBeenCalledTimes(3);
    });

    it('rethrows immediately on a non-slug-conflict error without retrying', async () => {
        const operation = jest.fn().mockRejectedValue(new Error('unrelated failure'));

        await expect(withUniqueSlugRetry(operation)).rejects.toThrow('unrelated failure');
        expect(operation).toHaveBeenCalledTimes(1);
    });
});
