import { z } from 'zod';

export const AdminOverviewQuerySchema = z.object({
    period: z.enum(['today', '7d', '30d', '90d']).optional().default('30d'),
});

export type AdminOverviewQueryType = z.infer<typeof AdminOverviewQuerySchema>;

export const AdminTrendsQuerySchema = z.object({
    metric: z
        .enum(['users', 'tips_revenue', 'platform_revenue', 'employee_revenue', 'store_revenue'])
        .optional()
        .default('tips_revenue'),
    period: z.enum(['7d', '30d', '90d']).optional().default('30d'),
    group_by: z.enum(['day', 'week', 'month']).optional().default('day'),
    currency: z.enum(['EUR', 'USD', 'GBP', 'TRY', 'RUB', 'AED', 'CNY']).optional(),
});

export type AdminTrendsQueryType = z.infer<typeof AdminTrendsQuerySchema>;
