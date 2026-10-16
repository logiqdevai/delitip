import { z } from 'zod';
import { PaginationQuerySchema } from '@/shared/utils/pagination/pagination-query.schema';
import { InvoiceCheckVerdictValues, PayoutRequestStatusValues } from './payout-requests-query.schema';

export const AdminPayoutRequestsQuerySchema = PaginationQuerySchema.extend({
  store_id: z.string().optional(),
  status: z.enum(PayoutRequestStatusValues).optional(),
  verdict: z.enum(InvoiceCheckVerdictValues).optional(),
  search: z.string().optional(),
  date_from: z.string().optional(),
  date_to: z.string().optional(),
});

export type AdminPayoutRequestsQueryType = z.infer<typeof AdminPayoutRequestsQuerySchema>;
