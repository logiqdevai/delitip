import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { AccessControlService, AuthUser } from '@/shared/services/access-control/access-control.service';
import { ensureUniqueSlug, withUniqueSlugRetry } from '@/shared/utils/slug/slug.utils';
import { seedIndustryReviewConfig } from '@/shared/utils/industry-review-config/seed-industry-review-config.util';
import { seedSampleStoreSetup } from '@/shared/utils/sample-store-setup/seed-sample-store-setup.util';
import { CreateOrganizationDto } from '../dto/create-organization.dto';
import { UpdateOrganizationDto } from '../dto/update-organization.dto';
import { OrganizationRole, SubscriptionPlan, SubscriptionStatus } from 'generated/prisma';

const TRIAL_PERIOD_DAYS = 14;

@Injectable()
export class OrganizationsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly accessControl: AccessControlService,
    ) { }

    async create(user: AuthUser, dto: CreateOrganizationDto) {
        return withUniqueSlugRetry(() => this.createOrganization(user, dto));
    }

    private async createOrganization(user: AuthUser, dto: CreateOrganizationDto) {
        const slug = await ensureUniqueSlug(dto.name, async (candidate) => {
            const existing = await this.prisma.organization.findUnique({ where: { slug: candidate } });
            return !!existing;
        });

        const now = new Date();
        const periodEnd = new Date(now.getTime() + TRIAL_PERIOD_DAYS * 24 * 60 * 60 * 1000);

        return this.prisma.$transaction(async (tx) => {
            const organization = await tx.organization.create({
                data: { name: dto.name, slug },
            });

            await tx.organizationMember.create({
                data: {
                    organization_id: organization.id,
                    user_id: user.id,
                    role: OrganizationRole.OWNER,
                    store_id: null,
                },
            });

            await tx.subscription.create({
                data: {
                    organization_id: organization.id,
                    plan: SubscriptionPlan.ENTERPRISE,
                    status: SubscriptionStatus.TRIALING,
                    current_period_start: now,
                    current_period_end: periodEnd,
                },
            });

            let store = null;
            if (dto.store) {
                const storeSlug = await ensureUniqueSlug(dto.store.name, async (candidate) => {
                    const existing = await tx.store.findUnique({ where: { slug: candidate } });
                    return !!existing;
                });

                store = await tx.store.create({
                    data: {
                        organization_id: organization.id,
                        name: dto.store.name,
                        slug: storeSlug,
                        industry: dto.store.industry,
                    },
                });

                await seedIndustryReviewConfig(tx, store.id, store.industry, store.primary_language);
                const { distributionRuleId } = await seedSampleStoreSetup(tx, store.id, store.industry);
                store = await tx.store.update({
                    where: { id: store.id },
                    data: { default_distribution_rule_id: distributionRuleId },
                });
            }

            return { ...organization, store };
        });
    }

    async findMine(user: AuthUser) {
        const memberships = await this.prisma.organizationMember.findMany({
            where: { user_id: user.id, store_id: null },
            include: {
                organization: {
                    include: { stores: true, subscription: true },
                },
            },
        });

        return memberships.map((m) => ({ role: m.role, organization: m.organization }));
    }

    async findOne(user: AuthUser, id: string) {
        await this.accessControl.assertOrgAccess(user, id);

        const organization = await this.prisma.organization.findUnique({
            where: { id },
            include: { stores: true, subscription: true },
        });

        if (!organization) throw new NotFoundException('Organization not found');
        return organization;
    }

    async update(user: AuthUser, id: string, dto: UpdateOrganizationDto) {
        await this.accessControl.assertOrgAccess(user, id, [OrganizationRole.OWNER]);

        const { full_address, ...rest } = dto;
        const data: Record<string, unknown> = { ...rest };
        if (full_address !== undefined) {
            data.full_address = { ...full_address };
        }

        return this.prisma.organization.update({ where: { id }, data });
    }

    async remove(user: AuthUser, id: string) {
        await this.accessControl.assertOrgAccess(user, id, [OrganizationRole.OWNER]);

        await this.prisma.organization.delete({ where: { id } });
        return { success: true };
    }
}
