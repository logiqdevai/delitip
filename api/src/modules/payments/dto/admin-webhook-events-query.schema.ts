import { z } from 'zod';
import { PaginationQuerySchema } from '@/shared/utils/pagination/pagination-query.schema';

const DateOnlySchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected YYYY-MM-DD');

export const AdminWebhookEventsQuerySchema = PaginationQuerySchema.extend({
    event_type_id: z
        .string()
        .optional()
        .transform((v) => (v && /^\d+$/.test(v) ? parseInt(v, 10) : undefined)),
    status: z.enum(['PROCESSED', 'FAILED', 'PENDING']).optional(),
    search: z.string().optional(),
    date_from: DateOnlySchema.optional(),
    date_to: DateOnlySchema.optional(),
});

export type AdminWebhookEventsQueryType = z.infer<typeof AdminWebhookEventsQuerySchema>;
