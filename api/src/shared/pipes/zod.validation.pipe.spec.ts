import { BadRequestException } from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from './zod.validation.pipe';

describe('ZodValidationPipe', () => {
    const schema = z.object({ page: z.number(), name: z.string() });
    let pipe: ZodValidationPipe;

    beforeEach(() => {
        pipe = new ZodValidationPipe(schema);
    });

    it('returns the parsed value when it matches the schema', () => {
        const result = pipe.transform({ page: 1, name: 'abc' });

        expect(result).toEqual({ page: 1, name: 'abc' });
    });

    it('throws a BadRequestException with per-field errors for invalid input', () => {
        expect(() => pipe.transform({ page: 'not-a-number', name: 123 })).toThrow(BadRequestException);

        try {
            pipe.transform({ page: 'not-a-number', name: 123 });
        } catch (error) {
            const response = (error as BadRequestException).getResponse() as any;
            expect(response.message).toBe('Validation failed for query parameters');
            expect(response.errors).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ field: 'page' }),
                    expect.objectContaining({ field: 'name' }),
                ]),
            );
        }
    });

    it('wraps a non-Zod error thrown by the schema as a generic BadRequestException', () => {
        const throwingSchema = { parse: () => { throw new Error('boom'); } } as any;
        const throwingPipe = new ZodValidationPipe(throwingSchema);

        expect(() => throwingPipe.transform({})).toThrow(BadRequestException);

        try {
            throwingPipe.transform({});
        } catch (error) {
            // Nest normalizes a plain string passed to BadRequestException into a standard
            // { statusCode, message, error } response body.
            expect((error as BadRequestException).getResponse()).toMatchObject({
                statusCode: 400,
                message: 'Invalid query parameters',
            });
        }
    });
});
