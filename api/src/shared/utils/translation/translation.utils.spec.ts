import { Language } from 'generated/prisma';
import { autoTranslateStub, resolveTranslatedText } from './translation.utils';

describe('autoTranslateStub', () => {
    it('seeds every supported language with the primary text when there is no existing translation', () => {
        const result = autoTranslateStub(Language.EN, 'Hello', [Language.EN, Language.EL, Language.FR]);

        expect(result).toEqual({ en: 'Hello', el: 'Hello', fr: 'Hello' });
    });

    it('always overwrites the primary language key with the new primary text', () => {
        const existing = { en: 'Old text', el: 'Existing Greek' };

        const result = autoTranslateStub(Language.EN, 'New text', [Language.EN, Language.EL], existing);

        expect(result.en).toBe('New text');
    });

    it('preserves an existing non-primary translation instead of overwriting it', () => {
        const existing = { el: 'Existing Greek' };

        const result = autoTranslateStub(Language.EN, 'Hello', [Language.EN, Language.EL], existing);

        expect(result.el).toBe('Existing Greek');
    });

    it('fills in only the missing supported languages, leaving others untouched', () => {
        const existing = { en: 'Hello', el: 'Existing Greek' };

        const result = autoTranslateStub(Language.EN, 'Hello', [Language.EN, Language.EL, Language.FR], existing);

        expect(result).toEqual({ en: 'Hello', el: 'Existing Greek', fr: 'Hello' });
    });

    it('treats null/undefined existing translations as empty', () => {
        expect(autoTranslateStub(Language.EN, 'Hi', [Language.EN], null)).toEqual({ en: 'Hi' });
        expect(autoTranslateStub(Language.EN, 'Hi', [Language.EN], undefined)).toEqual({ en: 'Hi' });
    });
});

describe('resolveTranslatedText', () => {
    it('returns null when text is null or undefined', () => {
        expect(resolveTranslatedText(null, 'en', Language.EN)).toBeNull();
        expect(resolveTranslatedText(undefined, 'en', Language.EN)).toBeNull();
    });

    it('returns the requested language when present', () => {
        const text = { en: 'Hello', el: 'Γεια' };

        expect(resolveTranslatedText(text, 'el', Language.EN)).toBe('Γεια');
    });

    it('is case-insensitive about the requested language', () => {
        const text = { en: 'Hello', el: 'Γεια' };

        expect(resolveTranslatedText(text, 'EL', Language.EN)).toBe('Γεια');
    });

    it('falls back to the primary language when the requested language is missing', () => {
        const text = { en: 'Hello' };

        expect(resolveTranslatedText(text, 'fr', Language.EN)).toBe('Hello');
    });

    it('falls back to the primary language when no language was requested', () => {
        const text = { en: 'Hello', el: 'Γεια' };

        expect(resolveTranslatedText(text, undefined, Language.EN)).toBe('Hello');
    });

    it('falls back to the first available value when neither the requested nor primary language exists', () => {
        const text = { fr: 'Bonjour' };

        expect(resolveTranslatedText(text, 'de', Language.EN)).toBe('Bonjour');
    });

    it('returns null when the translated-text object is completely empty', () => {
        expect(resolveTranslatedText({}, 'en', Language.EN)).toBeNull();
    });
});
