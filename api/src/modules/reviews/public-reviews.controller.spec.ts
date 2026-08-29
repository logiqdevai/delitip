import { PublicReviewsController } from './public-reviews.controller';

describe('PublicReviewsController', () => {
    let controller: PublicReviewsController;
    let service: any;

    beforeEach(() => {
        service = {
            getPublicReviewConfig: jest.fn(),
            createPublic: jest.fn(),
        };
        controller = new PublicReviewsController(service);
    });

    it('getReviewConfig delegates with the store slug and optional lang query param', () => {
        service.getPublicReviewConfig.mockReturnValue('config');

        expect(controller.getReviewConfig('my-store', 'el')).toBe('config');
        expect(service.getPublicReviewConfig).toHaveBeenCalledWith('my-store', 'el');
    });

    it('getReviewConfig works without a lang query param', () => {
        service.getPublicReviewConfig.mockReturnValue('config');

        controller.getReviewConfig('my-store', undefined);

        expect(service.getPublicReviewConfig).toHaveBeenCalledWith('my-store', undefined);
    });

    it('create delegates the public review submission body to the service', () => {
        const dto = { tip_id: 't1', rating: 5 } as any;
        service.createPublic.mockReturnValue('created');

        expect(controller.create(dto)).toBe('created');
        expect(service.createPublic).toHaveBeenCalledWith(dto);
    });
});
