import { BadGatewayException, BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { AccessControlService, AuthUser } from '@/shared/services/access-control/access-control.service';
import { UsersService } from '@/modules/users/services/users.service';
import { resolveTranslatedText, TranslatedText } from '@/shared/utils/translation/translation.utils';
import { paginate } from '@/shared/utils/pagination/pagination-query.schema';
import { toIso4217NumericCode } from '@/shared/utils/currency/currency.util';
import { PlatformFinanceConfig } from '@/shared/config/platform-finance/platform-finance.config';
import { VivaConfig } from '@/integrations/viva/viva.config';
import { VivaCheckoutService } from '@/integrations/viva/services/viva-checkout.service';
import { CreatePublicTipDto } from '../dto/create-public-tip.dto';
import { TipsQueryType } from '../dto/tips-query.schema';
import { Currency, Language, PaymentTransactionStatus, Tip, TipStatus } from 'generated/prisma';

const PERFORMANCE_CHANGE_THRESHOLD_PERCENT = 20;

@Injectable()
export class TipsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly accessControl: AccessControlService,
        private readonly usersService: UsersService,
        private readonly platformFinanceConfig: PlatformFinanceConfig,
        private readonly vivaConfig: VivaConfig,
        private readonly vivaCheckout: VivaCheckoutService,
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

    private buildCheckoutUrl(orderCode: string | number): string {
        return `${this.vivaConfig.getNativeBaseUrl()}/web/checkout?ref=${orderCode}`;
    }

    // Resolves Viva's own order-code redirect param (the "s" query param
    // Viva appends to the Source's Success/Failure URL) back to our tip —
    // used only as a lookup key for the checkout-return page's fallback
    // path (sessionStorage unavailable, e.g. a different device/browser).
    // The order code is never trusted for the tip's actual status; the
    // caller still polls GET /public/tips/:id/status, which re-verifies
    // server-side, same as the primary path.
    async resolveTipIdByOrderCode(orderCode: string) {
        const paymentTransaction = await this.prisma.paymentTransaction.findUnique({
            where: { provider_order_code: orderCode },
            include: { tip: { include: { store: true, qr_code: true } } },
        });
        if (!paymentTransaction) throw new NotFoundException('No tip found for this order code');

        return {
            tip_id: paymentTransaction.tip.id,
            store_slug: paymentTransaction.tip.store.slug,
            qr_code: paymentTransaction.tip.qr_code.code,
        };
    }

    async createPublicTip(dto: CreatePublicTipDto) {
        if (dto.client_request_id) {
            const existing = await this.prisma.paymentTransaction.findUnique({
                where: { client_request_id: dto.client_request_id },
                include: { tip: true },
            });
            if (
                existing?.provider_order_code &&
                (existing.tip.status === TipStatus.CREATED || existing.tip.status === TipStatus.PROCESSING)
            ) {
                return { tip_id: existing.tip.id, checkout_url: this.buildCheckoutUrl(existing.provider_order_code) };
            }
        }

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

        const customerUserId = dto.customer_email
            ? (await this.usersService.findOrCreateByEmail(dto.customer_email, { first_name: dto.customer_name?.split(' ')[0] })).id
            : undefined;

        const currency: Currency = dto.currency || store.currency;
        const commissionPercentage = this.platformFinanceConfig.getCommissionPercentage();
        const commissionAmount = Math.round((dto.amount * commissionPercentage) / 100);

        const { tip, paymentTransactionId } = await this.prisma.$transaction(async (tx) => {
            const created = await tx.tip.create({
                data: {
                    store_id: store.id,
                    qr_code_id: qrCode.id,
                    employee_id: selectedEmployeeIds.length === 1 ? selectedEmployeeIds[0] : null,
                    distribution_rule_id: distributionRuleId,
                    selected_employee_ids: selectedEmployeeIds,
                    customer_user_id: customerUserId,
                    customer_email: dto.customer_email,
                    customer_name: dto.customer_name,
                    amount: dto.amount,
                    currency,
                    status: TipStatus.CREATED,
                },
            });

            const paymentTransaction = await tx.paymentTransaction.create({
                data: {
                    tip_id: created.id,
                    client_request_id: dto.client_request_id,
                    gross_amount: dto.amount,
                    currency,
                    commission_percentage_used: commissionPercentage,
                    commission_amount: commissionAmount,
                    status: PaymentTransactionStatus.CREATED,
                },
            });

            return { tip: created, paymentTransactionId: paymentTransaction.id };
        });

        let orderCode: number;
        try {
            const order = await this.vivaCheckout.createOrder({
                amount: dto.amount,
                tipAmount: dto.amount,
                currencyCode: toIso4217NumericCode(currency),
                merchantTrns: tip.id,
                customerTrns: `Tip for ${store.name}`,
                sourceCode: this.vivaConfig.getDefaultSourceCode(),
                paymentTimeout: 600,
            });
            orderCode = order.orderCode;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error creating Viva order';
            await this.prisma.$transaction([
                this.prisma.tip.update({ where: { id: tip.id }, data: { status: TipStatus.FAILED } }),
                this.prisma.paymentTransaction.update({
                    where: { id: paymentTransactionId },
                    data: { status: PaymentTransactionStatus.FAILED, failure_reason: message },
                }),
            ]);
            throw new BadGatewayException('Unable to start checkout with the payment processor. Please try again.');
        }

        await this.prisma.paymentTransaction.update({
            where: { id: paymentTransactionId },
            data: { provider_order_code: String(orderCode) },
        });

        return { tip_id: tip.id, checkout_url: this.buildCheckoutUrl(orderCode) };
    }

    async getPublicStatus(id: string) {
        const tip = await this.prisma.tip.findUnique({
            where: { id },
            include: {
                employee: true,
                store: true,
                payment_transaction: true,
                distributions: { include: { employee: true } },
            },
        });
        if (!tip) throw new NotFoundException('Tip not found');

        const primaryLanguage = tip.store.primary_language;
        const employee = tip.employee ? this.resolveEmployeeRef(tip.employee, primaryLanguage) : null;

        return {
            id: tip.id,
            status: tip.status,
            amount: tip.amount,
            currency: tip.currency,
            employee,
            order_code: tip.payment_transaction?.provider_order_code ?? null,
            distribution_summary:
                tip.status === TipStatus.COMPLETED
                    ? tip.distributions.map((d) => ({
                        recipient_type: d.recipient_type,
                        employee: d.employee ? this.resolveEmployeeRef(d.employee, primaryLanguage) : null,
                        amount: d.amount,
                        percentage: d.percentage,
                    }))
                    : undefined,
            thank_you_message: tip.status === TipStatus.COMPLETED ? this.buildThankYouMessage(tip, primaryLanguage) : undefined,
        };
    }

    private buildThankYouMessage(tip: any, primaryLanguage: Language): string {
        const thankedNames = (tip.distributions as any[])
            .filter((d) => d.recipient_type === 'EMPLOYEE' && d.employee)
            .map((d) => resolveTranslatedText(d.employee.full_name as TranslatedText, undefined, primaryLanguage))
            .filter((name): name is string => !!name);

        const defaultThankYou = `Thank you. Your ${(tip.amount / 100).toFixed(2)} ${tip.currency} tip was sent to ${thankedNames.length ? thankedNames.join(' & ') : tip.store.name}. Your appreciation means a lot.`;
        const storeThankYou = resolveTranslatedText(tip.store.thank_you_message as TranslatedText, undefined, primaryLanguage);

        return storeThankYou || defaultThankYou;
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

    async triggerPerformanceChangeAlert(storeId: string) {
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
                payment_transaction: true,
            },
        });
        if (!tip) throw new NotFoundException('Tip not found');

        const { membership } = await this.accessControl.assertStoreAccess(user, tip.store_id);

        // membership is null only for platform admins (assertStoreAccess
        // short-circuits for them) — everyone else must be OWNER/ACCOUNTANT
        // to see the financial breakdown (payment plan §16).
        const canViewFinancials = membership === null || membership.role === 'OWNER' || membership.role === 'ACCOUNTANT';

        const store = await this.prisma.store.findUnique({ where: { id: tip.store_id }, select: { primary_language: true } });
        const resolved = this.resolveTipEmployeeNames(tip, store?.primary_language ?? Language.EN);

        if (!canViewFinancials) {
            const { payment_transaction, ...rest } = resolved;
            return rest;
        }

        return resolved;
    }
}
