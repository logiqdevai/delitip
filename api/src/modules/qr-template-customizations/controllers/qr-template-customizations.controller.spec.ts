import { AuthRole } from 'generated/prisma';
import { QrTemplateCustomizationsController } from './qr-template-customizations.controller';

describe('QrTemplateCustomizationsController', () => {
    let controller: QrTemplateCustomizationsController;
    let service: any;

    const user = { id: 'u1', role: AuthRole.USER };
    const payload = { canvas: { backgroundColor: '#18181b' }, elements: [] } as any;

    beforeEach(() => {
        service = { findOne: jest.fn(), upsert: jest.fn(), remove: jest.fn() };
        controller = new QrTemplateCustomizationsController(service);
    });

    it('delegates findOne to the service with user, storeId, and templateId', () => {
        service.findOne.mockResolvedValue(null);

        controller.findOne(user, 'store1', 'classic-card');

        expect(service.findOne).toHaveBeenCalledWith(user, 'store1', 'classic-card');
    });

    it('delegates upsert to the service with user, storeId, templateId, and body', () => {
        service.upsert.mockResolvedValue({ id: 'c1' });

        controller.upsert(user, 'store1', 'classic-card', payload);

        expect(service.upsert).toHaveBeenCalledWith(user, 'store1', 'classic-card', payload);
    });

    it('delegates remove to the service with user, storeId, and templateId', () => {
        service.remove.mockResolvedValue(null);

        controller.remove(user, 'store1', 'classic-card');

        expect(service.remove).toHaveBeenCalledWith(user, 'store1', 'classic-card');
    });
});
