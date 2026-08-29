import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
    let strategy: JwtStrategy;

    beforeEach(() => {
        const config = { get: jest.fn().mockReturnValue('test-secret') } as unknown as ConfigService;
        strategy = new JwtStrategy(config);
    });

    describe('validate', () => {
        it('returns the payload as-is when it has an id', async () => {
            const payload = { id: 'u1', role: 'USER' };

            await expect(strategy.validate(payload)).resolves.toBe(payload);
        });

        it('throws when the payload has no id', async () => {
            await expect(strategy.validate({ id: '', role: 'USER' } as any)).rejects.toThrow('Invalid token');
        });
    });
});
