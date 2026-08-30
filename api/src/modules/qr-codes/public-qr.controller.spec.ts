import { PublicQrController } from './public-qr.controller';

describe('PublicQrController', () => {
    let controller: PublicQrController;
    let service: any;

    beforeEach(() => {
        service = { findPublicByCode: jest.fn() };
        controller = new PublicQrController(service);
    });

    it('findByCode delegates to the service with the code param, no auth/user required', async () => {
        service.findPublicByCode.mockResolvedValue('public-config');

        const result = await controller.findByCode('ABC12345');

        expect(service.findPublicByCode).toHaveBeenCalledWith('ABC12345', undefined);
        expect(result).toBe('public-config');
    });

    it('findByCode passes through the optional lang query param', async () => {
        service.findPublicByCode.mockResolvedValue('public-config');

        await controller.findByCode('ABC12345', 'el');

        expect(service.findPublicByCode).toHaveBeenCalledWith('ABC12345', 'el');
    });
});
