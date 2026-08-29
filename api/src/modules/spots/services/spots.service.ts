import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { AccessControlService, AuthUser } from '@/shared/services/access-control/access-control.service';
import { paginate } from '@/shared/utils/pagination/pagination-query.schema';
import { CreateSpotDto } from '../dto/create-spot.dto';
import { UpdateSpotDto } from '../dto/update-spot.dto';
import { SpotsQueryType } from '../dto/spots-query.schema';
import { OrganizationRole } from 'generated/prisma';

@Injectable()
export class SpotsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly accessControl: AccessControlService,
    ) { }

    async create(user: AuthUser, storeId: string, dto: CreateSpotDto) {
        await this.accessControl.assertStoreAccess(user, storeId, [OrganizationRole.OWNER, OrganizationRole.STORE_MANAGER]);

        return this.prisma.spot.create({
            data: { store_id: storeId, name: dto.name },
        });
    }

    async findAllForStore(user: AuthUser, storeId: string, query: SpotsQueryType) {
        await this.accessControl.assertStoreAccess(user, storeId);

        const where = {
            store_id: storeId,
            ...(query.is_active !== undefined && { is_active: query.is_active }),
        };

        const [items, total] = await Promise.all([
            this.prisma.spot.findMany({
                where,
                skip: (query.page - 1) * query.limit,
                take: query.limit,
                orderBy: { created_at: 'desc' },
            }),
            this.prisma.spot.count({ where }),
        ]);

        return paginate(items, total, query);
    }

    async findOne(user: AuthUser, id: string) {
        const spot = await this.prisma.spot.findUnique({ where: { id } });
        if (!spot) throw new NotFoundException('Spot not found');

        await this.accessControl.assertStoreAccess(user, spot.store_id);

        return spot;
    }

    async update(user: AuthUser, id: string, dto: UpdateSpotDto) {
        const spot = await this.prisma.spot.findUnique({ where: { id } });
        if (!spot) throw new NotFoundException('Spot not found');

        await this.accessControl.assertStoreAccess(user, spot.store_id, [OrganizationRole.OWNER, OrganizationRole.STORE_MANAGER]);

        return this.prisma.spot.update({ where: { id }, data: dto });
    }

    async remove(user: AuthUser, id: string) {
        const spot = await this.prisma.spot.findUnique({ where: { id } });
        if (!spot) throw new NotFoundException('Spot not found');

        await this.accessControl.assertStoreAccess(user, spot.store_id, [OrganizationRole.OWNER, OrganizationRole.STORE_MANAGER]);

        await this.prisma.spot.delete({ where: { id } });
        return { success: true };
    }
}
