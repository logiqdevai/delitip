import { bufferToBase64 } from './image-base64.utils';

describe('bufferToBase64', () => {
    it('encodes the buffer as a base64 data URI with the given content type', () => {
        const buffer = Buffer.from('hello world');

        const result = bufferToBase64(buffer, 'image/png');

        expect(result).toBe(`data:image/png;base64,${buffer.toString('base64')}`);
        expect(result.startsWith('data:image/png;base64,')).toBe(true);
    });

    it('handles an empty buffer', () => {
        const result = bufferToBase64(Buffer.from(''), 'image/jpeg');

        expect(result).toBe('data:image/jpeg;base64,');
    });

    it('uses whatever content type string is passed through verbatim', () => {
        const buffer = Buffer.from([1, 2, 3]);

        const result = bufferToBase64(buffer, 'application/octet-stream');

        expect(result).toBe(`data:application/octet-stream;base64,${buffer.toString('base64')}`);
    });
});
