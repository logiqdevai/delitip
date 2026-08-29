import { AuthRole } from 'generated/prisma';
import { OrganizationsController } from './organizations.controller';

describe('OrganizationsController', () => {
    let controller: OrganizationsController;
    let organizationsService: any;

    const user = { id: 'u1', role: AuthRole.USER };

    beforeEach(() => {
        organizationsService = {
            create: jest.fn(),
            findMine: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
        };
        controller = new OrganizationsController(organizationsService);
    });

    it('create() delegates to organizationsService.create', () => {
        const dto = { name: 'Acme' } as any;
        organizationsService.create.mockReturnValue('result');

        expect(controller.create(user, dto)).toBe('result');
        expect(organizationsService.create).toHaveBeenCalledWith(user, dto);
    });

    it('findMine() delegates to organizationsService.findMine', () => {
        organizationsService.findMine.mockReturnValue('result');

        expect(controller.findMine(user)).toBe('result');
        expect(organizationsService.findMine).toHaveBeenCalledWith(user);
    });

    it('findOne() delegates to organizationsService.findOne', () => {
        organizationsService.findOne.mockReturnValue('result');

        expect(controller.findOne(user, 'org1')).toBe('result');
        expect(organizationsService.findOne).toHaveBeenCalledWith(user, 'org1');
    });

    it('update() delegates to organizationsService.update', () => {
        const dto = { name: 'New' } as any;
        organizationsService.update.mockReturnValue('result');

        expect(controller.update(user, 'org1', dto)).toBe('result');
        expect(organizationsService.update).toHaveBeenCalledWith(user, 'org1', dto);
    });

    it('remove() delegates to organizationsService.remove', () => {
        organizationsService.remove.mockReturnValue('result');

        expect(controller.remove(user, 'org1')).toBe('result');
        expect(organizationsService.remove).toHaveBeenCalledWith(user, 'org1');
    });
});
