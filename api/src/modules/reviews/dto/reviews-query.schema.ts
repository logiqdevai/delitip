import { z } from 'zod';
import { PaginationQuerySchema } from '@/shared/utils/pagination/pagination-query.schema';
import { ReviewVisibility } from 'generated/prisma';

export const ReviewsQuerySchema = PaginationQuerySchema.extend({
    employee_id: z.string().optional(),
    min_rating: z
        .string()
        .optional()
        .transform((v) => (v ? parseInt(v, 10) : undefined)),
    visibility: z.nativeEnum(ReviewVisibility).optional(),
    search: z.string().optional(),
});

export type ReviewsQueryType = z.infer<typeof ReviewsQuerySchema>;
