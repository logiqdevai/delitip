import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { AccessControlService, AuthUser } from '@/shared/services/access-control/access-control.service';
import { CreateReviewTagDto } from '../dto/create-review-tag.dto';
import { UpdateReviewTagDto } from '../dto/update-review-tag.dto';
import { ReviewTagQueryType } from '../dto/review-tag-query.schema';
import { OrganizationRole } from 'generated/prisma';

const MANAGE_ROLES: OrganizationRole[] = [OrganizationRole.OWNER, OrganizationRole.STORE_MANAGER];

@Injectable()
export class ReviewTagsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly accessControl: AccessControlService,
    ) { }

    async create(user: AuthUser, storeId: string, dto: CreateReviewTagDto) {
        await this.accessControl.assertStoreAccess(user, storeId, MANAGE_ROLES);

        const existing = await this.prisma.reviewTag.findUnique({
            where: { store_id_name: { store_id: storeId, name: dto.name } },
        });
        if (existing) throw new ConflictException('A review tag with this name already exists for this store');

        return this.prisma.reviewTag.create({
            data: {
                store_id: storeId,
                name: dto.name,
                sentiment: dto.sentiment,
            },
        });
    }

    async findAll(user: AuthUser, storeId: string, query: ReviewTagQueryType) {
        await this.accessControl.assertStoreAccess(user, storeId);

        return this.prisma.reviewTag.findMany({
            where: {
                store_id: storeId,
                ...(query.sentiment !== undefined && { sentiment: query.sentiment }),
                ...(query.is_active !== undefined && { is_active: query.is_active }),
            },
            orderBy: { created_at: 'desc' },
        });
    }

    async update(user: AuthUser, storeId: string, id: string, dto: UpdateReviewTagDto) {
        await this.accessControl.assertStoreAccess(user, storeId, MANAGE_ROLES);

        const tag = await this.prisma.reviewTag.findFirst({ where: { id, store_id: storeId } });
        if (!tag) throw new NotFoundException('Review tag not found');

        if (dto.name !== undefined && dto.name !== tag.name) {
            const existing = await this.prisma.reviewTag.findUnique({
                where: { store_id_name: { store_id: storeId, name: dto.name } },
            });
            if (existing) throw new ConflictException('A review tag with this name already exists for this store');
        }

        return this.prisma.reviewTag.update({
            where: { id },
            data: {
                ...(dto.name !== undefined && { name: dto.name }),
                ...(dto.sentiment !== undefined && { sentiment: dto.sentiment }),
                ...(dto.is_active !== undefined && { is_active: dto.is_active }),
            },
        });
    }

    async remove(user: AuthUser, storeId: string, id: string) {
        await this.accessControl.assertStoreAccess(user, storeId, MANAGE_ROLES);

        const tag = await this.prisma.reviewTag.findFirst({ where: { id, store_id: storeId } });
        if (!tag) throw new NotFoundException('Review tag not found');

        await this.prisma.reviewTag.delete({ where: { id } });
        return { success: true };
    }
}
