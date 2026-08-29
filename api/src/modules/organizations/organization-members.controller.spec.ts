import { AuthRole, OrganizationRole } from 'generated/prisma';
import { OrganizationMembersController } from './organization-members.controller';

describe('OrganizationMembersController', () => {
    let controller: OrganizationMembersController;
    let membersService: any;

    const user = { id: 'u1', role: AuthRole.USER };

    beforeEach(() => {
        membersService = {
            findAll: jest.fn(),
            add: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
        };
        controller = new OrganizationMembersController(membersService);
    });

    it('findAll() delegates to membersService.findAll', () => {
        membersService.findAll.mockReturnValue('result');

        expect(controller.findAll(user, 'org1')).toBe('result');
        expect(membersService.findAll).toHaveBeenCalledWith(user, 'org1');
    });

    it('add() delegates to membersService.add', () => {
        const dto = { email: 'a@b.com' } as any;
        membersService.add.mockReturnValue('result');

        expect(controller.add(user, 'org1', dto)).toBe('result');
        expect(membersService.add).toHaveBeenCalledWith(user, 'org1', dto);
    });

    it('update() delegates to membersService.update', () => {
        const dto = { role: OrganizationRole.OWNER } as any;
        membersService.update.mockReturnValue('result');

        expect(controller.update(user, 'org1', 'member1', dto)).toBe('result');
        expect(membersService.update).toHaveBeenCalledWith(user, 'org1', 'member1', dto);
    });

    it('remove() delegates to membersService.remove', () => {
        membersService.remove.mockReturnValue('result');

        expect(controller.remove(user, 'org1', 'member1')).toBe('result');
        expect(membersService.remove).toHaveBeenCalledWith(user, 'org1', 'member1');
    });
});
