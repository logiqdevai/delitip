import { AppController } from './app.controller';

describe('AppController', () => {
    it('returns whatever AppService.getHello() returns', () => {
        const appService: any = { getHello: jest.fn().mockReturnValue('Hello World!') };
        const controller = new AppController(appService);

        expect(controller.getHello()).toBe('Hello World!');
        expect(appService.getHello).toHaveBeenCalled();
    });
});
