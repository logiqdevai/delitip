import { AuthRole } from 'generated/prisma';
import { DistributionRulesController } from './distribution-rules.controller';

describe('DistributionRulesController', () => {
    let controller: DistributionRulesController;
    let service: any;

    const user = { id: 'u1', role: AuthRole.USER };

    beforeEach(() => {
        service = {
            create: jest.fn(),
            findAllForStore: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            setDefaultForStore: jest.fn(),
        };
        controller = new DistributionRulesController(service);
    });

    it('create delegates to the service with the current user, store id, and body', () => {
        const dto = { name: 'Split', recipients: [] } as any;
        service.create.mockReturnValue('result');

        expect(controller.create(user, 'store1', dto)).toBe('result');
        expect(service.create).toHaveBeenCalledWith(user, 'store1', dto);
    });

    it('findAllForStore delegates to the service with the current user and store id', () => {
        service.findAllForStore.mockReturnValue('result');

        expect(controller.findAllForStore(user, 'store1')).toBe('result');
        expect(service.findAllForStore).toHaveBeenCalledWith(user, 'store1');
    });

    it('findOne delegates to the service with the current user and id', () => {
        service.findOne.mockReturnValue('result');

        expect(controller.findOne(user, 'rule1')).toBe('result');
        expect(service.findOne).toHaveBeenCalledWith(user, 'rule1');
    });

    it('update delegates to the service with the current user, id, and body', () => {
        const dto = { name: 'Renamed' } as any;
        service.update.mockReturnValue('result');

        expect(controller.update(user, 'rule1', dto)).toBe('result');
        expect(service.update).toHaveBeenCalledWith(user, 'rule1', dto);
    });

    it('remove delegates to the service with the current user and id', () => {
        service.remove.mockReturnValue('result');

        expect(controller.remove(user, 'rule1')).toBe('result');
        expect(service.remove).toHaveBeenCalledWith(user, 'rule1');
    });

    it('setDefault delegates to the service with the current user, store id, and body', () => {
        const dto = { distribution_rule_id: 'rule1' } as any;
        service.setDefaultForStore.mockReturnValue('result');

        expect(controller.setDefault(user, 'store1', dto)).toBe('result');
        expect(service.setDefaultForStore).toHaveBeenCalledWith(user, 'store1', dto);
    });
});
