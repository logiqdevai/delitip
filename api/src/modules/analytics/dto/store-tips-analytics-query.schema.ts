import { z } from 'zod';

export const StoreTipsAnalyticsQuerySchema = z.object({
    date_from: z.string().optional(),
    date_to: z.string().optional(),
    employee_id: z.string().optional(),
    qr_code_id: z.string().optional(),
    group_by: z.enum(['day', 'week', 'month', 'employee', 'store']).optional().default('day'),
});

export type StoreTipsAnalyticsQueryType = z.infer<typeof StoreTipsAnalyticsQuerySchema>;
