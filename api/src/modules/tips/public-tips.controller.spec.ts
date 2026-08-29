import { PublicTipsController } from './public-tips.controller';
import { CreatePublicTipDto } from './dto/create-public-tip.dto';

describe('PublicTipsController', () => {
    let controller: PublicTipsController;
    let tipsService: any;

    beforeEach(() => {
        tipsService = { createPublicTip: jest.fn() };
        controller = new PublicTipsController(tipsService);
    });

    it('create delegates to TipsService.createPublicTip with the body', () => {
        const dto = { qr_code_id: 'qr1', amount: 1000 } as CreatePublicTipDto;
        tipsService.createPublicTip.mockReturnValue('result');

        const result = controller.create(dto);

        expect(tipsService.createPublicTip).toHaveBeenCalledWith(dto);
        expect(result).toBe('result');
    });
});
