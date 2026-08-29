import { slugify, ensureUniqueSlug } from './slug.utils';

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
