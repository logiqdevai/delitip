import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { AccessControlService, AuthUser } from '@/shared/services/access-control/access-control.service';
import { UsersService } from '@/modules/users/services/users.service';
import { AddMemberDto } from '../dto/add-member.dto';
import { UpdateMemberDto } from '../dto/update-member.dto';
import { OrganizationRole } from 'generated/prisma';

@Injectable()
export class OrganizationMembersService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly accessControl: AccessControlService,
        private readonly usersService: UsersService,
    ) { }

    async findAll(user: AuthUser, organizationId: string) {
        await this.accessControl.assertOrgAccess(user, organizationId);

        return this.prisma.organizationMember.findMany({
            where: { organization_id: organizationId },
            include: { user: true, store: true },
            orderBy: { created_at: 'asc' },
        });
    }

    async add(user: AuthUser, organizationId: string, dto: AddMemberDto) {
        await this.accessControl.assertOrgAccess(user, organizationId, [OrganizationRole.OWNER]);

        if (dto.store_id) {
            const store = await this.prisma.store.findFirst({
                where: { id: dto.store_id, organization_id: organizationId },
            });
            if (!store) throw new BadRequestException('Store does not belong to this organization');
        }

        const memberUser = await this.usersService.findOrCreateByEmail(dto.email, {
            first_name: dto.first_name,
            last_name: dto.last_name,
        });

        const existing = await this.prisma.organizationMember.findFirst({
            where: {
                organization_id: organizationId,
                user_id: memberUser.id,
                store_id: dto.store_id ?? null,
                role: dto.role,
            },
        });
        if (existing) throw new ConflictException('This member already has that role/scope');

        return this.prisma.organizationMember.create({
            data: {
                organization_id: organizationId,
                user_id: memberUser.id,
                role: dto.role,
                store_id: dto.store_id ?? null,
            },
            include: { user: true, store: true },
        });
    }

    async update(user: AuthUser, organizationId: string, memberId: string, dto: UpdateMemberDto) {
        await this.accessControl.assertOrgAccess(user, organizationId, [OrganizationRole.OWNER]);

        const member = await this.prisma.organizationMember.findFirst({
            where: { id: memberId, organization_id: organizationId },
        });
        if (!member) throw new NotFoundException('Member not found');

        if (dto.store_id) {
            const store = await this.prisma.store.findFirst({
                where: { id: dto.store_id, organization_id: organizationId },
            });
            if (!store) throw new BadRequestException('Store does not belong to this organization');
        }

        return this.prisma.organizationMember.update({
            where: { id: memberId },
            data: {
                role: dto.role,
                store_id: dto.store_id === undefined ? undefined : dto.store_id,
            },
            include: { user: true, store: true },
        });
    }

    async remove(user: AuthUser, organizationId: string, memberId: string) {
        await this.accessControl.assertOrgAccess(user, organizationId, [OrganizationRole.OWNER]);

        const member = await this.prisma.organizationMember.findFirst({
            where: { id: memberId, organization_id: organizationId },
        });
        if (!member) throw new NotFoundException('Member not found');

        await this.prisma.organizationMember.delete({ where: { id: memberId } });
        return { success: true };
    }
}
