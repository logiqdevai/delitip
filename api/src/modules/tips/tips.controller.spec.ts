import { AuthRole } from 'generated/prisma';
import { StreamableFile } from '@nestjs/common';
import { TipsController } from './tips.controller';

describe('TipsController', () => {
    let controller: TipsController;
    let tipsService: any;

    const user = { id: 'u1', role: AuthRole.USER };

    beforeEach(() => {
        tipsService = { findAll: jest.fn(), findOne: jest.fn(), exportCsv: jest.fn() };
        controller = new TipsController(tipsService);
    });

    it('findAll delegates to TipsService.findAll with the current user, store id, and query', () => {
        const query = { page: 1, limit: 20 } as any;
        tipsService.findAll.mockReturnValue('result');

        const result = controller.findAll(user, 'store1', query);

        expect(tipsService.findAll).toHaveBeenCalledWith(user, 'store1', query);
        expect(result).toBe('result');
    });

    it('exportCsv delegates to TipsService.exportCsv and returns a StreamableFile', async () => {
        const query = { status: 'COMPLETED' } as any;
        tipsService.exportCsv.mockResolvedValue({
            csv: 'Transaction ID\r\nt1',
            filename: 'tips-2026-09-04.csv',
        });

        const result = await controller.exportCsv(user, 'store1', query);

        expect(tipsService.exportCsv).toHaveBeenCalledWith(user, 'store1', query);
        expect(result).toBeInstanceOf(StreamableFile);
    });

    it('findOne delegates to TipsService.findOne with the current user and id', () => {
        tipsService.findOne.mockReturnValue('result');

        const result = controller.findOne(user, 'tip1');

        expect(tipsService.findOne).toHaveBeenCalledWith(user, 'tip1');
        expect(result).toBe('result');
    });
});
