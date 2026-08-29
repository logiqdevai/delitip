import * as fs from 'fs';
import * as Handlebars from 'handlebars';
import { TemplateService } from './templates.utils';

jest.mock('fs');

describe('TemplateService', () => {
    let service: TemplateService;
    const readFileSyncMock = fs.readFileSync as jest.Mock;

    beforeEach(() => {
        readFileSyncMock.mockReset();
        service = new TemplateService();
    });

    describe('renderTemplate / loadTemplate', () => {
        it('reads the .hbs file for the template name and renders it with the given data', async () => {
            readFileSyncMock.mockReturnValue('Hello {{name}}!');

            const result = await service.renderTemplate('waitlist' as any, { name: 'Nikos' });

            expect(result).toBe('Hello Nikos!');
            expect(readFileSyncMock).toHaveBeenCalledWith(expect.stringContaining('waitlist.hbs'), 'utf8');
        });

        it('caches a compiled template so the file is only read once across multiple renders', async () => {
            readFileSyncMock.mockReturnValue('Hi {{name}}');

            await service.renderTemplate('waitlist' as any, { name: 'A' });
            await service.renderTemplate('waitlist' as any, { name: 'B' });

            expect(readFileSyncMock).toHaveBeenCalledTimes(1);
        });

        it('rejects with a wrapped error when the template file cannot be read', async () => {
            readFileSyncMock.mockImplementation(() => {
                throw new Error('ENOENT: no such file');
            });

            await expect(service.renderTemplate('missing-template' as any, {})).rejects.toThrow(
                'Failed to render template missing-template',
            );
        });
    });

    describe('registered Handlebars helpers', () => {
        // TemplateService registers these on the shared global Handlebars instance in its
        // constructor (already instantiated in beforeEach), so they can be exercised directly.

        describe('formatDate', () => {
            it('returns an empty string for a falsy input', () => {
                const template = Handlebars.compile('{{formatDate date}}');
                expect(template({ date: '' })).toBe('');
                expect(template({})).toBe('');
            });

            it('formats a date string into a long-form US date', () => {
                const template = Handlebars.compile('{{formatDate date}}');
                const result = template({ date: '2024-06-15T12:00:00Z' });

                expect(result).toContain('2024');
                expect(result).toContain('June');
            });
        });

        describe('formatPrice', () => {
            it('formats a number to 2 decimal places', () => {
                const template = Handlebars.compile('{{formatPrice price}}');
                expect(template({ price: 9 })).toBe('9.00');
                expect(template({ price: 9.999 })).toBe('10.00');
            });

            it('returns "0.00" for a non-number', () => {
                const template = Handlebars.compile('{{formatPrice price}}');
                expect(template({ price: 'not-a-number' })).toBe('0.00');
                expect(template({})).toBe('0.00');
            });
        });

        describe('eq', () => {
            it('renders the truthy branch when both values are equal', () => {
                const template = Handlebars.compile('{{#if (eq a b)}}yes{{else}}no{{/if}}');
                expect(template({ a: 'x', b: 'x' })).toBe('yes');
                expect(template({ a: 'x', b: 'y' })).toBe('no');
            });
        });

        describe('or', () => {
            it('returns the first truthy value, else the second', () => {
                const template = Handlebars.compile('{{or a b}}');
                expect(template({ a: 'first', b: 'second' })).toBe('first');
                expect(template({ a: '', b: 'second' })).toBe('second');
                expect(template({ a: 0, b: 'fallback' })).toBe('fallback');
            });
        });
    });
});
