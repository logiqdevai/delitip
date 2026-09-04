import { z } from 'zod';

export const TipsExportQuerySchema = z.object({
    employee_id: z.string().optional(),
    qr_code_id: z.string().optional(),
    status: z
        .enum([
            'PENDING',
            'CREATED',
            'PROCESSING',
            'COMPLETED',
            'FAILED',
            'CANCELLED',
            'REFUNDED',
        ])
        .optional(),
    date_from: z.string().optional(),
    date_to: z.string().optional(),
});

export type TipsExportQueryType = z.infer<typeof TipsExportQuerySchema>;
