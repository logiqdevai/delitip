import { z } from 'zod';

export const ConfirmProcessorFeeSchema = z.object({
    // Minor units (e.g. 31 = €0.31), as shown on the Viva dashboard.
    fee_amount: z.number().int().min(0),
});

export type ConfirmProcessorFeeType = z.infer<typeof ConfirmProcessorFeeSchema>;
