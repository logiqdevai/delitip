import { z } from 'zod';

export const TrendsQuerySchema = z.object({
    store_id: z.string().optional(),
    metric: z.enum(['tips', 'reviews', 'rating']).optional().default('tips'),
    period: z.enum(['7d', '30d', '90d']).optional().default('7d'),
    group_by: z.enum(['day', 'week', 'month']).optional().default('day'),
});

export type TrendsQueryType = z.infer<typeof TrendsQuerySchema>;
