import { z } from 'zod';
import { PaginationQuerySchema } from '@/shared/utils/pagination/pagination-query.schema';

export const SettlementsQuerySchema = PaginationQuerySchema.extend({
  employee_id: z.string().optional(),
  date_from: z.string().optional(),
  date_to: z.string().optional(),
  // Settlements the employee hasn't acknowledged yet — the ones a Store may
  // still need to chase.
  unconfirmed_only: z
    .string()
    .optional()
    .transform((value) => value === 'true'),
});

export type SettlementsQueryType = z.infer<typeof SettlementsQuerySchema>;

export const OwedDistributionsQuerySchema = PaginationQuerySchema.extend({
  employee_id: z.string(),
  date_from: z.string().optional(),
  date_to: z.string().optional(),
});

export type OwedDistributionsQueryType = z.infer<typeof OwedDistributionsQuerySchema>;

export const SettlementBalancesQuerySchema = z.object({
  date_from: z.string().optional(),
  date_to: z.string().optional(),
  // Employees who are square by default drop out of the list; this keeps them.
  include_settled: z
    .string()
    .optional()
    .transform((value) => value === 'true'),
});

export type SettlementBalancesQueryType = z.infer<typeof SettlementBalancesQuerySchema>;

export const SettlementsExportQuerySchema = z.object({
  employee_id: z.string().optional(),
  date_from: z.string().optional(),
  date_to: z.string().optional(),
});

export type SettlementsExportQueryType = z.infer<typeof SettlementsExportQuerySchema>;
