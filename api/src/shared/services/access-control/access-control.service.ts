import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { OrganizationMember, OrganizationRole } from 'generated/prisma';

export interface AuthUser {
    id: string;
    role: string;
}

const PLATFORM_ADMIN_ROLES = ['ADMIN', 'SUPER_ADMIN'];

@Injectable()
export class AccessControlService {
    constructor(private readonly prisma: PrismaService) { }

    isPlatformAdmin(user: AuthUser): boolean {
        return PLATFORM_ADMIN_ROLES.includes(user.role);
    }

    async assertOrgAccess(
        user: AuthUser,
        organizationId: string,
        allowedRoles?: OrganizationRole[],
    ): Promise<OrganizationMember | null> {
        if (this.isPlatformAdmin(user)) return null;

        const membership = await this.prisma.organizationMember.findFirst({
            where: { organization_id: organizationId, user_id: user.id, store_id: null },
        });

        if (!membership) {
            throw new ForbiddenException('You do not have access to this organization');
        }

        if (allowedRoles && !allowedRoles.includes(membership.role)) {
            throw new ForbiddenException('You do not have permission to perform this action');
        }

        return membership;
    }

    async assertStoreAccess(
        user: AuthUser,
        storeId: string,
        allowedRoles?: OrganizationRole[],
    ): Promise<{ membership: OrganizationMember | null; organizationId: string }> {
        const store = await this.prisma.store.findUnique({ where: { id: storeId } });
        if (!store) throw new NotFoundException('Store not found');

        if (this.isPlatformAdmin(user)) {
            return { membership: null, organizationId: store.organization_id };
        }

        const orgMembership = await this.prisma.organizationMember.findFirst({
            where: { organization_id: store.organization_id, user_id: user.id, store_id: null },
        });

        const storeMembership = orgMembership
            ? null
            : await this.prisma.organizationMember.findFirst({
                where: { organization_id: store.organization_id, user_id: user.id, store_id: storeId },
            });

        const membership = orgMembership || storeMembership;

        if (!membership) {
            throw new ForbiddenException('You do not have access to this store');
        }

        if (allowedRoles && !allowedRoles.includes(membership.role)) {
            throw new ForbiddenException('You do not have permission to perform this action');
        }

        return { membership, organizationId: store.organization_id };
    }

    async getAccessibleStoreIds(user: AuthUser, organizationId: string): Promise<string[]> {
        if (this.isPlatformAdmin(user)) {
            const stores = await this.prisma.store.findMany({
                where: { organization_id: organizationId },
                select: { id: true },
            });
            return stores.map((s) => s.id);
        }

        const orgMembership = await this.prisma.organizationMember.findFirst({
            where: { organization_id: organizationId, user_id: user.id, store_id: null },
        });

        if (orgMembership) {
            const stores = await this.prisma.store.findMany({
                where: { organization_id: organizationId },
                select: { id: true },
            });
            return stores.map((s) => s.id);
        }

        const storeMemberships = await this.prisma.organizationMember.findMany({
            where: { organization_id: organizationId, user_id: user.id, store_id: { not: null } },
            select: { store_id: true },
        });

        return storeMemberships.map((m) => m.store_id);
    }

    async assertEmployeeSelfOrStoreAccess(
        user: AuthUser,
        employeeId: string,
        allowedRoles?: OrganizationRole[],
    ) {
        const employee = await this.prisma.employee.findUnique({ where: { id: employeeId } });
        if (!employee) throw new NotFoundException('Employee not found');

        if (employee.user_id === user.id) {
            return { employee, isSelf: true };
        }

        await this.assertStoreAccess(user, employee.store_id, allowedRoles);
        return { employee, isSelf: false };
    }
}
