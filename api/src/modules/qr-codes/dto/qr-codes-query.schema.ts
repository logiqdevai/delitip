import { z } from 'zod';
import { PaginationQuerySchema } from '@/shared/utils/pagination/pagination-query.schema';

const csvToArray = z
    .string()
    .optional()
    .transform((v) => (v ? v.split(',').filter(Boolean) : undefined));

export const QrCodesQuerySchema = PaginationQuerySchema.extend({
    is_active: z
        .string()
        .optional()
        .transform((v) => (v === undefined ? undefined : v === 'true')),
    employee_ids: csvToArray,
    spot_ids: csvToArray,
    distribution_rule_ids: csvToArray,
});

export type QrCodesQueryType = z.infer<typeof QrCodesQuerySchema>;
