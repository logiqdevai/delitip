import { AppService } from './app.service';

describe('AppService', () => {
    it('returns the greeting string', () => {
        const service = new AppService();

        expect(service.getHello()).toBe('Hello World!');
    });
});
