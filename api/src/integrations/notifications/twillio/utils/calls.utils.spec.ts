import { CallsUtils } from './calls.utils';

describe('CallsUtils.escapeXml', () => {
    it.each([
        ['&', '&amp;'],
        ['<', '&lt;'],
        ['>', '&gt;'],
        ['"', '&quot;'],
        ["'", '&apos;'],
    ])('escapes %s as %s', (input, expected) => {
        expect(CallsUtils.escapeXml(input)).toBe(expected);
    });

    it('escapes every special character in a combined string', () => {
        expect(CallsUtils.escapeXml(`<Say>Tom & "Jerry" said 'hi'</Say>`)).toBe(
            '&lt;Say&gt;Tom &amp; &quot;Jerry&quot; said &apos;hi&apos;&lt;/Say&gt;',
        );
    });

    it('leaves plain text untouched', () => {
        expect(CallsUtils.escapeXml('Thank you for your visit')).toBe('Thank you for your visit');
    });

    it('returns an empty string for an empty input', () => {
        expect(CallsUtils.escapeXml('')).toBe('');
    });
});
