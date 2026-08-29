import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { AccessControlService, AuthUser } from '@/shared/services/access-control/access-control.service';
import { autoTranslateStub, TranslatedText } from '@/shared/utils/translation/translation.utils';
import { CreateReviewCategoryDto } from '../dto/create-review-category.dto';
import { UpdateReviewCategoryDto } from '../dto/update-review-category.dto';
import { ReviewCategoryQueryType } from '../dto/review-category-query.schema';
import { OrganizationRole } from 'generated/prisma';

const MANAGE_ROLES: OrganizationRole[] = [OrganizationRole.OWNER, OrganizationRole.STORE_MANAGER];

@Injectable()
export class ReviewCategoriesService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly accessControl: AccessControlService,
    ) { }

    async create(user: AuthUser, storeId: string, dto: CreateReviewCategoryDto) {
        await this.accessControl.assertStoreAccess(user, storeId, MANAGE_ROLES);

        const store = await this.prisma.store.findUnique({ where: { id: storeId } });
        if (!store) throw new NotFoundException('Store not found');

        const name = autoTranslateStub(store.primary_language, dto.name, store.supported_languages);

        return this.prisma.reviewCategory.create({
            data: {
                store_id: storeId,
                name,
                sort_order: dto.sort_order ?? 0,
            },
        });
    }

    async findAll(user: AuthUser, storeId: string, query: ReviewCategoryQueryType) {
        await this.accessControl.assertStoreAccess(user, storeId);

        return this.prisma.reviewCategory.findMany({
            where: {
                store_id: storeId,
                ...(query.is_active !== undefined && { is_active: query.is_active }),
            },
            orderBy: { sort_order: 'asc' },
        });
    }

    async update(user: AuthUser, storeId: string, id: string, dto: UpdateReviewCategoryDto) {
        await this.accessControl.assertStoreAccess(user, storeId, MANAGE_ROLES);

        const category = await this.prisma.reviewCategory.findFirst({ where: { id, store_id: storeId } });
        if (!category) throw new NotFoundException('Review category not found');

        let name = category.name;
        if (dto.name !== undefined) {
            const store = await this.prisma.store.findUnique({ where: { id: storeId } });
            if (!store) throw new NotFoundException('Store not found');
            name = autoTranslateStub(store.primary_language, dto.name, store.supported_languages, category.name as TranslatedText);
        }

        return this.prisma.reviewCategory.update({
            where: { id },
            data: {
                ...(dto.name !== undefined && { name }),
                ...(dto.is_active !== undefined && { is_active: dto.is_active }),
                ...(dto.sort_order !== undefined && { sort_order: dto.sort_order }),
            },
        });
    }

    async remove(user: AuthUser, storeId: string, id: string) {
        await this.accessControl.assertStoreAccess(user, storeId, MANAGE_ROLES);

        const category = await this.prisma.reviewCategory.findFirst({ where: { id, store_id: storeId } });
        if (!category) throw new NotFoundException('Review category not found');

        await this.prisma.reviewCategory.delete({ where: { id } });
        return { success: true };
    }
}
