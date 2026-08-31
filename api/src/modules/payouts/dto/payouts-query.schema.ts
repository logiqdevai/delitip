import { PaginationQuerySchema } from '@/shared/utils/pagination/pagination-query.schema';

export const PayoutsQuerySchema = PaginationQuerySchema;

export type PayoutsQueryType = ReturnType<typeof PayoutsQuerySchema.parse>;
