import { z } from 'zod';
import { PaginationQuerySchema } from '@/shared/utils/pagination/pagination-query.schema';

export const DistributionsQuerySchema = PaginationQuerySchema.extend({
  payout_status: z.enum(['PENDING', 'PROCESSING', 'PAID', 'FAILED', 'CANCELLED']).optional(),
  recipient_type: z.enum(['STORE', 'EMPLOYEE']).optional(),
  employee_id: z.string().optional(),
  date_from: z.string().optional(),
  date_to: z.string().optional(),
});

export type DistributionsQueryType = z.infer<typeof DistributionsQuerySchema>;
