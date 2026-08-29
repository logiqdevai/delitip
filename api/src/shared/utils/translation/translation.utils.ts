import { Language } from 'generated/prisma';

export type TranslatedText = Partial<Record<string, string>>;

// No real translation provider is wired up yet — every supported language is
// seeded with the primary-language text so the store always has a value to
// show and can hand-edit each one later (§24 fallback behavior already
// covers languages that never get a real translation).
export function autoTranslateStub(
    primaryLanguage: Language,
    primaryText: string,
    supportedLanguages: Language[],
    existing?: TranslatedText | null,
): TranslatedText {
    const result: TranslatedText = { ...(existing || {}) };
    result[primaryLanguage.toLowerCase()] = primaryText;

    for (const lang of supportedLanguages) {
        const key = lang.toLowerCase();
        if (!result[key]) {
            result[key] = primaryText;
        }
    }

    return result;
}

export function resolveTranslatedText(
    text: TranslatedText | null | undefined,
    requestedLanguage: string | undefined,
    primaryLanguage: Language,
): string | null {
    if (!text) return null;
    const key = requestedLanguage?.toLowerCase();
    if (key && text[key]) return text[key];
    return text[primaryLanguage.toLowerCase()] ?? Object.values(text)[0] ?? null;
}
