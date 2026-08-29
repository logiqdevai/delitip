import { BadRequestException } from '@nestjs/common';
import { AuthRole, AlertType, OrganizationRole } from 'generated/prisma';
import { AlertPreferencesService } from './alert-preferences.service';

describe('AlertPreferencesService', () => {
    let service: AlertPreferencesService;
    let prisma: any;
    let accessControl: any;

    const user = { id: 'u1', role: AuthRole.USER };

    beforeEach(() => {
        prisma = {
            alertPreference: { findMany: jest.fn(), findFirst: jest.fn(), update: jest.fn(), create: jest.fn() },
        };
        accessControl = { assertStoreAccess: jest.fn() };
        service = new AlertPreferencesService(prisma, accessControl);
    });

    describe('findAll', () => {
        it('checks store access and returns every AlertType, defaulting missing rows to enabled', async () => {
            prisma.alertPreference.findMany.mockResolvedValue([
                { alert_type: AlertType.PERFORMANCE_CHANGE, is_enabled: false },
            ]);

            const result = await service.findAll(user, 'store1');

            expect(accessControl.assertStoreAccess).toHaveBeenCalledWith(user, 'store1');
            expect(result).toEqual(
                Object.values(AlertType).map((alert_type) => ({
                    alert_type,
                    is_enabled: alert_type === AlertType.PERFORMANCE_CHANGE ? false : true,
                })),
            );
        });

        it('defaults every type to enabled when no preference rows exist at all', async () => {
            prisma.alertPreference.findMany.mockResolvedValue([]);

            const result = await service.findAll(user, 'store1');

            expect(result.every((r) => r.is_enabled === true)).toBe(true);
            expect(result).toHaveLength(Object.values(AlertType).length);
        });

        it('respects a stored is_enabled: true row explicitly', async () => {
            prisma.alertPreference.findMany.mockResolvedValue([
                { alert_type: AlertType.LOW_RATING_REVIEW, is_enabled: true },
            ]);

            const result = await service.findAll(user, 'store1');

            expect(result.find((r) => r.alert_type === AlertType.LOW_RATING_REVIEW)).toEqual({
                alert_type: AlertType.LOW_RATING_REVIEW,
                is_enabled: true,
            });
        });
    });

    describe('update', () => {
        it('checks store access with OWNER/STORE_MANAGER roles', async () => {
            prisma.alertPreference.findFirst.mockResolvedValue(null);
            prisma.alertPreference.create.mockResolvedValue({ id: 'p1' });

            await service.update(user, 'store1', AlertType.PERFORMANCE_CHANGE, true);

            expect(accessControl.assertStoreAccess).toHaveBeenCalledWith(user, 'store1', [
                OrganizationRole.OWNER,
                OrganizationRole.STORE_MANAGER,
            ]);
        });

        it('throws BadRequestException for an invalid alert type', async () => {
            await expect(service.update(user, 'store1', 'NOT_A_REAL_TYPE', true)).rejects.toThrow(BadRequestException);
            expect(prisma.alertPreference.findFirst).not.toHaveBeenCalled();
        });

        it('updates the existing row when a preference already exists', async () => {
            prisma.alertPreference.findFirst.mockResolvedValue({ id: 'p1', is_enabled: true });
            prisma.alertPreference.update.mockResolvedValue({ id: 'p1', is_enabled: false });

            const result = await service.update(user, 'store1', AlertType.PERFORMANCE_CHANGE, false);

            expect(prisma.alertPreference.update).toHaveBeenCalledWith({
                where: { id: 'p1' },
                data: { is_enabled: false },
            });
            expect(prisma.alertPreference.create).not.toHaveBeenCalled();
            expect(result).toEqual({ id: 'p1', is_enabled: false });
        });

        it('creates a new row when no preference exists yet', async () => {
            prisma.alertPreference.findFirst.mockResolvedValue(null);
            prisma.alertPreference.create.mockResolvedValue({ id: 'p2', is_enabled: false });

            const result = await service.update(user, 'store1', AlertType.LOW_RATING_REVIEW, false);

            expect(prisma.alertPreference.create).toHaveBeenCalledWith({
                data: { store_id: 'store1', alert_type: AlertType.LOW_RATING_REVIEW, is_enabled: false },
            });
            expect(prisma.alertPreference.update).not.toHaveBeenCalled();
            expect(result).toEqual({ id: 'p2', is_enabled: false });
        });
    });
});
