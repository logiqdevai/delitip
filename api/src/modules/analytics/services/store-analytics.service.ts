import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { AccessControlService, AuthUser } from '@/shared/services/access-control/access-control.service';
import { resolveTranslatedText, TranslatedText } from '@/shared/utils/translation/translation.utils';
import { Language, TipStatus } from 'generated/prisma';
import { bucketKey, sortedBucketEntries } from '../utils/period.utils';
import { StoreTipsAnalyticsQueryType } from '../dto/store-tips-analytics-query.schema';

type TipRow = { id: string; amount: number; created_at: Date; employee_id: string | null };

@Injectable()
export class StoreAnalyticsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly accessControl: AccessControlService,
    ) { }

    // §15 — detailed tip analytics for a single Store with optional filters and grouping.
    async tips(user: AuthUser, storeId: string, query: StoreTipsAnalyticsQueryType) {
        await this.accessControl.assertStoreAccess(user, storeId);

        const where: Record<string, unknown> = { store_id: storeId, status: TipStatus.COMPLETED };

        if (query.date_from || query.date_to) {
            const createdAt: Record<string, Date> = {};
            if (query.date_from) createdAt.gte = new Date(query.date_from);
            if (query.date_to) createdAt.lte = new Date(query.date_to);
            where.created_at = createdAt;
        }
        if (query.employee_id) where.employee_id = query.employee_id;
        if (query.qr_code_id) where.qr_code_id = query.qr_code_id;

        const tips: TipRow[] = await this.prisma.tip.findMany({
            where,
            select: { id: true, amount: true, created_at: true, employee_id: true },
        });

        const totalAmount = tips.reduce((sum, t) => sum + t.amount, 0);
        const count = tips.length;
        const averageAmount = count > 0 ? Math.round(totalAmount / count) : 0;

        const breakdown = await this.buildBreakdown(storeId, tips, query.group_by);

        return { total_amount: totalAmount, count, average_amount: averageAmount, breakdown };
    }

    private async buildBreakdown(storeId: string, tips: TipRow[], groupBy: StoreTipsAnalyticsQueryType['group_by']) {
        if (groupBy === 'employee') {
            const amounts = new Map<string, number>();
            const counts = new Map<string, number>();
            for (const tip of tips) {
                const key = tip.employee_id ?? 'unattributed';
                amounts.set(key, (amounts.get(key) ?? 0) + tip.amount);
                counts.set(key, (counts.get(key) ?? 0) + 1);
            }

            const employeeIds = [...amounts.keys()].filter((id) => id !== 'unattributed');
            const [employees, store] = await Promise.all([
                this.prisma.employee.findMany({
                    where: { id: { in: employeeIds } },
                    select: { id: true, full_name: true },
                }),
                this.prisma.store.findUnique({ where: { id: storeId }, select: { primary_language: true } }),
            ]);
            const primaryLanguage: Language = store?.primary_language ?? Language.EN;
            const nameById = new Map(
                employees.map((e) => [e.id, resolveTranslatedText(e.full_name as TranslatedText, undefined, primaryLanguage)]),
            );

            return [...amounts.entries()].map(([key, amount]) => ({
                key,
                label: key === 'unattributed' ? 'Unattributed' : (nameById.get(key) ?? 'Unknown'),
                amount,
                count: counts.get(key) ?? 0,
            }));
        }

        if (groupBy === 'store') {
            const store = await this.prisma.store.findUnique({ where: { id: storeId }, select: { name: true } });
            const amount = tips.reduce((sum, t) => sum + t.amount, 0);
            return [{ key: storeId, label: store?.name ?? 'Unknown', amount, count: tips.length }];
        }

        const amounts = new Map<string, number>();
        const counts = new Map<string, number>();
        for (const tip of tips) {
            const key = bucketKey(tip.created_at, groupBy);
            amounts.set(key, (amounts.get(key) ?? 0) + tip.amount);
            counts.set(key, (counts.get(key) ?? 0) + 1);
        }

        return sortedBucketEntries(amounts).map(([bucket, amount]) => ({
            bucket,
            amount,
            count: counts.get(bucket) ?? 0,
        }));
    }
}
