import { z } from 'zod';
import { PaginationQuerySchema } from '@/shared/utils/pagination/pagination-query.schema';

export const QrCodesQuerySchema = PaginationQuerySchema.extend({
    is_active: z
        .string()
        .optional()
        .transform((v) => (v === undefined ? undefined : v === 'true')),
});

export type QrCodesQueryType = z.infer<typeof QrCodesQuerySchema>;
