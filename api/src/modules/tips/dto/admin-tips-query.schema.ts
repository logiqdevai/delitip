import { z } from 'zod';
import { PaginationQuerySchema } from '@/shared/utils/pagination/pagination-query.schema';

export const AdminTipsQuerySchema = PaginationQuerySchema.extend({
    store_id: z.string().optional(),
    status: z.enum(['PENDING', 'CREATED', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REFUNDED']).optional(),
    search: z.string().optional(),
    date_from: z.string().optional(),
    date_to: z.string().optional(),
});

export type AdminTipsQueryType = z.infer<typeof AdminTipsQuerySchema>;
