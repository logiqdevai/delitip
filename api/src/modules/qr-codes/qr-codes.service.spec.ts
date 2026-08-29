import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AuthRole, OrganizationRole, QrCodeSelectionMode, TipStatus } from 'generated/prisma';
import { QrCodesService } from './qr-codes.service';

describe('QrCodesService', () => {
    let service: QrCodesService;
    let prisma: any;
    let accessControl: any;

    const user = { id: 'u1', role: AuthRole.USER };
    const MANAGE_ROLES = [OrganizationRole.OWNER, OrganizationRole.STORE_MANAGER];

    beforeEach(() => {
        prisma = {
            qrCode: { create: jest.fn(), findUnique: jest.fn(), findMany: jest.fn(), count: jest.fn(), update: jest.fn(), delete: jest.fn() },
            qrCodeEmployee: { createMany: jest.fn(), deleteMany: jest.fn() },
            qrCodeSpot: { createMany: jest.fn(), deleteMany: jest.fn() },
            distributionRule: { findFirst: jest.fn() },
            employee: { findMany: jest.fn() },
            spot: { findMany: jest.fn() },
            tip: { count: jest.fn(), aggregate: jest.fn() },
            review: { count: jest.fn() },
            $transaction: jest.fn((fn) => fn(prisma)),
        };
        accessControl = { assertStoreAccess: jest.fn() };
        service = new QrCodesService(prisma, accessControl);
    });

    describe('create', () => {
        const baseDto = { label: 'Table 1' } as any;

        beforeEach(() => {
            // code-availability check inside ensureUniqueQrCode
            prisma.qrCode.findUnique.mockImplementation(({ where }: any) =>
                where.code ? Promise.resolve(null) : Promise.resolve({ id: 'qr1' }),
            );
        });

        it('asserts MANAGE_ROLES store access before doing anything else', async () => {
            prisma.qrCode.create.mockResolvedValue({ id: 'qr1' });

            await service.create(user, 'store1', baseDto);

            expect(accessControl.assertStoreAccess).toHaveBeenCalledWith(user, 'store1', MANAGE_ROLES);
        });

        it('throws BadRequestException when distribution_rule_id does not belong to the store', async () => {
            prisma.distributionRule.findFirst.mockResolvedValue(null);

            await expect(
                service.create(user, 'store1', { ...baseDto, distribution_rule_id: 'rule1' }),
            ).rejects.toThrow(BadRequestException);
            expect(prisma.qrCode.create).not.toHaveBeenCalled();
        });

        it('throws BadRequestException when one or more employee_ids do not belong to the store', async () => {
            prisma.employee.findMany.mockResolvedValue([{ id: 'e1' }]); // only 1 of 2 found

            await expect(
                service.create(user, 'store1', { ...baseDto, employee_ids: ['e1', 'e2'] }),
            ).rejects.toThrow(BadRequestException);
        });

        it('throws BadRequestException when one or more spot_ids do not belong to the store', async () => {
            prisma.spot.findMany.mockResolvedValue([]); // none found

            await expect(
                service.create(user, 'store1', { ...baseDto, spot_ids: ['s1'] }),
            ).rejects.toThrow(BadRequestException);
        });

        it('creates the QR code with a generated code and defaults selection_mode to CHOOSE_ONE', async () => {
            const full = { id: 'qr1', code: 'ABC12345' };
            prisma.qrCode.create.mockResolvedValue({ id: 'qr1' });
            prisma.qrCode.findUnique.mockImplementation(({ where }: any) =>
                where.code ? Promise.resolve(null) : Promise.resolve(full),
            );

            const result = await service.create(user, 'store1', baseDto);

            expect(prisma.qrCode.create).toHaveBeenCalledWith({
                data: expect.objectContaining({
                    store_id: 'store1',
                    label: 'Table 1',
                    selection_mode: QrCodeSelectionMode.CHOOSE_ONE,
                    distribution_rule_id: null,
                }),
            });
            expect(prisma.qrCodeEmployee.createMany).not.toHaveBeenCalled();
            expect(prisma.qrCodeSpot.createMany).not.toHaveBeenCalled();
            expect(result).toBe(full);
        });

        it('respects an explicit selection_mode and creates employee/spot links when provided', async () => {
            prisma.employee.findMany.mockResolvedValue([{ id: 'e1' }, { id: 'e2' }]);
            prisma.spot.findMany.mockResolvedValue([{ id: 's1' }]);
            prisma.qrCode.create.mockResolvedValue({ id: 'qr1' });

            await service.create(user, 'store1', {
                ...baseDto,
                selection_mode: QrCodeSelectionMode.TEAM,
                employee_ids: ['e1', 'e2'],
                spot_ids: ['s1'],
            });

            expect(prisma.qrCode.create).toHaveBeenCalledWith({
                data: expect.objectContaining({ selection_mode: QrCodeSelectionMode.TEAM }),
            });
            expect(prisma.qrCodeEmployee.createMany).toHaveBeenCalledWith({
                data: [
                    { qr_code_id: 'qr1', employee_id: 'e1' },
                    { qr_code_id: 'qr1', employee_id: 'e2' },
                ],
            });
            expect(prisma.qrCodeSpot.createMany).toHaveBeenCalledWith({
                data: [{ qr_code_id: 'qr1', spot_id: 's1' }],
            });
        });
    });

    describe('findAllForStore', () => {
        it('asserts store access (no role restriction) and paginates', async () => {
            prisma.qrCode.findMany.mockResolvedValue([{ id: 'qr1' }]);
            prisma.qrCode.count.mockResolvedValue(1);

            const result = await service.findAllForStore(user, 'store1', { page: 1, limit: 20 } as any);

            expect(accessControl.assertStoreAccess).toHaveBeenCalledWith(user, 'store1');
            expect(result.data).toEqual([{ id: 'qr1' }]);
        });

        it('applies the is_active filter when provided', async () => {
            prisma.qrCode.findMany.mockResolvedValue([]);
            prisma.qrCode.count.mockResolvedValue(0);

            await service.findAllForStore(user, 'store1', { page: 1, limit: 20, is_active: true } as any);

            expect(prisma.qrCode.findMany).toHaveBeenCalledWith(
                expect.objectContaining({ where: { store_id: 'store1', is_active: true } }),
            );
        });
    });

    describe('findOne', () => {
        it('throws NotFoundException when the QR code does not exist', async () => {
            prisma.qrCode.findUnique.mockResolvedValue(null);

            await expect(service.findOne(user, 'qr1')).rejects.toThrow(NotFoundException);
        });

        it('asserts store access and re-fetches with the full include', async () => {
            prisma.qrCode.findUnique
                .mockResolvedValueOnce({ id: 'qr1', store_id: 'store1' })
                .mockResolvedValueOnce({ id: 'qr1', store_id: 'store1', employees: [] });

            const result = await service.findOne(user, 'qr1');

            expect(accessControl.assertStoreAccess).toHaveBeenCalledWith(user, 'store1');
            expect(result).toEqual({ id: 'qr1', store_id: 'store1', employees: [] });
        });
    });

    describe('update', () => {
        it('throws NotFoundException when the QR code does not exist', async () => {
            prisma.qrCode.findUnique.mockResolvedValue(null);

            await expect(service.update(user, 'qr1', {} as any)).rejects.toThrow(NotFoundException);
        });

        it('asserts MANAGE_ROLES access and validates refs before updating', async () => {
            prisma.qrCode.findUnique.mockResolvedValueOnce({ id: 'qr1', store_id: 'store1' });
            prisma.distributionRule.findFirst.mockResolvedValue(null);

            await expect(
                service.update(user, 'qr1', { distribution_rule_id: 'bad-rule' } as any),
            ).rejects.toThrow(BadRequestException);
            expect(accessControl.assertStoreAccess).toHaveBeenCalledWith(user, 'store1', MANAGE_ROLES);
            expect(prisma.qrCode.update).not.toHaveBeenCalled();
        });

        it('only writes fields present on the DTO', async () => {
            prisma.qrCode.findUnique
                .mockResolvedValueOnce({ id: 'qr1', store_id: 'store1' })
                .mockResolvedValueOnce({ id: 'qr1', label: 'New label' });

            await service.update(user, 'qr1', { label: 'New label' } as any);

            expect(prisma.qrCode.update).toHaveBeenCalledWith({ where: { id: 'qr1' }, data: { label: 'New label' } });
        });

        it('replaces employee links when employee_ids is a non-empty array', async () => {
            prisma.qrCode.findUnique
                .mockResolvedValueOnce({ id: 'qr1', store_id: 'store1' })
                .mockResolvedValueOnce({ id: 'qr1' });
            prisma.employee.findMany.mockResolvedValue([{ id: 'e1' }]);

            await service.update(user, 'qr1', { employee_ids: ['e1'] } as any);

            expect(prisma.qrCodeEmployee.deleteMany).toHaveBeenCalledWith({ where: { qr_code_id: 'qr1' } });
            expect(prisma.qrCodeEmployee.createMany).toHaveBeenCalledWith({ data: [{ qr_code_id: 'qr1', employee_id: 'e1' }] });
        });

        it('clears employee links (delete only, no create) when employee_ids is an empty array', async () => {
            prisma.qrCode.findUnique
                .mockResolvedValueOnce({ id: 'qr1', store_id: 'store1' })
                .mockResolvedValueOnce({ id: 'qr1' });

            await service.update(user, 'qr1', { employee_ids: [] } as any);

            expect(prisma.qrCodeEmployee.deleteMany).toHaveBeenCalledWith({ where: { qr_code_id: 'qr1' } });
            expect(prisma.qrCodeEmployee.createMany).not.toHaveBeenCalled();
        });

        it('leaves employee links untouched when employee_ids is not provided', async () => {
            prisma.qrCode.findUnique
                .mockResolvedValueOnce({ id: 'qr1', store_id: 'store1' })
                .mockResolvedValueOnce({ id: 'qr1' });

            await service.update(user, 'qr1', { label: 'x' } as any);

            expect(prisma.qrCodeEmployee.deleteMany).not.toHaveBeenCalled();
            expect(prisma.qrCodeEmployee.createMany).not.toHaveBeenCalled();
        });
    });

    describe('remove', () => {
        it('throws NotFoundException when the QR code does not exist', async () => {
            prisma.qrCode.findUnique.mockResolvedValue(null);

            await expect(service.remove(user, 'qr1')).rejects.toThrow(NotFoundException);
            expect(prisma.qrCode.delete).not.toHaveBeenCalled();
        });

        it('asserts MANAGE_ROLES access, deletes, and returns success', async () => {
            prisma.qrCode.findUnique.mockResolvedValue({ id: 'qr1', store_id: 'store1' });

            const result = await service.remove(user, 'qr1');

            expect(accessControl.assertStoreAccess).toHaveBeenCalledWith(user, 'store1', MANAGE_ROLES);
            expect(prisma.qrCode.delete).toHaveBeenCalledWith({ where: { id: 'qr1' } });
            expect(result).toEqual({ success: true });
        });
    });

    describe('stats', () => {
        it('throws NotFoundException when the QR code does not exist', async () => {
            prisma.qrCode.findUnique.mockResolvedValue(null);

            await expect(service.stats(user, 'qr1')).rejects.toThrow(NotFoundException);
        });

        it('asserts store access (no role restriction) and aggregates tip/review stats', async () => {
            prisma.qrCode.findUnique.mockResolvedValue({ id: 'qr1', store_id: 'store1' });
            prisma.tip.count.mockResolvedValue(12);
            prisma.tip.aggregate.mockResolvedValue({ _sum: { amount: 4500 } });
            prisma.review.count.mockResolvedValue(3);

            const result = await service.stats(user, 'qr1');

            expect(accessControl.assertStoreAccess).toHaveBeenCalledWith(user, 'store1');
            expect(prisma.tip.aggregate).toHaveBeenCalledWith({
                where: { qr_code_id: 'qr1', status: TipStatus.COMPLETED },
                _sum: { amount: true },
            });
            expect(result).toEqual({ tips_count: 12, tips_total_amount: 4500, reviews_count: 3 });
        });

        it('defaults tips_total_amount to 0 when there are no completed tips', async () => {
            prisma.qrCode.findUnique.mockResolvedValue({ id: 'qr1', store_id: 'store1' });
            prisma.tip.count.mockResolvedValue(0);
            prisma.tip.aggregate.mockResolvedValue({ _sum: { amount: null } });
            prisma.review.count.mockResolvedValue(0);

            const result = await service.stats(user, 'qr1');

            expect(result.tips_total_amount).toBe(0);
        });
    });

    describe('findPublicByCode', () => {
        const buildQrCode = (overrides: Partial<any> = {}) => ({
            id: 'qr1',
            label: 'Table 1',
            selection_mode: QrCodeSelectionMode.CHOOSE_ONE,
            is_active: true,
            store: {
                id: 'store1',
                name: 'Store',
                slug: 'store',
                currency: 'EUR',
                suggested_tip_amounts: [100, 200],
                allow_custom_tip_amount: true,
                primary_color: '#000',
                secondary_color: '#fff',
                is_active: true,
                logo_document: null,
            },
            employees: [],
            spots: [],
            ...overrides,
        });

        it('throws NotFoundException when no QR code matches the code', async () => {
            prisma.qrCode.findUnique.mockResolvedValue(null);

            await expect(service.findPublicByCode('nope')).rejects.toThrow(NotFoundException);
        });

        it('throws NotFoundException when the QR code is inactive', async () => {
            prisma.qrCode.findUnique.mockResolvedValue(buildQrCode({ is_active: false }));

            await expect(service.findPublicByCode('code1')).rejects.toThrow(NotFoundException);
        });

        it('throws NotFoundException when the store is inactive', async () => {
            prisma.qrCode.findUnique.mockResolvedValue(
                buildQrCode({ store: { ...buildQrCode().store, is_active: false } }),
            );

            await expect(service.findPublicByCode('code1')).rejects.toThrow(NotFoundException);
        });

        it('returns the public shape, filters out inactive employees, and null-coalesces missing photo/logo urls', async () => {
            prisma.qrCode.findUnique.mockResolvedValue(
                buildQrCode({
                    employees: [
                        { employee: { id: 'e1', full_name: 'Active One', position: 'Waiter', is_active: true, photo_document: null } },
                        { employee: { id: 'e2', full_name: 'Inactive One', position: 'Waiter', is_active: false, photo_document: null } },
                        {
                            employee: {
                                id: 'e3',
                                full_name: 'Has Photo',
                                position: 'Chef',
                                is_active: true,
                                photo_document: { url: 'https://example.com/e3.png' },
                            },
                        },
                    ],
                    spots: [{ spot: { id: 's1', name: 'Table 1' } }],
                }),
            );

            const result = await service.findPublicByCode('code1');

            expect(result.qr_code).toEqual({ id: 'qr1', label: 'Table 1', selection_mode: QrCodeSelectionMode.CHOOSE_ONE });
            expect(result.store.logo_url).toBeNull();
            expect(result.spots).toEqual([{ id: 's1', name: 'Table 1' }]);
            expect(result.employees).toEqual([
                { id: 'e1', full_name: 'Active One', position: 'Waiter', photo_url: null },
                { id: 'e3', full_name: 'Has Photo', position: 'Chef', photo_url: 'https://example.com/e3.png' },
            ]);
        });
    });
});
