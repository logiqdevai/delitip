import { bucketKey, resolvePeriod, sortedBucketEntries } from './period.utils';

describe('resolvePeriod', () => {
    beforeEach(() => {
        jest.useFakeTimers().setSystemTime(new Date(2024, 2, 15, 10, 30, 0)); // Fri 2024-03-15 10:30 local
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('defaults to 7d when no period is given', () => {
        const now = new Date();
        const result = resolvePeriod();

        expect(result.lte).toEqual(now);
        expect(result.gte).toEqual(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000));
    });

    it('resolves "today" to local midnight through now', () => {
        const now = new Date();
        const result = resolvePeriod('today');

        expect(result.gte).toEqual(new Date(2024, 2, 15, 0, 0, 0));
        expect(result.lte).toEqual(now);
    });

    it('resolves "7d" to 7 days back through now', () => {
        const now = new Date();
        const result = resolvePeriod('7d');

        expect(result.gte).toEqual(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000));
        expect(result.lte).toEqual(now);
    });

    it('resolves "30d" to 30 days back through now', () => {
        const now = new Date();
        const result = resolvePeriod('30d');

        expect(result.gte).toEqual(new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000));
        expect(result.lte).toEqual(now);
    });

    it('resolves "90d" to 90 days back through now', () => {
        const now = new Date();
        const result = resolvePeriod('90d');

        expect(result.gte).toEqual(new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000));
        expect(result.lte).toEqual(now);
    });

    it('falls back to the 7-day window for any unrecognized period value', () => {
        const now = new Date();
        const result = resolvePeriod('bogus' as any);

        expect(result.gte).toEqual(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000));
    });
});

describe('bucketKey', () => {
    it('buckets by month as YYYY-MM, zero-padded', () => {
        expect(bucketKey(new Date(2024, 2, 5), 'month')).toBe('2024-03');
        expect(bucketKey(new Date(2024, 0, 31), 'month')).toBe('2024-01');
        expect(bucketKey(new Date(2024, 11, 1), 'month')).toBe('2024-12');
    });

    it('buckets by day as the ISO date (UTC-based)', () => {
        // noon UTC keeps the calendar date stable across any local timezone offset up to +/-12h
        expect(bucketKey(new Date('2024-03-05T12:00:00Z'), 'day')).toBe('2024-03-05');
    });

    describe('week (Monday-start approximation)', () => {
        // 2024-01-15 is a known Monday. Note: bucketKey builds the Monday date from LOCAL
        // getters (getFullYear/getMonth/getDate) but serializes it with UTC-based
        // toISOString(), so the exact string is timezone-dependent (see Findings in
        // TEST_COVERAGE_PLAN.md) — assert relative grouping instead of a hardcoded string.
        const monday = new Date(2024, 0, 15);
        const tuesday = new Date(2024, 0, 16);
        const saturday = new Date(2024, 0, 20);
        const sunday = new Date(2024, 0, 21);
        const nextMonday = new Date(2024, 0, 22);

        it('buckets every day of the week to the same key as that week\'s Monday', () => {
            const mondayKey = bucketKey(monday, 'week');

            expect(bucketKey(tuesday, 'week')).toBe(mondayKey);
            expect(bucketKey(saturday, 'week')).toBe(mondayKey);
            expect(bucketKey(sunday, 'week')).toBe(mondayKey);
        });

        it('rolls over to a different key once a new week starts', () => {
            expect(bucketKey(nextMonday, 'week')).not.toBe(bucketKey(monday, 'week'));
        });
    });
});

describe('sortedBucketEntries', () => {
    it('returns entries sorted lexicographically by key', () => {
        const map = new Map<string, number>([
            ['2024-03', 3],
            ['2024-01', 1],
            ['2024-02', 2],
        ]);

        expect(sortedBucketEntries(map)).toEqual([
            ['2024-01', 1],
            ['2024-02', 2],
            ['2024-03', 3],
        ]);
    });

    it('returns an empty array for an empty map', () => {
        expect(sortedBucketEntries(new Map())).toEqual([]);
    });
});
