import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { AuthRole, OrganizationRole } from 'generated/prisma';
import { AccessControlService } from './access-control.service';

describe('AccessControlService', () => {
    let service: AccessControlService;
    let prisma: any;

    beforeEach(() => {
        prisma = {
            organizationMember: { findFirst: jest.fn(), findMany: jest.fn() },
            store: { findUnique: jest.fn(), findMany: jest.fn() },
            employee: { findUnique: jest.fn() },
        };
        service = new AccessControlService(prisma);
    });

    describe('isPlatformAdmin', () => {
        it('returns true for ADMIN', () => {
            expect(service.isPlatformAdmin({ id: 'u1', role: AuthRole.ADMIN })).toBe(true);
        });

        it('returns true for SUPER_ADMIN', () => {
            expect(service.isPlatformAdmin({ id: 'u1', role: AuthRole.SUPER_ADMIN })).toBe(true);
        });

        it('returns false for any other role', () => {
            expect(service.isPlatformAdmin({ id: 'u1', role: AuthRole.USER })).toBe(false);
        });
    });

    describe('assertOrgAccess', () => {
        const user = { id: 'u1', role: AuthRole.USER };

        it('short-circuits with null for a platform admin without querying Prisma', async () => {
            const result = await service.assertOrgAccess({ id: 'u1', role: AuthRole.ADMIN }, 'org1');

            expect(result).toBeNull();
            expect(prisma.organizationMember.findFirst).not.toHaveBeenCalled();
        });

        it('throws ForbiddenException when there is no org-level membership', async () => {
            prisma.organizationMember.findFirst.mockResolvedValue(null);

            await expect(service.assertOrgAccess(user, 'org1')).rejects.toThrow(ForbiddenException);
            expect(prisma.organizationMember.findFirst).toHaveBeenCalledWith({
                where: { organization_id: 'org1', user_id: 'u1', store_id: null },
            });
        });

        it('returns the membership when found and no role restriction is given', async () => {
            const membership = { role: OrganizationRole.STORE_MANAGER };
            prisma.organizationMember.findFirst.mockResolvedValue(membership);

            await expect(service.assertOrgAccess(user, 'org1')).resolves.toBe(membership);
        });

        it('throws ForbiddenException when the membership role is not in allowedRoles', async () => {
            prisma.organizationMember.findFirst.mockResolvedValue({ role: OrganizationRole.STORE_MANAGER });

            await expect(service.assertOrgAccess(user, 'org1', [OrganizationRole.OWNER])).rejects.toThrow(ForbiddenException);
        });

        it('returns the membership when its role is in allowedRoles', async () => {
            const membership = { role: OrganizationRole.OWNER };
            prisma.organizationMember.findFirst.mockResolvedValue(membership);

            await expect(
                service.assertOrgAccess(user, 'org1', [OrganizationRole.OWNER, OrganizationRole.STORE_MANAGER]),
            ).resolves.toBe(membership);
        });
    });

    describe('assertStoreAccess', () => {
        const user = { id: 'u1', role: AuthRole.USER };

        it('throws NotFoundException when the store does not exist', async () => {
            prisma.store.findUnique.mockResolvedValue(null);

            await expect(service.assertStoreAccess(user, 'store1')).rejects.toThrow(NotFoundException);
        });

        it('returns a null membership for a platform admin without querying membership tables', async () => {
            prisma.store.findUnique.mockResolvedValue({ id: 'store1', organization_id: 'org1' });

            const result = await service.assertStoreAccess({ id: 'u1', role: AuthRole.SUPER_ADMIN }, 'store1');

            expect(result).toEqual({ membership: null, organizationId: 'org1' });
            expect(prisma.organizationMember.findFirst).not.toHaveBeenCalled();
        });

        it('prefers an org-level membership over a store-level lookup', async () => {
            prisma.store.findUnique.mockResolvedValue({ id: 'store1', organization_id: 'org1' });
            const orgMembership = { role: OrganizationRole.OWNER };
            prisma.organizationMember.findFirst.mockResolvedValueOnce(orgMembership);

            const result = await service.assertStoreAccess(user, 'store1');

            expect(result).toEqual({ membership: orgMembership, organizationId: 'org1' });
            // only the org-level lookup should run — the store-level lookup is short-circuited
            expect(prisma.organizationMember.findFirst).toHaveBeenCalledTimes(1);
            expect(prisma.organizationMember.findFirst).toHaveBeenCalledWith({
                where: { organization_id: 'org1', user_id: 'u1', store_id: null },
            });
        });

        it('falls back to a store-level membership when there is no org-level membership', async () => {
            prisma.store.findUnique.mockResolvedValue({ id: 'store1', organization_id: 'org1' });
            const storeMembership = { role: OrganizationRole.STORE_MANAGER };
            prisma.organizationMember.findFirst
                .mockResolvedValueOnce(null) // org-level lookup
                .mockResolvedValueOnce(storeMembership); // store-level lookup

            const result = await service.assertStoreAccess(user, 'store1');

            expect(result).toEqual({ membership: storeMembership, organizationId: 'org1' });
            expect(prisma.organizationMember.findFirst).toHaveBeenNthCalledWith(2, {
                where: { organization_id: 'org1', user_id: 'u1', store_id: 'store1' },
            });
        });

        it('throws ForbiddenException when neither org-level nor store-level membership exists', async () => {
            prisma.store.findUnique.mockResolvedValue({ id: 'store1', organization_id: 'org1' });
            prisma.organizationMember.findFirst.mockResolvedValue(null);

            await expect(service.assertStoreAccess(user, 'store1')).rejects.toThrow(ForbiddenException);
        });

        it('throws ForbiddenException when the resolved membership role is not in allowedRoles', async () => {
            prisma.store.findUnique.mockResolvedValue({ id: 'store1', organization_id: 'org1' });
            prisma.organizationMember.findFirst.mockResolvedValueOnce({ role: OrganizationRole.STORE_MANAGER });

            await expect(service.assertStoreAccess(user, 'store1', [OrganizationRole.OWNER])).rejects.toThrow(ForbiddenException);
        });

        it('returns the membership when its role is in allowedRoles', async () => {
            prisma.store.findUnique.mockResolvedValue({ id: 'store1', organization_id: 'org1' });
            const membership = { role: OrganizationRole.OWNER };
            prisma.organizationMember.findFirst.mockResolvedValueOnce(membership);

            await expect(service.assertStoreAccess(user, 'store1', [OrganizationRole.OWNER])).resolves.toEqual({
                membership,
                organizationId: 'org1',
            });
        });
    });

    describe('getAccessibleStoreIds', () => {
        const user = { id: 'u1', role: AuthRole.USER };

        it('returns every store in the org for a platform admin', async () => {
            prisma.store.findMany.mockResolvedValue([{ id: 's1' }, { id: 's2' }]);

            const result = await service.getAccessibleStoreIds({ id: 'u1', role: AuthRole.ADMIN }, 'org1');

            expect(result).toEqual(['s1', 's2']);
            expect(prisma.store.findMany).toHaveBeenCalledWith({ where: { organization_id: 'org1' }, select: { id: true } });
            expect(prisma.organizationMember.findFirst).not.toHaveBeenCalled();
        });

        it('returns every store in the org for an org-level member', async () => {
            prisma.organizationMember.findFirst.mockResolvedValue({ role: OrganizationRole.OWNER });
            prisma.store.findMany.mockResolvedValue([{ id: 's1' }, { id: 's2' }]);

            const result = await service.getAccessibleStoreIds(user, 'org1');

            expect(result).toEqual(['s1', 's2']);
        });

        it('returns only the assigned stores for a store-level-only member', async () => {
            prisma.organizationMember.findFirst.mockResolvedValue(null);
            prisma.organizationMember.findMany.mockResolvedValue([{ store_id: 's1' }, { store_id: 's3' }]);

            const result = await service.getAccessibleStoreIds(user, 'org1');

            expect(result).toEqual(['s1', 's3']);
            expect(prisma.organizationMember.findMany).toHaveBeenCalledWith({
                where: { organization_id: 'org1', user_id: 'u1', store_id: { not: null } },
                select: { store_id: true },
            });
            expect(prisma.store.findMany).not.toHaveBeenCalled();
        });

        it('returns an empty array when the user has no membership at all', async () => {
            prisma.organizationMember.findFirst.mockResolvedValue(null);
            prisma.organizationMember.findMany.mockResolvedValue([]);

            await expect(service.getAccessibleStoreIds(user, 'org1')).resolves.toEqual([]);
        });
    });

    describe('assertEmployeeSelfOrStoreAccess', () => {
        const user = { id: 'u1', role: AuthRole.USER };

        it('throws NotFoundException when the employee does not exist', async () => {
            prisma.employee.findUnique.mockResolvedValue(null);

            await expect(service.assertEmployeeSelfOrStoreAccess(user, 'emp1')).rejects.toThrow(NotFoundException);
        });

        it('returns isSelf: true without checking store access when the employee is the current user', async () => {
            const employee = { id: 'emp1', user_id: 'u1', store_id: 'store1' };
            prisma.employee.findUnique.mockResolvedValue(employee);
            const assertStoreAccessSpy = jest.spyOn(service, 'assertStoreAccess');

            const result = await service.assertEmployeeSelfOrStoreAccess(user, 'emp1');

            expect(result).toEqual({ employee, isSelf: true });
            expect(assertStoreAccessSpy).not.toHaveBeenCalled();
        });

        it('delegates to assertStoreAccess and returns isSelf: false for a different user', async () => {
            const employee = { id: 'emp1', user_id: 'someone-else', store_id: 'store1' };
            prisma.employee.findUnique.mockResolvedValue(employee);
            const assertStoreAccessSpy = jest
                .spyOn(service, 'assertStoreAccess')
                .mockResolvedValue({ membership: { role: OrganizationRole.OWNER } as any, organizationId: 'org1' });

            const result = await service.assertEmployeeSelfOrStoreAccess(user, 'emp1', [OrganizationRole.OWNER]);

            expect(result).toEqual({ employee, isSelf: false });
            expect(assertStoreAccessSpy).toHaveBeenCalledWith(user, 'store1', [OrganizationRole.OWNER]);
        });

        it('propagates a rejection from assertStoreAccess for a different user without store access', async () => {
            const employee = { id: 'emp1', user_id: 'someone-else', store_id: 'store1' };
            prisma.employee.findUnique.mockResolvedValue(employee);
            jest.spyOn(service, 'assertStoreAccess').mockRejectedValue(new ForbiddenException());

            await expect(service.assertEmployeeSelfOrStoreAccess(user, 'emp1')).rejects.toThrow(ForbiddenException);
        });
    });
});
