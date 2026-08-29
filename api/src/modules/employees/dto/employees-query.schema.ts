import { z } from 'zod';
import { PaginationQuerySchema } from '@/shared/utils/pagination/pagination-query.schema';

export const EmployeesQuerySchema = PaginationQuerySchema.extend({
    is_active: z
        .enum(['true', 'false'])
        .optional()
        .transform((v) => (v === undefined ? undefined : v === 'true')),
});

export type EmployeesQueryType = z.infer<typeof EmployeesQuerySchema>;
