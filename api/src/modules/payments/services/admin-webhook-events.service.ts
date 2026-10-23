import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { paginate } from '@/shared/utils/pagination/pagination-query.schema';
import { AdminWebhookEventsQueryType } from '../dto/admin-webhook-events-query.schema';

const DAY_MS = 24 * 60 * 60 * 1000;

@Injectable()
export class AdminWebhookEventsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: AdminWebhookEventsQueryType) {
    const where: Prisma.WebhookEventWhereInput = {};

    if (query.event_type_id !== undefined) where.event_type_id = query.event_type_id;

    // processed_at is only set on success and processing_error only on
    // failure, so "pending" is the row that has neither (still in flight, or
    // the process died before updating it).
    if (query.status === 'PROCESSED') where.processed_at = { not: null };
    if (query.status === 'FAILED') where.processing_error = { not: null };
    if (query.status === 'PENDING') {
      where.processed_at = null;
      where.processing_error = null;
    }

    if (query.date_from || query.date_to) {
      where.created_at = {};
      if (query.date_from) where.created_at.gte = new Date(query.date_from);
      // date_to is a calendar day and should include all of it.
      if (query.date_to) where.created_at.lt = new Date(new Date(query.date_to).getTime() + DAY_MS);
    }

    if (query.search) {
      const term = query.search.trim();
      const or: Prisma.WebhookEventWhereInput[] = [
        { message_id: { contains: term, mode: 'insensitive' } },
        { processing_error: { contains: term, mode: 'insensitive' } },
        { payload: { path: ['EventData', 'TransactionId'], equals: term } },
      ];
      // Viva's OrderCode is numeric in the payload.
      if (/^\d+$/.test(term)) {
        or.push({ payload: { path: ['EventData', 'OrderCode'], equals: Number(term) } });
      }
      where.OR = or;
    }

    const [items, total] = await Promise.all([
      this.prisma.webhookEvent.findMany({
        where,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.webhookEvent.count({ where }),
    ]);

    return paginate(items, total, query);
  }
}
