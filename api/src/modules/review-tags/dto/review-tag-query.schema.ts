import { z } from 'zod';
import { ReviewSentiment } from 'generated/prisma';

export const ReviewTagQuerySchema = z.object({
    sentiment: z.nativeEnum(ReviewSentiment).optional(),
    is_active: z
        .enum(['true', 'false'])
        .optional()
        .transform((v) => (v === undefined ? undefined : v === 'true')),
});

export type ReviewTagQueryType = z.infer<typeof ReviewTagQuerySchema>;
