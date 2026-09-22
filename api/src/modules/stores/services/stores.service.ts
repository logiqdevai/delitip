import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { AccessControlService, AuthUser } from '@/shared/services/access-control/access-control.service';
import { ensureUniqueSlug, withUniqueSlugRetry } from '@/shared/utils/slug/slug.utils';
import { resolveTranslatedText, sanitizeTranslations, TranslatedText } from '@/shared/utils/translation/translation.utils';
import { seedIndustryReviewConfig } from '@/shared/utils/industry-review-config/seed-industry-review-config.util';
import { seedSampleStoreSetup } from '@/shared/utils/sample-store-setup/seed-sample-store-setup.util';
import { DocumentsService } from '@/modules/documents/services/documents.service';
import { CreateStoreDto } from '../dto/create-store.dto';
import { UpdateStoreDto } from '../dto/update-store.dto';
import { StoreCopyOptions } from '../constants/store-copy-options.constant';
import {
    buildCopiedStoreFields,
    copySourceStoreInclude,
    copyStoreRelations,
    StoreCopyPlan,
} from '../utils/copy-store-settings.util';
import { OrganizationRole } from 'generated/prisma';

@Injectable()
export class StoresService {
    private readonly logger = new Logger(StoresService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly accessControl: AccessControlService,
        private readonly documentsService: DocumentsService,
    ) { }

    async create(user: AuthUser, organizationId: string, dto: CreateStoreDto) {
        await this.accessControl.assertOrgAccess(user, organizationId, [OrganizationRole.OWNER]);

        const { copy_from_store_id, copy_options, ...fields } = dto;
        const copyPlan = copy_from_store_id && copy_options?.length
            ? await this.buildCopyPlan(user, organizationId, copy_from_store_id, copy_options)
            : null;

        try {
            return await withUniqueSlugRetry(() => this.createStore(organizationId, fields, copyPlan));
        } catch (error) {
            // The duplicated branding documents live outside the transaction.
            await this.removeCopiedDocuments(copyPlan);
            throw error;
        }
    }

    private async buildCopyPlan(
        user: AuthUser,
        organizationId: string,
        sourceStoreId: string,
        copyOptions: NonNullable<CreateStoreDto['copy_options']>,
    ): Promise<StoreCopyPlan> {
        const source = await this.prisma.store.findFirst({
            where: { id: sourceStoreId, organization_id: organizationId },
            include: copySourceStoreInclude,
        });
        if (!source) throw new BadRequestException('Store to copy from does not belong to this organization');

        const options = new Set(copyOptions);
        const plan: StoreCopyPlan = { source, options, logoDocumentId: null, coverDocumentId: null };

        if (options.has(StoreCopyOptions.BRANDING)) {
            try {
                if (source.logo_document_id) {
                    plan.logoDocumentId = (await this.documentsService.duplicate(source.logo_document_id, user.id)).id;
                }
                if (source.cover_document_id) {
                    plan.coverDocumentId = (await this.documentsService.duplicate(source.cover_document_id, user.id)).id;
                }
            } catch {
                await this.removeCopiedDocuments(plan);
                throw new BadRequestException("Could not copy the store's logo or cover image");
            }
        }

        return plan;
    }

    private async removeCopiedDocuments(plan: StoreCopyPlan | null) {
        const ids = [plan?.logoDocumentId, plan?.coverDocumentId].filter((id): id is string => !!id);
        await Promise.all(ids.map((id) => this.documentsService.removeById(id).catch(() => undefined)));
    }

    private async createStore(
        organizationId: string,
        dto: Omit<CreateStoreDto, 'copy_from_store_id' | 'copy_options'>,
        copyPlan: StoreCopyPlan | null,
    ) {
        const slug = await ensureUniqueSlug(dto.name, async (candidate) => {
            const existing = await this.prisma.store.findUnique({ where: { slug: candidate } });
            return !!existing;
        });

        return this.prisma.$transaction(async (tx) => {
            let store = await tx.store.create({
                data: {
                    organization_id: organizationId,
                    name: dto.name,
                    slug,
                    industry: dto.industry,
                    primary_language: dto.primary_language,
                    supported_languages: dto.supported_languages,
                    currency: dto.currency,
                    timezone: dto.timezone,
                    address_line: dto.address_line,
                    city: dto.city,
                    country: dto.country,
                    postal_code: dto.postal_code,
                    full_address: dto.full_address ? { ...dto.full_address } : undefined,
                    ...(copyPlan ? buildCopiedStoreFields(copyPlan) : {}),
                },
            });

            if (copyPlan) {
                await copyStoreRelations(tx, copyPlan, store.id);
            }
            if (!copyPlan?.options.has(StoreCopyOptions.REVIEWS)) {
                await seedIndustryReviewConfig(tx, store.id, store.industry, store.primary_language);
            }
            const { distributionRuleId } = await seedSampleStoreSetup(tx, store.id, store.industry);
            store = await tx.store.update({
                where: { id: store.id },
                data: { default_distribution_rule_id: distributionRuleId },
            });

            return store;
        });
    }

    async findAllForOrg(user: AuthUser, organizationId: string) {
        await this.accessControl.assertOrgAccess(user, organizationId);

        const storeIds = await this.accessControl.getAccessibleStoreIds(user, organizationId);

        return this.prisma.store.findMany({
            where: { id: { in: storeIds } },
            include: { logo_document: true },
            orderBy: { created_at: 'desc' },
        });
    }

    async findAllForAdmin() {
        return this.prisma.store.findMany({
            select: { id: true, name: true, slug: true },
            orderBy: { name: 'asc' },
        });
    }

    async findOne(user: AuthUser, id: string) {
        await this.accessControl.assertStoreAccess(user, id);

        const store = await this.prisma.store.findUnique({
            where: { id },
            include: { logo_document: true, cover_document: true },
        });
        if (!store) throw new NotFoundException('Store not found');
        return store;
    }

    async update(user: AuthUser, id: string, dto: UpdateStoreDto) {
        await this.accessControl.assertStoreAccess(user, id, [OrganizationRole.OWNER, OrganizationRole.STORE_MANAGER]);

        const store = await this.prisma.store.findUnique({ where: { id } });
        if (!store) throw new NotFoundException('Store not found');

        if (dto.default_distribution_rule_id) {
            const rule = await this.prisma.distributionRule.findFirst({
                where: { id: dto.default_distribution_rule_id, store_id: id },
            });
            if (!rule) throw new BadRequestException('Distribution rule does not belong to this store');
        }

        const {
            welcome_message_translations,
            thank_you_message_translations,
            ...rest
        } = dto;

        const data: Record<string, unknown> = { ...rest };

        if (welcome_message_translations !== undefined) {
            const existing = (store.welcome_message as TranslatedText) || {};
            data.welcome_message = { ...existing, ...sanitizeTranslations(welcome_message_translations) };
        }

        if (thank_you_message_translations !== undefined) {
            const existing = (store.thank_you_message as TranslatedText) || {};
            data.thank_you_message = { ...existing, ...sanitizeTranslations(thank_you_message_translations) };
        }

        return this.prisma.store.update({ where: { id }, data });
    }

    async remove(user: AuthUser, id: string) {
        await this.accessControl.assertStoreAccess(user, id, [OrganizationRole.OWNER]);

        const store = await this.prisma.store.findUnique({
            where: { id },
            select: {
                organization_id: true,
                logo_document_id: true,
                cover_document_id: true,
                employees: { select: { photo_document_id: true } },
                _count: { select: { tips: true, reviews: true } },
            },
        });
        if (!store) throw new NotFoundException('Store not found');

        const storeCount = await this.prisma.store.count({ where: { organization_id: store.organization_id } });
        if (storeCount <= 1) {
            throw new BadRequestException('An organization must keep at least one store');
        }

        // Tips and reviews are financial/customer records and are never cascade-deleted.
        if (store._count.tips > 0 || store._count.reviews > 0) {
            throw new BadRequestException('This store has tips or reviews and cannot be deleted');
        }

        const documentIds = [
            store.logo_document_id,
            store.cover_document_id,
            ...store.employees.map((employee) => employee.photo_document_id),
        ].filter((documentId): documentId is string => !!documentId);

        await this.prisma.store.delete({ where: { id } });
        await this.removeOrphanedDocuments(documentIds);

        return { success: true };
    }

    // Deletes the store's logo/cover and its employees' photos (rows + storage
    // objects) once the store is gone — skipping any document something else
    // still points at, so a shared file is never pulled from under another record.
    private async removeOrphanedDocuments(documentIds: string[]) {
        if (documentIds.length === 0) return;

        const documents = await this.prisma.document.findMany({
            where: { id: { in: [...new Set(documentIds)] } },
            select: {
                id: true,
                _count: {
                    select: { stores_logo: true, stores_cover: true, organizations_logo: true, employees_photo: true },
                },
            },
        });

        for (const document of documents) {
            const references = Object.values(document._count).reduce((sum, count) => sum + count, 0);
            if (references > 0) continue;

            try {
                await this.documentsService.removeById(document.id);
            } catch (error) {
                this.logger.error(`Failed to remove document ${document.id} after deleting its store`, error);
            }
        }
    }

    async findPublicBySlug(slug: string, lang?: string) {
        const store = await this.prisma.store.findUnique({
            where: { slug },
            include: { logo_document: true, cover_document: true },
        });

        if (!store || !store.is_active) throw new NotFoundException('Store not found');

        return {
            id: store.id,
            name: store.name,
            slug: store.slug,
            industry: store.industry,
            logo_url: store.logo_document?.url ?? null,
            cover_url: store.cover_document?.url ?? null,
            primary_color: store.primary_color,
            secondary_color: store.secondary_color,
            welcome_message: resolveTranslatedText(store.welcome_message as TranslatedText, lang, store.primary_language),
            thank_you_message: resolveTranslatedText(store.thank_you_message as TranslatedText, lang, store.primary_language),
            address_line: store.address_line,
            city: store.city,
            country: store.country,
            postal_code: store.postal_code,
            currency: store.currency,
            suggested_tip_amounts: store.suggested_tip_amounts,
            allow_custom_tip_amount: store.allow_custom_tip_amount,
            primary_language: store.primary_language,
            supported_languages: store.supported_languages,
            public_review_rating_threshold: store.public_review_rating_threshold,
        };
    }
}
