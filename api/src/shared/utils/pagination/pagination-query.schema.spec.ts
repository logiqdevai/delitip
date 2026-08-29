import { PaginationQuerySchema, paginate } from './pagination-query.schema';

describe('PaginationQuerySchema', () => {
    it('defaults page to 1 and limit to 20 when neither is provided', () => {
        expect(PaginationQuerySchema.parse({})).toEqual({ page: 1, limit: 20 });
    });

    it('parses provided string values to numbers', () => {
        expect(PaginationQuerySchema.parse({ page: '3', limit: '15' })).toEqual({ page: 3, limit: 15 });
    });

    it('caps limit at 100 even when a larger value is requested', () => {
        expect(PaginationQuerySchema.parse({ limit: '500' })).toEqual({ page: 1, limit: 100 });
    });
});

describe('paginate', () => {
    it('shapes the response as { data, pagination }', () => {
        const items = [{ id: 1 }, { id: 2 }];

        const result = paginate(items, 2, { page: 1, limit: 20 });

        expect(result).toEqual({
            data: items,
            pagination: {
                total: 2,
                page: 1,
                limit: 20,
                total_pages: 1,
                has_next: false,
                has_prev: false,
            },
        });
    });

    it('handles a middle page with both a next and a previous page available', () => {
        const result = paginate([], 25, { page: 2, limit: 10 });

        expect(result.pagination).toEqual({
            total: 25,
            page: 2,
            limit: 10,
            total_pages: 3,
            has_next: true,
            has_prev: true,
        });
    });

    it('has_next is false on the last page', () => {
        const result = paginate([], 25, { page: 3, limit: 10 });

        expect(result.pagination.total_pages).toBe(3);
        expect(result.pagination.has_next).toBe(false);
        expect(result.pagination.has_prev).toBe(true);
    });

    it('has_prev is false on the first page', () => {
        const result = paginate([], 25, { page: 1, limit: 10 });

        expect(result.pagination.has_prev).toBe(false);
        expect(result.pagination.has_next).toBe(true);
    });

    it('total_pages is 0 (not NaN) when total is 0', () => {
        const result = paginate([], 0, { page: 1, limit: 10 });

        expect(result.pagination.total_pages).toBe(0);
        expect(result.pagination.has_next).toBe(false);
        expect(result.pagination.has_prev).toBe(false);
    });
});
