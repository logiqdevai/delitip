import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { AccessControlService, AuthUser } from '@/shared/services/access-control/access-control.service';
import { paginate } from '@/shared/utils/pagination/pagination-query.schema';
import { AlertsQueryType } from '../dto/alerts-query.schema';

@Injectable()
export class AlertsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly accessControl: AccessControlService,
    ) { }

    async findAll(user: AuthUser, storeId: string, query: AlertsQueryType) {
        await this.accessControl.assertStoreAccess(user, storeId);

        const where: Record<string, unknown> = { store_id: storeId };
        if (query.is_read !== undefined) where.is_read = query.is_read;
        if (query.type) where.type = query.type;
        if (query.employee_id) where.employee_id = query.employee_id;

        const [items, total] = await Promise.all([
            this.prisma.alert.findMany({
                where,
                orderBy: { created_at: 'desc' },
                skip: (query.page - 1) * query.limit,
                take: query.limit,
            }),
            this.prisma.alert.count({ where }),
        ]);

        return paginate(items, total, query);
    }

    async markRead(user: AuthUser, id: string) {
        const alert = await this.prisma.alert.findUnique({ where: { id } });
        if (!alert) throw new NotFoundException('Alert not found');

        await this.accessControl.assertStoreAccess(user, alert.store_id);

        return this.prisma.alert.update({ where: { id }, data: { is_read: true } });
    }

    async markAllRead(user: AuthUser, storeId: string) {
        await this.accessControl.assertStoreAccess(user, storeId);

        const result = await this.prisma.alert.updateMany({
            where: { store_id: storeId, is_read: false },
            data: { is_read: true },
        });

        return { success: true, updated_count: result.count };
    }
}
