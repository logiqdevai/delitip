import { z } from 'zod';

export const ReviewCategoryQuerySchema = z.object({
    is_active: z
        .enum(['true', 'false'])
        .optional()
        .transform((v) => (v === undefined ? undefined : v === 'true')),
});

export type ReviewCategoryQueryType = z.infer<typeof ReviewCategoryQuerySchema>;
