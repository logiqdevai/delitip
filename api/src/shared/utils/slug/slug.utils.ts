import { Prisma } from 'generated/prisma';

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

// The check-then-insert in ensureUniqueSlug isn't atomic, so two concurrent
// requests can compute the same "free" slug and race to insert it. The `slug`
// unique constraint is the real backstop for that; on Postgres, a failed
// insert aborts the whole transaction, so the fix is to retry the entire
// operation (which recomputes the slug against then-current data) rather
// than retry the insert in place.
export function isUniqueSlugConflict(err: unknown): boolean {
    return (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2002' &&
        (err.meta?.target as string[] | undefined)?.includes('slug')
    );
}

export async function withUniqueSlugRetry<T>(operation: () => Promise<T>, maxAttempts = 3): Promise<T> {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await operation();
        } catch (err) {
            if (attempt === maxAttempts || !isUniqueSlugConflict(err)) throw err;
        }
    }
    /* istanbul ignore next -- unreachable: loop always returns or throws */
    throw new Error('unreachable');
}
