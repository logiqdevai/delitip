import { z } from 'zod';

export const ManualPayoutSchema = z.object({
    tip_ids: z.array(z.string().min(1)).min(1).max(100),
});

export type ManualPayoutType = z.infer<typeof ManualPayoutSchema>;
