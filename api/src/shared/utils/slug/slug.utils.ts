export function slugify(text: string): string {
    return text
        .toString()
        .normalize('NFKD')
        .replace(/[̀-ͯ]/g, '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 60) || 'store';
}

export async function ensureUniqueSlug(
    base: string,
    exists: (candidate: string) => Promise<boolean>,
): Promise<string> {
    const baseSlug = slugify(base);
    let candidate = baseSlug;
    let attempt = 0;

    while (await exists(candidate)) {
        attempt += 1;
        candidate = `${baseSlug}-${attempt}`;
    }

    return candidate;
}
