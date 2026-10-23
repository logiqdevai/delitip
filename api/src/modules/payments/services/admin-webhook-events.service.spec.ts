import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { AdminWebhookEventsService } from './admin-webhook-events.service';

describe('AdminWebhookEventsService', () => {
    let service: AdminWebhookEventsService;
    const prisma = {
        webhookEvent: {
            findMany: jest.fn(),
            count: jest.fn(),
        },
    };

    const baseQuery = { page: 1, limit: 20 };

    beforeEach(async () => {
        jest.resetAllMocks();
        prisma.webhookEvent.findMany.mockResolvedValue([]);
        prisma.webhookEvent.count.mockResolvedValue(0);

        const module: TestingModule = await Test.createTestingModule({
            providers: [AdminWebhookEventsService, { provide: PrismaService, useValue: prisma }],
        }).compile();
        service = module.get(AdminWebhookEventsService);
    });

    const lastWhere = () => prisma.webhookEvent.findMany.mock.calls[0][0].where;

    it('returns a paginated list ordered newest first', async () => {
        prisma.webhookEvent.findMany.mockResolvedValue([{ id: 'e1' }]);
        prisma.webhookEvent.count.mockResolvedValue(41);

        const result = await service.findAll({ ...baseQuery, page: 2 });

        expect(prisma.webhookEvent.findMany).toHaveBeenCalledWith({
            where: {},
            skip: 20,
            take: 20,
            orderBy: { created_at: 'desc' },
        });
        expect(result.data).toEqual([{ id: 'e1' }]);
        expect(result.pagination).toMatchObject({ total: 41, page: 2, total_pages: 3, has_next: true, has_prev: true });
    });

    it('filters by event type', async () => {
        await service.findAll({ ...baseQuery, event_type_id: 1796 });
        expect(lastWhere()).toEqual({ event_type_id: 1796 });
    });

    it.each([
        ['PROCESSED', { processed_at: { not: null } }],
        ['FAILED', { processing_error: { not: null } }],
        ['PENDING', { processed_at: null, processing_error: null }],
    ] as const)('maps %s status to the matching columns', async (status, expected) => {
        await service.findAll({ ...baseQuery, status });
        expect(lastWhere()).toEqual(expected);
    });

    it('treats date_to as inclusive of the whole day', async () => {
        await service.findAll({ ...baseQuery, date_from: '2026-10-01', date_to: '2026-10-02' });
        expect(lastWhere().created_at).toEqual({
            gte: new Date('2026-10-01'),
            lt: new Date('2026-10-03'),
        });
    });

    it('searches message id, error text and transaction id', async () => {
        await service.findAll({ ...baseQuery, search: 'abc' });
        expect(lastWhere().OR).toEqual([
            { message_id: { contains: 'abc', mode: 'insensitive' } },
            { processing_error: { contains: 'abc', mode: 'insensitive' } },
            { payload: { path: ['EventData', 'TransactionId'], equals: 'abc' } },
        ]);
    });

    it('also matches a numeric search against the order code', async () => {
        await service.findAll({ ...baseQuery, search: '1234567890' });
        expect(lastWhere().OR).toContainEqual({
            payload: { path: ['EventData', 'OrderCode'], equals: 1234567890 },
        });
    });
});
