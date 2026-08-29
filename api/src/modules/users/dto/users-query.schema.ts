import { z } from 'zod';
import { PaginationQuerySchema } from '@/shared/utils/pagination/pagination-query.schema';

export const UsersQuerySchema = PaginationQuerySchema.extend({
    search: z.string().optional(),
});

export type UsersQueryType = z.infer<typeof UsersQuerySchema>;
