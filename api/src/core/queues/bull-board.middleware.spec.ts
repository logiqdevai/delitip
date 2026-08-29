import { bullBoardAuthMiddleware } from './bull-board.middleware';

const buildConfigService = (overrides: Record<string, any> = {}) => ({
    get: jest.fn((key: string) => overrides[key]),
});

const buildRes = () => ({
    status: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
    setHeader: jest.fn(),
});

const basicAuthHeader = (user: string, pass: string) => `Basic ${Buffer.from(`${user}:${pass}`).toString('base64')}`;

describe('bullBoardAuthMiddleware', () => {
    it('responds 500 when Bull Board credentials are not configured', () => {
        const middleware = bullBoardAuthMiddleware(buildConfigService({}) as any);
        const req = { headers: {} } as any;
        const res = buildRes();
        const next = jest.fn();

        middleware(req, res as any, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith('Bull Board credentials not configured');
        expect(next).not.toHaveBeenCalled();
    });

    it('requests authentication when no Authorization header is present', () => {
        const middleware = bullBoardAuthMiddleware(
            buildConfigService({ BULL_BOARD_USER: 'admin', BULL_BOARD_PASSWORD: 'secret' }) as any,
        );
        const req = { headers: {} } as any;
        const res = buildRes();
        const next = jest.fn();

        middleware(req, res as any, next);

        expect(res.setHeader).toHaveBeenCalledWith('WWW-Authenticate', 'Basic realm="Bull Board Admin"');
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith('Authentication required');
        expect(next).not.toHaveBeenCalled();
    });

    it('requests authentication when the Authorization header is not a Basic scheme', () => {
        const middleware = bullBoardAuthMiddleware(
            buildConfigService({ BULL_BOARD_USER: 'admin', BULL_BOARD_PASSWORD: 'secret' }) as any,
        );
        const req = { headers: { authorization: 'Bearer sometoken' } } as any;
        const res = buildRes();
        const next = jest.fn();

        middleware(req, res as any, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith('Authentication required');
        expect(next).not.toHaveBeenCalled();
    });

    it('calls next() for correct Basic credentials', () => {
        const middleware = bullBoardAuthMiddleware(
            buildConfigService({ BULL_BOARD_USER: 'admin', BULL_BOARD_PASSWORD: 'secret' }) as any,
        );
        const req = { headers: { authorization: basicAuthHeader('admin', 'secret') } } as any;
        const res = buildRes();
        const next = jest.fn();

        middleware(req, res as any, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });

    it('rejects incorrect Basic credentials', () => {
        const middleware = bullBoardAuthMiddleware(
            buildConfigService({ BULL_BOARD_USER: 'admin', BULL_BOARD_PASSWORD: 'secret' }) as any,
        );
        const req = { headers: { authorization: basicAuthHeader('admin', 'wrong-password') } } as any;
        const res = buildRes();
        const next = jest.fn();

        middleware(req, res as any, next);

        expect(res.setHeader).toHaveBeenCalledWith('WWW-Authenticate', 'Basic realm="Bull Board Admin"');
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith('Invalid credentials');
        expect(next).not.toHaveBeenCalled();
    });
});
