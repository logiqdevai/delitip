import { UnauthorizedException } from '@nestjs/common';
import { CreateJwtService } from './jwt.service';

describe('CreateJwtService', () => {
    let service: CreateJwtService;
    let jwt: { signAsync: jest.Mock; verifyAsync: jest.Mock; decode: jest.Mock };
    let config: { get: jest.Mock };

    beforeEach(() => {
        jwt = { signAsync: jest.fn(), verifyAsync: jest.fn(), decode: jest.fn() };
        config = {
            get: jest.fn((key: string) => ({ JWT_SECRET: 'secret', JWT_EXPIRATION_TIME: '1h' } as any)[key]),
        };
        service = new CreateJwtService(jwt as any, config as any);
    });

    describe('signToken', () => {
        it('signs the payload with the configured secret and expiration', async () => {
            jwt.signAsync.mockResolvedValue('signed-token');

            const result = await service.signToken({ id: 'u1' });

            expect(result).toBe('signed-token');
            expect(jwt.signAsync).toHaveBeenCalledWith({ id: 'u1' }, { expiresIn: '1h', secret: 'secret' });
        });
    });

    describe('verifyToken', () => {
        it('returns the decoded payload for a valid token', async () => {
            jwt.verifyAsync.mockResolvedValue({ id: 'u1' });

            await expect(service.verifyToken('good-token')).resolves.toEqual({ id: 'u1' });
            expect(jwt.verifyAsync).toHaveBeenCalledWith('good-token', { secret: 'secret' });
        });

        // NOTE: verifyToken's implementation does `return this.jwt.verifyAsync(...)` without an
        // `await` inside the try block, so a rejection is never actually caught — it propagates
        // as the raw underlying error instead of the intended UnauthorizedException. This test
        // documents the current (buggy) behavior; see TEST_COVERAGE_PLAN.md Findings for the fix.
        it('currently propagates the raw underlying error instead of UnauthorizedException (missing await — see Findings)', async () => {
            const underlyingError = new Error('bad token');
            jwt.verifyAsync.mockRejectedValue(underlyingError);

            await expect(service.verifyToken('bad-token')).rejects.toBe(underlyingError);
        });
    });

    describe('getExpirationTime', () => {
        it('returns the exp claim from the decoded token', () => {
            jwt.decode.mockReturnValue({ exp: 12345 });

            expect(service.getExpirationTime('some-token')).toBe(12345);
            expect(jwt.decode).toHaveBeenCalledWith('some-token');
        });
    });
});
