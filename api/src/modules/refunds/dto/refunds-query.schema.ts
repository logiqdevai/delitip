import { z } from 'zod';
import { PaginationQuerySchema } from '@/shared/utils/pagination/pagination-query.schema';

export const RefundsQuerySchema = PaginationQuerySchema.extend({
    status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'COMPLETED']).optional(),
    date_from: z.string().optional(),
    date_to: z.string().optional(),
});

export type RefundsQueryType = z.infer<typeof RefundsQuerySchema>;
