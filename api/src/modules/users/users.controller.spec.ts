import { UsersController } from './users.controller';

describe('UsersController', () => {
    let controller: UsersController;
    let usersService: any;

    beforeEach(() => {
        usersService = {
            getById: jest.fn(),
            updateProfile: jest.fn(),
            getMyAccounts: jest.fn(),
            findAll: jest.fn(),
        };
        controller = new UsersController(usersService);
    });

    it('me() delegates to usersService.getById with the current user id', () => {
        usersService.getById.mockReturnValue('result');

        const result = controller.me('u1');

        expect(usersService.getById).toHaveBeenCalledWith('u1');
        expect(result).toBe('result');
    });

    it('updateMe() delegates to usersService.updateProfile with the current user id and dto', () => {
        const dto = { first_name: 'New' } as any;
        usersService.updateProfile.mockReturnValue('result');

        const result = controller.updateMe('u1', dto);

        expect(usersService.updateProfile).toHaveBeenCalledWith('u1', dto);
        expect(result).toBe('result');
    });

    it('myAccounts() delegates to usersService.getMyAccounts with the current user id', () => {
        usersService.getMyAccounts.mockReturnValue('result');

        const result = controller.myAccounts('u1');

        expect(usersService.getMyAccounts).toHaveBeenCalledWith('u1');
        expect(result).toBe('result');
    });

    it('findAll() delegates to usersService.findAll with the parsed query', () => {
        const query = { page: 1, limit: 20 } as any;
        usersService.findAll.mockReturnValue('result');

        const result = controller.findAll(query);

        expect(usersService.findAll).toHaveBeenCalledWith(query);
        expect(result).toBe('result');
    });

    it('findOne() delegates to usersService.getById with the route param', () => {
        usersService.getById.mockReturnValue('result');

        const result = controller.findOne('u2');

        expect(usersService.getById).toHaveBeenCalledWith('u2');
        expect(result).toBe('result');
    });
});
