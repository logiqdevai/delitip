import { NotFoundException } from '@nestjs/common';
import { AuthRole, Language, OrganizationRole, StoreIndustry, SubscriptionPlan, SubscriptionStatus } from 'generated/prisma';
import { OrganizationsService } from './organizations.service';

describe('OrganizationsService', () => {
    let service: OrganizationsService;
    let prisma: any;
    let accessControl: any;

    const user = { id: 'u1', role: AuthRole.USER };

    beforeEach(() => {
        prisma = {
            organization: { findUnique: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn() },
            organizationMember: { create: jest.fn(), findMany: jest.fn() },
            subscription: { create: jest.fn() },
            store: { findUnique: jest.fn(), create: jest.fn() },
            reviewCategory: { createMany: jest.fn() },
            feedbackQuestion: { createMany: jest.fn() },
            reviewTag: { createMany: jest.fn() },
            $transaction: jest.fn((fn) => fn(prisma)),
        };
        accessControl = { assertOrgAccess: jest.fn() };
        service = new OrganizationsService(prisma, accessControl);
    });

    describe('create', () => {
        it('creates an Organization, an OWNER membership, and a TRIALING subscription without a store', async () => {
            prisma.organization.findUnique.mockResolvedValue(null); // slug is unique on first try
            prisma.organization.create.mockResolvedValue({ id: 'org1', name: 'Acme', slug: 'acme' });

            const result = await service.create(user, { name: 'Acme' } as any);

            expect(prisma.organization.create).toHaveBeenCalledWith({ data: { name: 'Acme', slug: 'acme' } });
            expect(prisma.organizationMember.create).toHaveBeenCalledWith({
                data: { organization_id: 'org1', user_id: 'u1', role: OrganizationRole.OWNER, store_id: null },
            });
            expect(prisma.subscription.create).toHaveBeenCalledWith({
                data: expect.objectContaining({
                    organization_id: 'org1',
                    plan: SubscriptionPlan.STARTER,
                    status: SubscriptionStatus.TRIALING,
                }),
            });
            const subscriptionData = prisma.subscription.create.mock.calls[0][0].data;
            const periodDays =
                (subscriptionData.current_period_end.getTime() - subscriptionData.current_period_start.getTime()) /
                (24 * 60 * 60 * 1000);
            expect(periodDays).toBeCloseTo(14);
            expect(prisma.store.create).not.toHaveBeenCalled();
            expect(result).toEqual({ id: 'org1', name: 'Acme', slug: 'acme', store: null });
        });

        it('disambiguates the slug when the base slug is already taken', async () => {
            prisma.organization.findUnique.mockResolvedValueOnce({ id: 'other' }).mockResolvedValueOnce(null);
            prisma.organization.create.mockResolvedValue({ id: 'org2', name: 'Acme', slug: 'acme-1' });

            await service.create(user, { name: 'Acme' } as any);

            expect(prisma.organization.create).toHaveBeenCalledWith({ data: { name: 'Acme', slug: 'acme-1' } });
        });

        it('also creates the initial Store when dto.store is provided', async () => {
            prisma.organization.findUnique.mockResolvedValue(null);
            prisma.organization.create.mockResolvedValue({ id: 'org1', name: 'Acme', slug: 'acme' });
            prisma.store.findUnique.mockResolvedValue(null);
            prisma.store.create.mockResolvedValue({
                id: 'store1',
                name: 'Acme Downtown',
                slug: 'acme-downtown',
                industry: StoreIndustry.RESTAURANT,
                primary_language: Language.EN,
            });

            const result = await service.create(user, {
                name: 'Acme',
                store: { name: 'Acme Downtown', industry: StoreIndustry.RESTAURANT },
            } as any);

            expect(prisma.store.create).toHaveBeenCalledWith({
                data: {
                    organization_id: 'org1',
                    name: 'Acme Downtown',
                    slug: 'acme-downtown',
                    industry: StoreIndustry.RESTAURANT,
                },
            });
            expect(prisma.reviewCategory.createMany).toHaveBeenCalledWith({
                data: expect.arrayContaining([expect.objectContaining({ store_id: 'store1' })]),
            });
            expect(prisma.feedbackQuestion.createMany).toHaveBeenCalledWith({
                data: expect.arrayContaining([expect.objectContaining({ store_id: 'store1' })]),
            });
            expect(prisma.reviewTag.createMany).toHaveBeenCalledWith({
                data: expect.arrayContaining([expect.objectContaining({ store_id: 'store1' })]),
            });
            expect(result).toEqual({
                id: 'org1',
                name: 'Acme',
                slug: 'acme',
                store: {
                    id: 'store1',
                    name: 'Acme Downtown',
                    slug: 'acme-downtown',
                    industry: StoreIndustry.RESTAURANT,
                    primary_language: Language.EN,
                },
            });
        });
    });

    describe('findMine', () => {
        it('maps org-level memberships to { role, organization }', async () => {
            prisma.organizationMember.findMany.mockResolvedValue([
                { role: OrganizationRole.OWNER, organization: { id: 'org1' }, store_id: null },
                { role: OrganizationRole.STORE_MANAGER, organization: { id: 'org2' }, store_id: null },
            ]);

            const result = await service.findMine(user);

            expect(prisma.organizationMember.findMany).toHaveBeenCalledWith({
                where: { user_id: 'u1', store_id: null },
                include: { organization: { include: { stores: true, subscription: true } } },
            });
            expect(result).toEqual([
                { role: OrganizationRole.OWNER, organization: { id: 'org1' } },
                { role: OrganizationRole.STORE_MANAGER, organization: { id: 'org2' } },
            ]);
        });
    });

    describe('findOne', () => {
        it('checks org access then throws NotFoundException when the org does not exist', async () => {
            prisma.organization.findUnique.mockResolvedValue(null);

            await expect(service.findOne(user, 'org1')).rejects.toThrow(NotFoundException);
            expect(accessControl.assertOrgAccess).toHaveBeenCalledWith(user, 'org1');
        });

        it('returns the organization with stores and subscription included', async () => {
            const org = { id: 'org1', stores: [], subscription: {} };
            prisma.organization.findUnique.mockResolvedValue(org);

            await expect(service.findOne(user, 'org1')).resolves.toBe(org);
        });
    });

    describe('update', () => {
        it('requires OWNER role and updates the organization', async () => {
            prisma.organization.update.mockResolvedValue({ id: 'org1', name: 'New name' });

            const result = await service.update(user, 'org1', { name: 'New name' } as any);

            expect(accessControl.assertOrgAccess).toHaveBeenCalledWith(user, 'org1', [OrganizationRole.OWNER]);
            expect(prisma.organization.update).toHaveBeenCalledWith({ where: { id: 'org1' }, data: { name: 'New name' } });
            expect(result).toEqual({ id: 'org1', name: 'New name' });
        });

        it('propagates the ForbiddenException from access control without updating', async () => {
            const { ForbiddenException } = require('@nestjs/common');
            accessControl.assertOrgAccess.mockRejectedValue(new ForbiddenException());

            await expect(service.update(user, 'org1', {} as any)).rejects.toThrow(ForbiddenException);
            expect(prisma.organization.update).not.toHaveBeenCalled();
        });
    });

    describe('remove', () => {
        it('requires OWNER role, deletes the organization, and returns success', async () => {
            const result = await service.remove(user, 'org1');

            expect(accessControl.assertOrgAccess).toHaveBeenCalledWith(user, 'org1', [OrganizationRole.OWNER]);
            expect(prisma.organization.delete).toHaveBeenCalledWith({ where: { id: 'org1' } });
            expect(result).toEqual({ success: true });
        });
    });
});
