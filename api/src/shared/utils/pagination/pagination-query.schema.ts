import { z } from 'zod';

export const PaginationQuerySchema = z.object({
    page: z
        .string()
        .optional()
        .transform((v) => (v ? parseInt(v, 10) : 1)),
    limit: z
        .string()
        .optional()
        .transform((v) => (v ? Math.min(parseInt(v, 10), 100) : 20)),
});

export type PaginationQueryType = z.infer<typeof PaginationQuerySchema>;

export function paginate<T>(items: T[], total: number, query: PaginationQueryType) {
    return {
        data: items,
        pagination: {
            total,
            page: query.page,
            limit: query.limit,
            total_pages: Math.ceil(total / query.limit) || 0,
            has_next: query.page < Math.ceil(total / query.limit),
            has_prev: query.page > 1,
        },
    };
}
