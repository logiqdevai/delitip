import { z } from 'zod';
import { PaginationQuerySchema } from '@/shared/utils/pagination/pagination-query.schema';

export const AdminPayoutsQuerySchema = PaginationQuerySchema.extend({
    store_id: z.string().optional(),
    recipient_type: z.enum(['STORE', 'EMPLOYEE']).optional(),
    status: z.enum(['PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED']).optional(),
    search: z.string().optional(),
    date_from: z.string().optional(),
    date_to: z.string().optional(),
});

export type AdminPayoutsQueryType = z.infer<typeof AdminPayoutsQuerySchema>;
