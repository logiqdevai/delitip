import { z } from 'zod';
import { PaginationQuerySchema } from '@/shared/utils/pagination/pagination-query.schema';

export const SpotsQuerySchema = PaginationQuerySchema.extend({
    is_active: z
        .enum(['true', 'false'])
        .optional()
        .transform((v) => (v === undefined ? undefined : v === 'true')),
});

export type SpotsQueryType = z.infer<typeof SpotsQuerySchema>;
