import { z } from 'zod';

export const FeedbackQuestionQuerySchema = z.object({
    is_active: z
        .enum(['true', 'false'])
        .optional()
        .transform((v) => (v === undefined ? undefined : v === 'true')),
});

export type FeedbackQuestionQueryType = z.infer<typeof FeedbackQuestionQuerySchema>;
