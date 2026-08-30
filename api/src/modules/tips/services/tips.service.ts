import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { AccessControlService, AuthUser } from '@/shared/services/access-control/access-control.service';
import { UsersService } from '@/modules/users/services/users.service';
import { calculateTipDistribution } from '@/shared/utils/distribution/distribution-calculator.util';
import { generateMockPaymentReference } from '@/shared/utils/mock-payment/mock-payment.utils';
import { resolveTranslatedText, TranslatedText } from '@/shared/utils/translation/translation.utils';
import { paginate } from '@/shared/utils/pagination/pagination-query.schema';
import { CreatePublicTipDto } from '../dto/create-public-tip.dto';
import { TipsQueryType } from '../dto/tips-query.schema';
import { Language, TipStatus } from 'generated/prisma';

const PERFORMANCE_CHANGE_THRESHOLD_PERCENT = 20;

@Injectable()
export class TipsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly accessControl: AccessControlService,
        private readonly usersService: UsersService,
    ) { }

    private resolveEmployeeRef(employee: any, primaryLanguage: Language): any {
        if (!employee) return employee;
        return { ...employee, full_name: resolveTranslatedText(employee.full_name as TranslatedText, undefined, primaryLanguage) };
    }

    private resolveTipEmployeeNames(tip: any, primaryLanguage: Language): any {
        return {
            ...tip,
            ...(tip.employee !== undefined ? { employee: this.resolveEmployeeRef(tip.employee, primaryLanguage) } : {}),
            ...(tip.distributions !== undefined
                ? {
                    distributions: tip.distributions.map((d: any) => ({
                        ...d,
                        ...(d.employee !== undefined ? { employee: this.resolveEmployeeRef(d.employee, primaryLanguage) } : {}),
                    })),
                }
                : {}),
        };
    }

    async createPublicTip(dto: CreatePublicTipDto) {
        const qrCode = await this.prisma.qrCode.findUnique({
            where: { id: dto.qr_code_id },
            include: {
                store: true,
                employees: { include: { employee: true } },
            },
        });

        if (!qrCode) throw new NotFoundException('QR code not found');
        if (!qrCode.is_active) throw new BadRequestException('This QR code is no longer active');
        if (!qrCode.store.is_active) throw new BadRequestException('This store is no longer active');

        const store = qrCode.store;
        const assignedEmployees = qrCode.employees
            .map((e) => e.employee)
            .filter((e) => e.is_active);

        const selectedEmployeeIds = this.resolveSelectedEmployeeIds(qrCode.selection_mode, assignedEmployees, dto);

        if (!store.allow_custom_tip_amount && !store.suggested_tip_amounts.includes(dto.amount)) {
            throw new BadRequestException('This store only accepts one of its suggested tip amounts');
        }

        const distributionRuleId = qrCode.distribution_rule_id || store.default_distribution_rule_id;
        const recipients = distributionRuleId
            ? await this.prisma.distributionRuleRecipient.findMany({ where: { distribution_rule_id: distributionRuleId } })
            : [];

        const distributionLines = calculateTipDistribution(
            recipients.map((r) => ({
                recipient_type: r.recipient_type,
                employee_id: r.employee_id,
                percentage: Number(r.percentage),
                sort_order: r.sort_order,
            })),
            selectedEmployeeIds,
            dto.amount,
        );

        const customerUserId = dto.customer_email
            ? (await this.usersService.findOrCreateByEmail(dto.customer_email, { first_name: dto.customer_name?.split(' ')[0] })).id
            : undefined;

        const currency = dto.currency || store.currency;

        const tip = await this.prisma.$transaction(async (tx) => {
            const created = await tx.tip.create({
                data: {
                    store_id: store.id,
                    qr_code_id: qrCode.id,
                    employee_id: selectedEmployeeIds.length === 1 ? selectedEmployeeIds[0] : null,
                    distribution_rule_id: distributionRuleId,
                    customer_user_id: customerUserId,
                    customer_email: dto.customer_email,
                    customer_name: dto.customer_name,
                    amount: dto.amount,
                    currency,
                    status: TipStatus.COMPLETED,
                    payment_reference: generateMockPaymentReference(),
                    paid_at: new Date(),
                },
            });

            await tx.tipDistribution.createMany({
                data: distributionLines.map((line) => ({
                    tip_id: created.id,
                    recipient_type: line.recipient_type,
                    employee_id: line.employee_id,
                    amount: line.amount,
                    percentage: line.percentage,
                })),
            });

            return created;
        });

        const fullTip = await this.prisma.tip.findUnique({
            where: { id: tip.id },
            include: { distributions: { include: { employee: true } } },
        });

        this.triggerPerformanceChangeAlert(store.id).catch(() => { });

        const thankedNames = assignedEmployees
            .filter((e) => selectedEmployeeIds.includes(e.id))
            .map((e) => resolveTranslatedText(e.full_name as TranslatedText, undefined, store.primary_language))
            .filter((name): name is string => !!name);

        const defaultThankYou = `Thank you. Your ${(dto.amount / 100).toFixed(2)} ${currency} tip was sent to ${thankedNames.length ? thankedNames.join(' & ') : store.name}. Your appreciation means a lot.`;

        const storeThankYou = resolveTranslatedText(store.thank_you_message as any, undefined, store.primary_language);

        return {
            tip: fullTip,
            thank_you_message: storeThankYou || defaultThankYou,
        };
    }

    private resolveSelectedEmployeeIds(
        selectionMode: string,
        assignedEmployees: { id: string }[],
        dto: CreatePublicTipDto,
    ): string[] {
        if (assignedEmployees.length === 0) return [];

        const assignedIds = assignedEmployees.map((e) => e.id);

        if (assignedEmployees.length === 1) {
            return [assignedEmployees[0].id];
        }

        if (selectionMode === 'TEAM') {
            return assignedIds;
        }

        if (selectionMode === 'CHOOSE_MANY') {
            if (!dto.employee_ids || dto.employee_ids.length === 0) {
                throw new BadRequestException('Select at least one employee to thank');
            }
            const invalid = dto.employee_ids.filter((id) => !assignedIds.includes(id));
            if (invalid.length > 0) throw new BadRequestException('One or more selected employees are not assigned to this QR code');
            return dto.employee_ids;
        }

        // CHOOSE_ONE (default)
        if (!dto.employee_id) {
            throw new BadRequestException('Select an employee to thank');
        }
        if (!assignedIds.includes(dto.employee_id)) {
            throw new BadRequestException('The selected employee is not assigned to this QR code');
        }
        return [dto.employee_id];
    }

    private async triggerPerformanceChangeAlert(storeId: string) {
        const preference = await this.prisma.alertPreference.findFirst({
            where: { store_id: storeId, alert_type: 'PERFORMANCE_CHANGE' },
        });
        if (preference && !preference.is_enabled) return;

        const now = new Date();
        const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const previousWeekStart = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

        const alreadyAlertedToday = await this.prisma.alert.findFirst({
            where: {
                store_id: storeId,
                type: 'PERFORMANCE_CHANGE',
                created_at: { gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) },
            },
        });
        if (alreadyAlertedToday) return;

        const [thisWeek, lastWeek] = await Promise.all([
            this.prisma.tip.aggregate({
                where: { store_id: storeId, status: TipStatus.COMPLETED, created_at: { gte: weekStart, lte: now } },
                _sum: { amount: true },
            }),
            this.prisma.tip.aggregate({
                where: { store_id: storeId, status: TipStatus.COMPLETED, created_at: { gte: previousWeekStart, lt: weekStart } },
                _sum: { amount: true },
            }),
        ]);

        const current = thisWeek._sum.amount || 0;
        const previous = lastWeek._sum.amount || 0;
        if (previous === 0) return;

        const changePercent = ((current - previous) / previous) * 100;
        if (Math.abs(changePercent) < PERFORMANCE_CHANGE_THRESHOLD_PERCENT) return;

        const store = await this.prisma.store.findUnique({ where: { id: storeId } });
        if (!store) return;

        await this.prisma.alert.create({
            data: {
                store_id: storeId,
                type: 'PERFORMANCE_CHANGE',
                title: changePercent > 0 ? 'Tips are up' : 'Tips are down',
                message: `Tips at your ${store.name} Store ${changePercent > 0 ? 'increased' : 'decreased'} ${Math.abs(Math.round(changePercent))}% this week.`,
            },
        });
    }

    async findAll(user: AuthUser, storeId: string, query: TipsQueryType) {
        await this.accessControl.assertStoreAccess(user, storeId);

        const where: any = { store_id: storeId };
        if (query.employee_id) where.employee_id = query.employee_id;
        if (query.qr_code_id) where.qr_code_id = query.qr_code_id;
        if (query.status) where.status = query.status;
        if (query.date_from || query.date_to) {
            where.created_at = {};
            if (query.date_from) where.created_at.gte = new Date(query.date_from);
            if (query.date_to) where.created_at.lte = new Date(query.date_to);
        }

        const [items, total, store] = await Promise.all([
            this.prisma.tip.findMany({
                where,
                include: { employee: true, qr_code: true, distributions: true },
                skip: (query.page - 1) * query.limit,
                take: query.limit,
                orderBy: { created_at: 'desc' },
            }),
            this.prisma.tip.count({ where }),
            this.prisma.store.findUnique({ where: { id: storeId }, select: { primary_language: true } }),
        ]);
        const primaryLanguage = store?.primary_language ?? Language.EN;

        return paginate(
            items.map((item) => this.resolveTipEmployeeNames(item, primaryLanguage)),
            total,
            query,
        );
    }

    async findOne(user: AuthUser, id: string) {
        const tip = await this.prisma.tip.findUnique({
            where: { id },
            include: {
                employee: true,
                qr_code: true,
                distribution_rule: true,
                distributions: { include: { employee: true } },
                review: true,
                refunds: true,
            },
        });
        if (!tip) throw new NotFoundException('Tip not found');

        await this.accessControl.assertStoreAccess(user, tip.store_id);

        const store = await this.prisma.store.findUnique({ where: { id: tip.store_id }, select: { primary_language: true } });
        return this.resolveTipEmployeeNames(tip, store?.primary_language ?? Language.EN);
    }
}
