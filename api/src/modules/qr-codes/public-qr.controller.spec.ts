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

        expect(service.findPublicByCode).toHaveBeenCalledWith('ABC12345');
        expect(result).toBe('public-config');
    });
});
