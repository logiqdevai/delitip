import { CacheService } from './cache.service';

describe('CacheService', () => {
    let service: CacheService;
    let cache: any;

    beforeEach(() => {
        cache = { set: jest.fn(), get: jest.fn(), del: jest.fn() };
        service = new CacheService(cache);
    });

    describe('set', () => {
        it('delegates to the underlying cache with a ttl', async () => {
            await service.set('key1', { a: 1 }, 60);

            expect(cache.set).toHaveBeenCalledWith('key1', { a: 1 }, 60);
        });

        it('delegates to the underlying cache without a ttl', async () => {
            await service.set('key1', 'value');

            expect(cache.set).toHaveBeenCalledWith('key1', 'value', undefined);
        });
    });

    describe('get', () => {
        it('returns the value from the underlying cache', async () => {
            cache.get.mockResolvedValue('cached-value');

            await expect(service.get('key1')).resolves.toBe('cached-value');
            expect(cache.get).toHaveBeenCalledWith('key1');
        });

        it('returns undefined on a cache miss', async () => {
            cache.get.mockResolvedValue(undefined);

            await expect(service.get('missing')).resolves.toBeUndefined();
        });
    });

    describe('delete', () => {
        it('delegates to the underlying cache', async () => {
            await service.delete('key1');

            expect(cache.del).toHaveBeenCalledWith('key1');
        });
    });
});
