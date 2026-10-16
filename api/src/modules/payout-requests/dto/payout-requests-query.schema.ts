import { z } from 'zod';
import { PaginationQuerySchema } from '@/shared/utils/pagination/pagination-query.schema';

export const PayoutRequestStatusValues = ['PENDING_REVIEW', 'APPROVED', 'REJECTED', 'CANCELLED'] as const;
export const InvoiceCheckVerdictValues = ['MATCH', 'MISMATCH', 'UNREADABLE'] as const;

export const PayoutRequestsQuerySchema = PaginationQuerySchema.extend({
  status: z.enum(PayoutRequestStatusValues).optional(),
});

export type PayoutRequestsQueryType = z.infer<typeof PayoutRequestsQuerySchema>;
