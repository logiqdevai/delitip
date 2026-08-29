export type DashboardPeriod = 'today' | '7d' | '30d' | '90d';
export type BucketGroupBy = 'day' | 'week' | 'month';

/**
 * Resolves a `?period=` query value into a concrete date range ending now.
 * `today` = start of today (local) through now; `7d`/`30d`/`90d` = N days back through now.
 */
export function resolvePeriod(period: DashboardPeriod = '7d'): { gte: Date; lte: Date } {
    const now = new Date();

    if (period === 'today') {
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        return { gte: startOfToday, lte: now };
    }

    const daysBack = period === '30d' ? 30 : period === '90d' ? 90 : 7;
    const gte = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);
    return { gte, lte: now };
}

/**
 * Buckets a date into a sortable string key for day/week/month grouping.
 * Week buckets are a reasonable Monday-start approximation, not strict ISO-8601 week numbering.
 */
export function bucketKey(date: Date, groupBy: BucketGroupBy): string {
    const d = new Date(date);

    if (groupBy === 'month') {
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    }

    if (groupBy === 'week') {
        const dayOfWeek = d.getDay(); // 0 = Sunday
        const diffToMonday = (dayOfWeek + 6) % 7;
        const monday = new Date(d.getFullYear(), d.getMonth(), d.getDate() - diffToMonday);
        return monday.toISOString().slice(0, 10);
    }

    return d.toISOString().slice(0, 10);
}

export function sortedBucketEntries<T>(map: Map<string, T>): [string, T][] {
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
}
