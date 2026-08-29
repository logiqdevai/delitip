import { PublicStoresController } from './public-stores.controller';

describe('PublicStoresController', () => {
    let controller: PublicStoresController;
    let storesService: any;

    beforeEach(() => {
        storesService = { findPublicBySlug: jest.fn() };
        controller = new PublicStoresController(storesService);
    });

    it('delegates to the service with the slug and optional lang query param', async () => {
        storesService.findPublicBySlug.mockResolvedValue({ id: 's1', slug: 'diner' });

        await expect(controller.findBySlug('diner', 'en')).resolves.toEqual({ id: 's1', slug: 'diner' });
        expect(storesService.findPublicBySlug).toHaveBeenCalledWith('diner', 'en');
    });

    it('passes lang through as undefined when not provided', async () => {
        storesService.findPublicBySlug.mockResolvedValue({ id: 's1' });

        await controller.findBySlug('diner', undefined);

        expect(storesService.findPublicBySlug).toHaveBeenCalledWith('diner', undefined);
    });
});
