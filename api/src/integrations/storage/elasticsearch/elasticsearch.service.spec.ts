import { ElasticsearchService } from './elasticsearch.service';

describe('ElasticsearchService', () => {
    let client: any;
    let aiService: any;

    const buildService = (withClient = true) => {
        client = withClient
            ? {
                indices: { exists: jest.fn(), create: jest.fn() },
                index: jest.fn(),
                delete: jest.fn(),
                search: jest.fn(),
            }
            : null;
        aiService = { embedText: jest.fn().mockResolvedValue([0.1, 0.2, 0.3]) };
        return new ElasticsearchService(client, aiService);
    };

    describe('enabled', () => {
        it('is true when a client is configured', () => {
            const service = buildService(true);
            expect(service.enabled).toBe(true);
        });

        it('is false when the client is null (ELASTICSEARCH_URL unset)', () => {
            const service = buildService(false);
            expect(service.enabled).toBe(false);
        });
    });

    describe('registerIndex', () => {
        it('is a no-op when the client is null', async () => {
            const service = buildService(false);
            await service.registerIndex('idx', { properties: {} });
            // no client to assert against; just confirms it does not throw
        });

        it('does nothing when the index already exists', async () => {
            const service = buildService(true);
            client.indices.exists.mockResolvedValue(true);

            await service.registerIndex('idx', { properties: {} });

            expect(client.indices.create).not.toHaveBeenCalled();
        });

        it('creates the index with the given mappings when it does not exist', async () => {
            const service = buildService(true);
            client.indices.exists.mockResolvedValue(false);
            client.indices.create.mockResolvedValue({});

            await service.registerIndex('idx', { properties: { name: { type: 'text' } } });

            expect(client.indices.create).toHaveBeenCalledWith({ index: 'idx', mappings: { properties: { name: { type: 'text' } } } });
        });

        it('swallows an index-creation failure (logs a warning, does not throw)', async () => {
            const service = buildService(true);
            client.indices.exists.mockResolvedValue(false);
            client.indices.create.mockRejectedValue(new Error('boom'));

            await expect(service.registerIndex('idx', { properties: {} })).resolves.toBeUndefined();
        });
    });

    describe('index', () => {
        it('is a no-op when the client is null', async () => {
            const service = buildService(false);
            await service.index('idx', 'id1', { name: 'x' });
        });

        it('indexes the document as-is when no embeddingSource is given', async () => {
            const service = buildService(true);
            client.index.mockResolvedValue({});

            await service.index('idx', 'id1', { name: 'x' });

            expect(client.index).toHaveBeenCalledWith({ index: 'idx', id: 'id1', document: { name: 'x' } });
            expect(aiService.embedText).not.toHaveBeenCalled();
        });

        it('embeds the given text and attaches it under the default "embedding" field', async () => {
            const service = buildService(true);
            client.index.mockResolvedValue({});

            await service.index('idx', 'id1', { name: 'x' }, { embeddingSource: 'some text' });

            expect(aiService.embedText).toHaveBeenCalledWith('some text');
            expect(client.index).toHaveBeenCalledWith({ index: 'idx', id: 'id1', document: { name: 'x', embedding: [0.1, 0.2, 0.3] } });
        });

        it('attaches the embedding under a custom field name when given', async () => {
            const service = buildService(true);
            client.index.mockResolvedValue({});

            await service.index('idx', 'id1', { name: 'x' }, { embeddingSource: 'some text', embeddingField: 'vec' });

            expect(client.index).toHaveBeenCalledWith({ index: 'idx', id: 'id1', document: { name: 'x', vec: [0.1, 0.2, 0.3] } });
        });

        it('falls back to a single space when the embedding source is empty/whitespace', async () => {
            const service = buildService(true);
            client.index.mockResolvedValue({});

            await service.index('idx', 'id1', {}, { embeddingSource: '   ' });

            expect(aiService.embedText).toHaveBeenCalledWith(' ');
        });

        it('swallows an indexing failure (logs a warning, does not throw)', async () => {
            const service = buildService(true);
            client.index.mockRejectedValue(new Error('boom'));

            await expect(service.index('idx', 'id1', {})).resolves.toBeUndefined();
        });
    });

    describe('delete', () => {
        it('is a no-op when the client is null', async () => {
            const service = buildService(false);
            await service.delete('idx', 'id1');
        });

        it('deletes the document', async () => {
            const service = buildService(true);
            client.delete.mockResolvedValue({});

            await service.delete('idx', 'id1');

            expect(client.delete).toHaveBeenCalledWith({ index: 'idx', id: 'id1' });
        });

        it('silently ignores a 404 (already deleted / never existed)', async () => {
            const service = buildService(true);
            client.delete.mockRejectedValue({ meta: { statusCode: 404 } });

            await expect(service.delete('idx', 'id1')).resolves.toBeUndefined();
        });

        it('swallows any other delete failure (logs a warning, does not throw)', async () => {
            const service = buildService(true);
            client.delete.mockRejectedValue(new Error('boom'));

            await expect(service.delete('idx', 'id1')).resolves.toBeUndefined();
        });
    });

    describe('search', () => {
        it('returns an empty result when the client is null', async () => {
            const service = buildService(false);

            await expect(service.search('idx', {})).resolves.toEqual({ hits: [], total: 0 });
        });

        it('runs a plain match_all query with pagination when there is no q', async () => {
            const service = buildService(true);
            client.search.mockResolvedValue({ hits: { hits: [{ _id: '1', _score: 1, _source: { name: 'a' } }], total: 1 } });

            const result = await service.search('idx', { page: 2, limit: 10 });

            expect(client.search).toHaveBeenCalledWith(
                expect.objectContaining({
                    index: 'idx',
                    from: 10,
                    size: 10,
                    query: { bool: { must: [{ match_all: {} }], filter: [] } },
                }),
            );
            expect(result).toEqual({ hits: [{ _id: '1', _score: 1, name: 'a' }], total: 1 });
            expect(aiService.embedText).not.toHaveBeenCalled();
        });

        it('defaults page 1 / limit 20 when not given', async () => {
            const service = buildService(true);
            client.search.mockResolvedValue({ hits: { hits: [], total: 0 } });

            await service.search('idx', {});

            expect(client.search).toHaveBeenCalledWith(expect.objectContaining({ from: 0, size: 20 }));
        });

        it('runs a knn vector search when q is provided', async () => {
            const service = buildService(true);
            client.search.mockResolvedValue({ hits: { hits: [], total: { value: 0 } } });

            await service.search('idx', { q: 'search text', limit: 5 });

            expect(aiService.embedText).toHaveBeenCalledWith('search text');
            expect(client.search).toHaveBeenCalledWith(
                expect.objectContaining({
                    knn: expect.objectContaining({ field: 'embedding', query_vector: [0.1, 0.2, 0.3], k: 25, num_candidates: 100 }),
                }),
            );
        });

        it('builds term/terms/range filters and passes them through', async () => {
            const service = buildService(true);
            client.search.mockResolvedValue({ hits: { hits: [], total: 0 } });

            await service.search('idx', {
                filters: [
                    { term: { field: 'status', value: 'active' } },
                    { terms: { field: 'tags', values: ['a', 'b'] } },
                    { range: { field: 'amount', gte: 10, lte: 100 } },
                ],
            });

            expect(client.search).toHaveBeenCalledWith(
                expect.objectContaining({
                    query: {
                        bool: {
                            must: [{ match_all: {} }],
                            filter: [
                                { term: { status: 'active' } },
                                { terms: { tags: ['a', 'b'] } },
                                { range: { amount: { gte: 10, lte: 100 } } },
                            ],
                        },
                    },
                }),
            );
        });

        it('reads total from a numeric hits.total (older ES response shape)', async () => {
            const service = buildService(true);
            client.search.mockResolvedValue({ hits: { hits: [], total: 7 } });

            const result = await service.search('idx', {});

            expect(result.total).toBe(7);
        });

        it('reads total from hits.total.value (newer ES response shape), defaulting to 0', async () => {
            const service = buildService(true);
            client.search.mockResolvedValue({ hits: {} });

            const result = await service.search('idx', {});

            expect(result.total).toBe(0);
        });
    });
});
