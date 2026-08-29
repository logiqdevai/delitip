import { UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JsonWebTokenError } from 'jsonwebtoken';
import { JwtGuard } from './jwt.guard';

describe('JwtGuard', () => {
    let guard: JwtGuard;

    beforeEach(() => {
        guard = new JwtGuard();
        jest.restoreAllMocks();
    });

    describe('getRequest', () => {
        it('extracts req from the GraphQL execution context', () => {
            const req = { headers: { authorization: 'Bearer x' } };
            jest.spyOn(GqlExecutionContext, 'create').mockReturnValue({ getContext: () => ({ req }) } as any);

            const result = guard.getRequest({} as any);

            expect(result).toBe(req);
        });
    });

    describe('handleRequest', () => {
        it('throws an invalid_token UnauthorizedException when info is a JsonWebTokenError', () => {
            expect(() => guard.handleRequest(null, null, new JsonWebTokenError('bad'), {} as any, null)).toThrow(
                UnauthorizedException,
            );

            try {
                guard.handleRequest(null, null, new JsonWebTokenError('bad'), {} as any, null);
            } catch (error) {
                expect((error as UnauthorizedException).getResponse()).toMatchObject({
                    message: 'Invalid token',
                    code: 'invalid_token',
                });
            }
        });

        it('throws an authentication_required UnauthorizedException when there is an error', () => {
            expect(() => guard.handleRequest(new Error('boom'), null, null, {} as any, null)).toThrow(UnauthorizedException);

            try {
                guard.handleRequest(new Error('boom'), null, null, {} as any, null);
            } catch (error) {
                expect((error as UnauthorizedException).getResponse()).toMatchObject({
                    message: 'Authentication required',
                    code: 'authentication_required',
                });
            }
        });

        it('throws an authentication_required UnauthorizedException when there is no user', () => {
            expect(() => guard.handleRequest(null, null, null, {} as any, null)).toThrow(UnauthorizedException);
        });

        it('attaches the user to the GraphQL context and returns it on success', () => {
            const user = { id: 'u1', role: 'USER' };
            const gqlContext: any = {};
            jest.spyOn(GqlExecutionContext, 'create').mockReturnValue({ getContext: () => gqlContext } as any);

            const result = guard.handleRequest(null, user, null, {} as any, null);

            expect(result).toBe(user);
            expect(gqlContext.user).toBe(user);
        });
    });
});
