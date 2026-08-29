import { PublicRefundsController } from './public-refunds.controller';

describe('PublicRefundsController', () => {
    let controller: PublicRefundsController;
    let refundsService: any;

    beforeEach(() => {
        refundsService = { createPublicRequest: jest.fn() };
        controller = new PublicRefundsController(refundsService);
    });

    it('create delegates to RefundsService.createPublicRequest with the tip id and body', () => {
        const dto = { reason: 'wrong amount' } as any;
        refundsService.createPublicRequest.mockReturnValue('result');

        const result = controller.create('tip1', dto);

        expect(refundsService.createPublicRequest).toHaveBeenCalledWith('tip1', dto);
        expect(result).toBe('result');
    });
});
