import { z } from 'zod';
import { PaginationQuerySchema } from '@/shared/utils/pagination/pagination-query.schema';

export const TipsQuerySchema = PaginationQuerySchema.extend({
    employee_id: z.string().optional(),
    qr_code_id: z.string().optional(),
    status: z.enum(['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED']).optional(),
    date_from: z.string().optional(),
    date_to: z.string().optional(),
});

export type TipsQueryType = z.infer<typeof TipsQuerySchema>;
