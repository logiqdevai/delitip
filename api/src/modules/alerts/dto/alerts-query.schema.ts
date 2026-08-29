import { z } from 'zod';
import { PaginationQuerySchema } from '@/shared/utils/pagination/pagination-query.schema';
import { AlertType } from 'generated/prisma';

export const AlertsQuerySchema = PaginationQuerySchema.extend({
    is_read: z
        .enum(['true', 'false'])
        .optional()
        .transform((v) => (v === undefined ? undefined : v === 'true')),
    type: z.nativeEnum(AlertType).optional(),
    employee_id: z.string().optional(),
});

export type AlertsQueryType = z.infer<typeof AlertsQuerySchema>;
