import { BadRequestException } from '@nestjs/common';
import { AuthRole, OrganizationRole } from 'generated/prisma';
import { QrTemplateCustomizationsService } from './qr-template-customizations.service';

describe('QrTemplateCustomizationsService', () => {
    let service: QrTemplateCustomizationsService;
    let prisma: any;
    let accessControl: any;

    const user = { id: 'u1', role: AuthRole.USER };
    const payload = {
        canvas: { backgroundColor: '#18181b' },
        elements: [
            {
                kind: 'text',
                id: 'storeName',
                x: 0,
                y: 0,
                width: 100,
                height: 20,
                content: 'Bella',
                fontFamily: 'serif',
                fontSize: 21,
                fontWeight: 700,
                color: '#84cc16',
                align: 'center',
                letterSpacing: 1,
                uppercase: true,
            },
        ],
    } as any;

    beforeEach(() => {
        prisma = {
            qrTemplateCustomization: { findFirst: jest.fn(), update: jest.fn(), create: jest.fn(), delete: jest.fn() },
        };
        accessControl = { assertStoreAccess: jest.fn() };
        service = new QrTemplateCustomizationsService(prisma, accessControl);
    });

    describe('findOne', () => {
        it('checks store access and returns the row for the given template', async () => {
            prisma.qrTemplateCustomization.findFirst.mockResolvedValue({ id: 'c1' });

            const result = await service.findOne(user, 'store1', 'classic-card');

            expect(accessControl.assertStoreAccess).toHaveBeenCalledWith(user, 'store1');
            expect(prisma.qrTemplateCustomization.findFirst).toHaveBeenCalledWith({
                where: { store_id: 'store1', template_id: 'classic-card' },
            });
            expect(result).toEqual({ id: 'c1' });
        });

        it('throws BadRequestException for an unknown template id', async () => {
            await expect(service.findOne(user, 'store1', 'not-a-real-template')).rejects.toThrow(BadRequestException);
            expect(prisma.qrTemplateCustomization.findFirst).not.toHaveBeenCalled();
        });
    });

    describe('upsert', () => {
        it('checks store access with OWNER/STORE_MANAGER roles', async () => {
            prisma.qrTemplateCustomization.findFirst.mockResolvedValue(null);
            prisma.qrTemplateCustomization.create.mockResolvedValue({ id: 'c1' });

            await service.upsert(user, 'store1', 'classic-card', payload);

            expect(accessControl.assertStoreAccess).toHaveBeenCalledWith(user, 'store1', [
                OrganizationRole.OWNER,
                OrganizationRole.STORE_MANAGER,
            ]);
        });

        it('throws BadRequestException for an unknown template id', async () => {
            await expect(service.upsert(user, 'store1', 'not-a-real-template', payload)).rejects.toThrow(
                BadRequestException,
            );
            expect(prisma.qrTemplateCustomization.findFirst).not.toHaveBeenCalled();
        });

        it('updates the existing row when a customization already exists', async () => {
            prisma.qrTemplateCustomization.findFirst.mockResolvedValue({ id: 'c1' });
            prisma.qrTemplateCustomization.update.mockResolvedValue({ id: 'c1' });

            const result = await service.upsert(user, 'store1', 'classic-card', payload);

            expect(prisma.qrTemplateCustomization.update).toHaveBeenCalledWith({
                where: { id: 'c1' },
                data: { canvas: payload.canvas, elements: payload.elements },
            });
            expect(prisma.qrTemplateCustomization.create).not.toHaveBeenCalled();
            expect(result).toEqual({ id: 'c1' });
        });

        it('creates a new row when no customization exists yet', async () => {
            prisma.qrTemplateCustomization.findFirst.mockResolvedValue(null);
            prisma.qrTemplateCustomization.create.mockResolvedValue({ id: 'c2' });

            const result = await service.upsert(user, 'store1', 'classic-card', payload);

            expect(prisma.qrTemplateCustomization.create).toHaveBeenCalledWith({
                data: {
                    store_id: 'store1',
                    template_id: 'classic-card',
                    canvas: payload.canvas,
                    elements: payload.elements,
                },
            });
            expect(prisma.qrTemplateCustomization.update).not.toHaveBeenCalled();
            expect(result).toEqual({ id: 'c2' });
        });
    });

    describe('remove', () => {
        it('checks store access with OWNER/STORE_MANAGER roles and deletes the existing row', async () => {
            prisma.qrTemplateCustomization.findFirst.mockResolvedValue({ id: 'c1' });
            prisma.qrTemplateCustomization.delete.mockResolvedValue({ id: 'c1' });

            const result = await service.remove(user, 'store1', 'classic-card');

            expect(accessControl.assertStoreAccess).toHaveBeenCalledWith(user, 'store1', [
                OrganizationRole.OWNER,
                OrganizationRole.STORE_MANAGER,
            ]);
            expect(prisma.qrTemplateCustomization.delete).toHaveBeenCalledWith({ where: { id: 'c1' } });
            expect(result).toEqual({ id: 'c1' });
        });

        it('returns null without deleting when no row exists', async () => {
            prisma.qrTemplateCustomization.findFirst.mockResolvedValue(null);

            const result = await service.remove(user, 'store1', 'classic-card');

            expect(prisma.qrTemplateCustomization.delete).not.toHaveBeenCalled();
            expect(result).toBeNull();
        });
    });
});
