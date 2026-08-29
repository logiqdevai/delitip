import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AuthRole, DistributionRecipientType, OrganizationRole } from 'generated/prisma';
import { DistributionRulesService } from './distribution-rules.service';

describe('DistributionRulesService', () => {
    let service: DistributionRulesService;
    let prisma: any;
    let accessControl: any;

    const user = { id: 'u1', role: AuthRole.USER };
    const MANAGE_ROLES = [OrganizationRole.OWNER, OrganizationRole.STORE_MANAGER];

    const storeRecipient = (percentage: number, sort_order?: number) => ({
        recipient_type: DistributionRecipientType.STORE,
        percentage,
        sort_order,
    });

    const employeeRecipient = (employee_id: string, percentage: number, sort_order?: number) => ({
        recipient_type: DistributionRecipientType.EMPLOYEE,
        employee_id,
        percentage,
        sort_order,
    });

    beforeEach(() => {
        prisma = {
            employee: { findMany: jest.fn().mockResolvedValue([]) },
            distributionRule: {
                create: jest.fn(),
                findMany: jest.fn(),
                findUnique: jest.fn(),
                findFirst: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
            },
            distributionRuleRecipient: { createMany: jest.fn(), deleteMany: jest.fn() },
            store: { update: jest.fn() },
            $transaction: jest.fn((fn) => fn(prisma)),
        };
        accessControl = { assertStoreAccess: jest.fn() };
        service = new DistributionRulesService(prisma, accessControl);
    });

    describe('create (validateRecipients via create)', () => {
        it('throws BadRequestException when there are no recipients', async () => {
            await expect(
                service.create(user, 'store1', { name: 'Split', recipients: [] } as any),
            ).rejects.toThrow(BadRequestException);
        });

        it('throws BadRequestException when an EMPLOYEE recipient is missing employee_id', async () => {
            const dto = { name: 'Split', recipients: [{ recipient_type: DistributionRecipientType.EMPLOYEE, percentage: 100 }] } as any;

            await expect(service.create(user, 'store1', dto)).rejects.toThrow(BadRequestException);
        });

        it('throws BadRequestException when a STORE recipient has an employee_id set', async () => {
            const dto = {
                name: 'Split',
                recipients: [{ recipient_type: DistributionRecipientType.STORE, employee_id: 'e1', percentage: 100 }],
            } as any;

            await expect(service.create(user, 'store1', dto)).rejects.toThrow(BadRequestException);
        });

        it('throws BadRequestException when a named employee does not belong to the store', async () => {
            prisma.employee.findMany.mockResolvedValue([]); // none found
            const dto = { name: 'Split', recipients: [employeeRecipient('e1', 100)] } as any;

            await expect(service.create(user, 'store1', dto)).rejects.toThrow(BadRequestException);
            expect(prisma.employee.findMany).toHaveBeenCalledWith({
                where: { id: { in: ['e1'] }, store_id: 'store1' },
                select: { id: true },
            });
        });

        it('throws BadRequestException when recipient percentages do not sum to 100', async () => {
            const dto = { name: 'Split', recipients: [storeRecipient(50)] } as any;

            await expect(service.create(user, 'store1', dto)).rejects.toThrow(BadRequestException);
        });

        it('tolerates floating point rounding within 0.01 of 100', async () => {
            prisma.distributionRule.create.mockResolvedValue({ id: 'rule1' });
            prisma.distributionRule.findUnique.mockResolvedValue({ id: 'rule1' });
            const dto = { name: 'Split', recipients: [storeRecipient(33.34), storeRecipient(33.33), storeRecipient(33.33)] } as any;

            await expect(service.create(user, 'store1', dto)).resolves.toBeDefined();
        });

        it('asserts store access with the manage roles before validating', async () => {
            const dto = { name: 'Split', recipients: [storeRecipient(100)] } as any;
            prisma.distributionRule.create.mockResolvedValue({ id: 'rule1' });
            prisma.distributionRule.findUnique.mockResolvedValue({ id: 'rule1' });

            await service.create(user, 'store1', dto);

            expect(accessControl.assertStoreAccess).toHaveBeenCalledWith(user, 'store1', MANAGE_ROLES);
        });

        it('creates the rule and its recipients inside a transaction, defaulting sort_order to array index and nulling employee_id for STORE recipients', async () => {
            prisma.distributionRule.create.mockResolvedValue({ id: 'rule1' });
            prisma.distributionRule.findUnique.mockResolvedValue({ id: 'rule1' });
            const dto = {
                name: 'Split',
                recipients: [employeeRecipient('e1', 60), storeRecipient(40)],
            } as any;
            prisma.employee.findMany.mockResolvedValue([{ id: 'e1' }]);

            await service.create(user, 'store1', dto);

            expect(prisma.$transaction).toHaveBeenCalledTimes(1);
            expect(prisma.distributionRule.create).toHaveBeenCalledWith({ data: { store_id: 'store1', name: 'Split' } });
            expect(prisma.distributionRuleRecipient.createMany).toHaveBeenCalledWith({
                data: [
                    { distribution_rule_id: 'rule1', recipient_type: DistributionRecipientType.EMPLOYEE, employee_id: 'e1', percentage: 60, sort_order: 0 },
                    { distribution_rule_id: 'rule1', recipient_type: DistributionRecipientType.STORE, employee_id: null, percentage: 40, sort_order: 1 },
                ],
            });
        });

        it('respects an explicit sort_order over the array index', async () => {
            prisma.distributionRule.create.mockResolvedValue({ id: 'rule1' });
            prisma.distributionRule.findUnique.mockResolvedValue({ id: 'rule1' });
            const dto = { name: 'Split', recipients: [storeRecipient(100, 7)] } as any;

            await service.create(user, 'store1', dto);

            expect(prisma.distributionRuleRecipient.createMany).toHaveBeenCalledWith({
                data: [expect.objectContaining({ sort_order: 7 })],
            });
        });
    });

    describe('findAllForStore', () => {
        it('asserts store access (no role restriction) and lists rules for the store', async () => {
            prisma.distributionRule.findMany.mockResolvedValue([{ id: 'rule1' }]);

            const result = await service.findAllForStore(user, 'store1');

            expect(accessControl.assertStoreAccess).toHaveBeenCalledWith(user, 'store1');
            expect(prisma.distributionRule.findMany).toHaveBeenCalledWith(
                expect.objectContaining({ where: { store_id: 'store1' } }),
            );
            expect(result).toEqual([{ id: 'rule1' }]);
        });
    });

    describe('findOne', () => {
        it('throws NotFoundException when the rule does not exist', async () => {
            prisma.distributionRule.findUnique.mockResolvedValue(null);

            await expect(service.findOne(user, 'missing')).rejects.toThrow(NotFoundException);
        });

        it('asserts store access via the rule\'s store_id (no role restriction)', async () => {
            prisma.distributionRule.findUnique
                .mockResolvedValueOnce({ id: 'rule1', store_id: 'store1' })
                .mockResolvedValueOnce({ id: 'rule1', store_id: 'store1', recipients: [] });

            const result = await service.findOne(user, 'rule1');

            expect(accessControl.assertStoreAccess).toHaveBeenCalledWith(user, 'store1');
            expect(result).toEqual({ id: 'rule1', store_id: 'store1', recipients: [] });
        });
    });

    describe('update', () => {
        it('throws NotFoundException when the rule does not exist', async () => {
            prisma.distributionRule.findUnique.mockResolvedValue(null);

            await expect(service.update(user, 'missing', {} as any)).rejects.toThrow(NotFoundException);
        });

        it('asserts store access with the manage roles', async () => {
            prisma.distributionRule.findUnique.mockResolvedValue({ id: 'rule1', store_id: 'store1' });

            await service.update(user, 'rule1', {} as any);

            expect(accessControl.assertStoreAccess).toHaveBeenCalledWith(user, 'store1', MANAGE_ROLES);
        });

        it('updates only the name when recipients are not provided', async () => {
            prisma.distributionRule.findUnique
                .mockResolvedValueOnce({ id: 'rule1', store_id: 'store1' })
                .mockResolvedValueOnce({ id: 'rule1', name: 'New name' });

            await service.update(user, 'rule1', { name: 'New name' } as any);

            expect(prisma.distributionRule.update).toHaveBeenCalledWith({ where: { id: 'rule1' }, data: { name: 'New name' } });
            expect(prisma.$transaction).not.toHaveBeenCalled();
            expect(prisma.distributionRuleRecipient.deleteMany).not.toHaveBeenCalled();
        });

        it('does nothing when neither name nor recipients are provided', async () => {
            prisma.distributionRule.findUnique
                .mockResolvedValueOnce({ id: 'rule1', store_id: 'store1' })
                .mockResolvedValueOnce({ id: 'rule1' });

            await service.update(user, 'rule1', {} as any);

            expect(prisma.distributionRule.update).not.toHaveBeenCalled();
        });

        it('replaces all recipients inside a transaction when recipients are provided, re-validating them first', async () => {
            prisma.distributionRule.findUnique.mockResolvedValueOnce({ id: 'rule1', store_id: 'store1' });
            prisma.employee.findMany.mockResolvedValue([{ id: 'e1' }]);
            prisma.distributionRule.findUnique.mockResolvedValueOnce({ id: 'rule1' });

            await service.update(user, 'rule1', { recipients: [employeeRecipient('e1', 100)] } as any);

            expect(prisma.$transaction).toHaveBeenCalledTimes(1);
            expect(prisma.distributionRuleRecipient.deleteMany).toHaveBeenCalledWith({ where: { distribution_rule_id: 'rule1' } });
            expect(prisma.distributionRuleRecipient.createMany).toHaveBeenCalledWith({
                data: [{ distribution_rule_id: 'rule1', recipient_type: DistributionRecipientType.EMPLOYEE, employee_id: 'e1', percentage: 100, sort_order: 0 }],
            });
        });

        it('throws BadRequestException when replacement recipients do not sum to 100, without touching the rule', async () => {
            prisma.distributionRule.findUnique.mockResolvedValueOnce({ id: 'rule1', store_id: 'store1' });

            await expect(
                service.update(user, 'rule1', { recipients: [storeRecipient(50)] } as any),
            ).rejects.toThrow(BadRequestException);
            expect(prisma.$transaction).not.toHaveBeenCalled();
        });

        it('also updates the name inside the same transaction when both name and recipients are provided', async () => {
            prisma.distributionRule.findUnique.mockResolvedValueOnce({ id: 'rule1', store_id: 'store1' });
            prisma.distributionRule.findUnique.mockResolvedValueOnce({ id: 'rule1' });

            await service.update(user, 'rule1', { name: 'Renamed', recipients: [storeRecipient(100)] } as any);

            expect(prisma.distributionRule.update).toHaveBeenCalledWith({ where: { id: 'rule1' }, data: { name: 'Renamed' } });
        });
    });

    describe('remove', () => {
        it('throws NotFoundException when the rule does not exist', async () => {
            prisma.distributionRule.findUnique.mockResolvedValue(null);

            await expect(service.remove(user, 'missing')).rejects.toThrow(NotFoundException);
        });

        it('asserts store access with the manage roles, deletes the rule, and returns success', async () => {
            prisma.distributionRule.findUnique.mockResolvedValue({ id: 'rule1', store_id: 'store1' });

            const result = await service.remove(user, 'rule1');

            expect(accessControl.assertStoreAccess).toHaveBeenCalledWith(user, 'store1', MANAGE_ROLES);
            expect(prisma.distributionRule.delete).toHaveBeenCalledWith({ where: { id: 'rule1' } });
            expect(result).toEqual({ success: true });
        });
    });

    describe('setDefaultForStore', () => {
        it('asserts store access with the manage roles', async () => {
            prisma.store.update.mockResolvedValue({ id: 'store1', default_distribution_rule_id: null });

            await service.setDefaultForStore(user, 'store1', { distribution_rule_id: null });

            expect(accessControl.assertStoreAccess).toHaveBeenCalledWith(user, 'store1', MANAGE_ROLES);
        });

        it('throws BadRequestException when the rule id does not belong to the store', async () => {
            prisma.distributionRule.findFirst.mockResolvedValue(null);

            await expect(
                service.setDefaultForStore(user, 'store1', { distribution_rule_id: 'other-store-rule' }),
            ).rejects.toThrow(BadRequestException);
        });

        it('clears the default when distribution_rule_id is null, without checking rule ownership', async () => {
            prisma.store.update.mockResolvedValue({ id: 'store1', default_distribution_rule_id: null });

            await service.setDefaultForStore(user, 'store1', { distribution_rule_id: null });

            expect(prisma.distributionRule.findFirst).not.toHaveBeenCalled();
            expect(prisma.store.update).toHaveBeenCalledWith({
                where: { id: 'store1' },
                data: { default_distribution_rule_id: null },
                select: { id: true, default_distribution_rule_id: true },
            });
        });

        it('sets the default when the rule id belongs to the store', async () => {
            prisma.distributionRule.findFirst.mockResolvedValue({ id: 'rule1' });
            prisma.store.update.mockResolvedValue({ id: 'store1', default_distribution_rule_id: 'rule1' });

            const result = await service.setDefaultForStore(user, 'store1', { distribution_rule_id: 'rule1' });

            expect(prisma.distributionRule.findFirst).toHaveBeenCalledWith({ where: { id: 'rule1', store_id: 'store1' } });
            expect(result).toEqual({ id: 'store1', default_distribution_rule_id: 'rule1' });
        });
    });
});
