import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { AccessControlService, AuthUser } from '@/shared/services/access-control/access-control.service';
import { ensureUniqueSlug, withUniqueSlugRetry } from '@/shared/utils/slug/slug.utils';
import { resolveTranslatedText, sanitizeTranslations, TranslatedText } from '@/shared/utils/translation/translation.utils';
import { seedIndustryReviewConfig } from '@/shared/utils/industry-review-config/seed-industry-review-config.util';
import { seedSampleStoreSetup } from '@/shared/utils/sample-store-setup/seed-sample-store-setup.util';
import { CreateStoreDto } from '../dto/create-store.dto';
import { UpdateStoreDto } from '../dto/update-store.dto';
import { OrganizationRole } from 'generated/prisma';

@Injectable()
export class StoresService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly accessControl: AccessControlService,
    ) { }

    async create(user: AuthUser, organizationId: string, dto: CreateStoreDto) {
        await this.accessControl.assertOrgAccess(user, organizationId, [OrganizationRole.OWNER]);

        return withUniqueSlugRetry(() => this.createStore(organizationId, dto));
    }

    private async createStore(organizationId: string, dto: CreateStoreDto) {
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
                },
            });

            await seedIndustryReviewConfig(tx, store.id, store.industry, store.primary_language);
            const { distributionRuleId } = await seedSampleStoreSetup(tx, store.id);
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

        await this.prisma.store.delete({ where: { id } });
        return { success: true };
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
