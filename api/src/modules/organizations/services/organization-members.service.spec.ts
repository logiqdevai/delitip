import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { AuthRole, OrganizationRole } from 'generated/prisma';
import { OrganizationMembersService } from './organization-members.service';

describe('OrganizationMembersService', () => {
    let service: OrganizationMembersService;
    let prisma: any;
    let accessControl: any;
    let usersService: any;

    const user = { id: 'u1', role: AuthRole.USER };

    beforeEach(() => {
        prisma = {
            organizationMember: { findMany: jest.fn(), findFirst: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn() },
            store: { findFirst: jest.fn() },
        };
        accessControl = { assertOrgAccess: jest.fn() };
        usersService = { findOrCreateByEmail: jest.fn() };
        service = new OrganizationMembersService(prisma, accessControl, usersService);
    });

    describe('findAll', () => {
        it('checks org access and lists members ordered by creation date', async () => {
            const members = [{ id: 'm1' }];
            prisma.organizationMember.findMany.mockResolvedValue(members);

            const result = await service.findAll(user, 'org1');

            expect(accessControl.assertOrgAccess).toHaveBeenCalledWith(user, 'org1');
            expect(prisma.organizationMember.findMany).toHaveBeenCalledWith({
                where: { organization_id: 'org1' },
                include: { user: true, store: true },
                orderBy: { created_at: 'asc' },
            });
            expect(result).toBe(members);
        });
    });

    describe('add', () => {
        const dto = { email: 'new@b.com', role: OrganizationRole.STORE_MANAGER } as any;

        it('requires OWNER role', async () => {
            usersService.findOrCreateByEmail.mockResolvedValue({ id: 'mu1' });
            prisma.organizationMember.findFirst.mockResolvedValue(null);
            prisma.organizationMember.create.mockResolvedValue({ id: 'member1' });

            await service.add(user, 'org1', dto);

            expect(accessControl.assertOrgAccess).toHaveBeenCalledWith(user, 'org1', [OrganizationRole.OWNER]);
        });

        it('throws BadRequestException when store_id does not belong to the organization', async () => {
            prisma.store.findFirst.mockResolvedValue(null);

            await expect(service.add(user, 'org1', { ...dto, store_id: 'store1' })).rejects.toThrow(BadRequestException);
            expect(usersService.findOrCreateByEmail).not.toHaveBeenCalled();
        });

        it('throws ConflictException when the user already has that role/scope', async () => {
            prisma.store.findFirst.mockResolvedValue({ id: 'store1' });
            usersService.findOrCreateByEmail.mockResolvedValue({ id: 'mu1' });
            prisma.organizationMember.findFirst.mockResolvedValue({ id: 'existing' });

            await expect(service.add(user, 'org1', { ...dto, store_id: 'store1' })).rejects.toThrow(ConflictException);
            expect(prisma.organizationMember.create).not.toHaveBeenCalled();
        });

        it('finds-or-creates the member user and creates the membership scoped to the org when no store_id is given', async () => {
            usersService.findOrCreateByEmail.mockResolvedValue({ id: 'mu1' });
            prisma.organizationMember.findFirst.mockResolvedValue(null);
            const created = { id: 'member1' };
            prisma.organizationMember.create.mockResolvedValue(created);

            const result = await service.add(user, 'org1', dto);

            expect(usersService.findOrCreateByEmail).toHaveBeenCalledWith('new@b.com', {
                first_name: undefined,
                last_name: undefined,
            });
            expect(prisma.organizationMember.findFirst).toHaveBeenCalledWith({
                where: { organization_id: 'org1', user_id: 'mu1', store_id: null, role: OrganizationRole.STORE_MANAGER },
            });
            expect(prisma.organizationMember.create).toHaveBeenCalledWith({
                data: { organization_id: 'org1', user_id: 'mu1', role: OrganizationRole.STORE_MANAGER, store_id: null },
                include: { user: true, store: true },
            });
            expect(result).toBe(created);
        });

        it('scopes the membership to the store when store_id is given and valid', async () => {
            prisma.store.findFirst.mockResolvedValue({ id: 'store1', organization_id: 'org1' });
            usersService.findOrCreateByEmail.mockResolvedValue({ id: 'mu1' });
            prisma.organizationMember.findFirst.mockResolvedValue(null);
            prisma.organizationMember.create.mockResolvedValue({ id: 'member1' });

            await service.add(user, 'org1', { ...dto, store_id: 'store1' });

            expect(prisma.store.findFirst).toHaveBeenCalledWith({ where: { id: 'store1', organization_id: 'org1' } });
            expect(prisma.organizationMember.create).toHaveBeenCalledWith({
                data: { organization_id: 'org1', user_id: 'mu1', role: OrganizationRole.STORE_MANAGER, store_id: 'store1' },
                include: { user: true, store: true },
            });
        });
    });

    describe('update', () => {
        it('requires OWNER role and throws NotFoundException when the member does not exist', async () => {
            prisma.organizationMember.findFirst.mockResolvedValue(null);

            await expect(service.update(user, 'org1', 'member1', {} as any)).rejects.toThrow(NotFoundException);
            expect(accessControl.assertOrgAccess).toHaveBeenCalledWith(user, 'org1', [OrganizationRole.OWNER]);
        });

        it('throws BadRequestException when the new store_id does not belong to the organization', async () => {
            prisma.organizationMember.findFirst.mockResolvedValueOnce({ id: 'member1' });
            prisma.store.findFirst.mockResolvedValue(null);

            await expect(
                service.update(user, 'org1', 'member1', { store_id: 'store-elsewhere' } as any),
            ).rejects.toThrow(BadRequestException);
        });

        it('updates the role and store_id when valid', async () => {
            prisma.organizationMember.findFirst.mockResolvedValueOnce({ id: 'member1' });
            prisma.store.findFirst.mockResolvedValue({ id: 'store1' });
            const updated = { id: 'member1', role: OrganizationRole.ACCOUNTANT, store_id: 'store1' };
            prisma.organizationMember.update.mockResolvedValue(updated);

            const result = await service.update(user, 'org1', 'member1', {
                role: OrganizationRole.ACCOUNTANT,
                store_id: 'store1',
            } as any);

            expect(prisma.organizationMember.update).toHaveBeenCalledWith({
                where: { id: 'member1' },
                data: { role: OrganizationRole.ACCOUNTANT, store_id: 'store1' },
                include: { user: true, store: true },
            });
            expect(result).toBe(updated);
        });

        it('leaves store_id untouched (undefined) when the dto omits it', async () => {
            prisma.organizationMember.findFirst.mockResolvedValueOnce({ id: 'member1' });
            prisma.organizationMember.update.mockResolvedValue({ id: 'member1' });

            await service.update(user, 'org1', 'member1', { role: OrganizationRole.ACCOUNTANT } as any);

            expect(prisma.organizationMember.update).toHaveBeenCalledWith({
                where: { id: 'member1' },
                data: { role: OrganizationRole.ACCOUNTANT, store_id: undefined },
                include: { user: true, store: true },
            });
        });
    });

    describe('remove', () => {
        it('requires OWNER role and throws NotFoundException when the member does not exist', async () => {
            prisma.organizationMember.findFirst.mockResolvedValue(null);

            await expect(service.remove(user, 'org1', 'member1')).rejects.toThrow(NotFoundException);
            expect(accessControl.assertOrgAccess).toHaveBeenCalledWith(user, 'org1', [OrganizationRole.OWNER]);
            expect(prisma.organizationMember.delete).not.toHaveBeenCalled();
        });

        it('deletes the member and returns success', async () => {
            prisma.organizationMember.findFirst.mockResolvedValue({ id: 'member1' });

            const result = await service.remove(user, 'org1', 'member1');

            expect(prisma.organizationMember.delete).toHaveBeenCalledWith({ where: { id: 'member1' } });
            expect(result).toEqual({ success: true });
        });
    });
});
