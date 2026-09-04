import { z } from 'zod';

export const DashboardQuerySchema = z.object({
    store_id: z.string().optional(),
    period: z.enum(['today', '7d', '30d', 'all']).optional().default('7d'),
});

export type DashboardQueryType = z.infer<typeof DashboardQuerySchema>;

export const PeriodQuerySchema = z.object({
    period: z.enum(['today', '7d', '30d', 'all']).optional().default('7d'),
});

export type PeriodQueryType = z.infer<typeof PeriodQuerySchema>;
