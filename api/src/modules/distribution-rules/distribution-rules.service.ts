import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { AccessControlService, AuthUser } from '@/shared/services/access-control/access-control.service';
import { resolveTranslatedText, TranslatedText } from '@/shared/utils/translation/translation.utils';
import { CreateDistributionRuleDto } from './dto/create-distribution-rule.dto';
import { UpdateDistributionRuleDto } from './dto/update-distribution-rule.dto';
import { RecipientInputDto } from './dto/recipient-input.dto';
import { SetDefaultDistributionRuleDto } from './dto/set-default-distribution-rule.dto';
import {
    DistributionPayoutMode,
    DistributionRecipientType,
    Language,
    OrganizationRole,
    PayoutStatus,
    Prisma,
    SettlementStatus,
} from 'generated/prisma';

const MANAGE_ROLES: OrganizationRole[] = [OrganizationRole.OWNER, OrganizationRole.STORE_MANAGER];

const RECIPIENTS_INCLUDE = {
    recipients: {
        orderBy: { sort_order: 'asc' as const },
        include: {
            employee: { select: { id: true, full_name: true } },
        },
    },
};

type RuleWithRecipients = {
    recipients: { employee: { full_name: unknown } | null }[];
} | null;

@Injectable()
export class DistributionRulesService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly accessControl: AccessControlService,
    ) { }

    private async resolveRecipientNames<T extends RuleWithRecipients>(rule: T, storeId: string): Promise<T> {
        if (!rule) return rule;
        const store = await this.prisma.store.findUnique({ where: { id: storeId }, select: { primary_language: true } });
        const primaryLanguage: Language = store?.primary_language ?? Language.EN;
        return {
            ...rule,
            recipients: rule.recipients.map((recipient) =>
                recipient.employee
                    ? {
                        ...recipient,
                        employee: {
                            ...recipient.employee,
                            full_name: resolveTranslatedText(recipient.employee.full_name as TranslatedText, undefined, primaryLanguage),
                        },
                    }
                    : recipient,
            ),
        };
    }

    private async validateRecipients(storeId: string, recipients: RecipientInputDto[]) {
        if (!recipients || recipients.length === 0) {
            throw new BadRequestException('At least one recipient is required');
        }

        for (const recipient of recipients) {
            if (recipient.recipient_type === DistributionRecipientType.EMPLOYEE && !recipient.employee_id) {
                throw new BadRequestException('employee_id is required for EMPLOYEE recipients');
            }
            if (recipient.recipient_type === DistributionRecipientType.STORE && recipient.employee_id) {
                throw new BadRequestException('employee_id must not be set for STORE recipients');
            }
        }

        const employeeIds = recipients
            .filter((r) => r.recipient_type === DistributionRecipientType.EMPLOYEE)
            .map((r) => r.employee_id as string);

        if (employeeIds.length > 0) {
            const uniqueEmployeeIds = Array.from(new Set(employeeIds));
            const employees = await this.prisma.employee.findMany({
                where: { id: { in: uniqueEmployeeIds }, store_id: storeId },
                select: { id: true },
            });
            if (employees.length !== uniqueEmployeeIds.length) {
                throw new BadRequestException('One or more employees do not belong to this store');
            }
        }

        const sum = recipients.reduce((acc, r) => acc + Number(r.percentage), 0);
        if (Math.abs(sum - 100) > 0.01) {
            throw new BadRequestException('Recipients must sum to 100%');
        }
    }

    // Distributions that haven't been claimed by a payout run and haven't been
    // handed over yet — the only ones a rule edit is allowed to re-route. Money
    // already in flight, already paid, or already settled with an employee is
    // frozen: re-routing it would rewrite a record of something that happened.
    // Rows locked into an open PayoutRequest are frozen too — the Store has
    // already invoiced that exact amount, so its composition can't change.
    private pendingDistributionsFilter(ruleId: string): Prisma.TipDistributionWhereInput {
        return {
            tip: { distribution_rule_id: ruleId },
            payout_id: null,
            payout_request_id: null,
            payout_status: PayoutStatus.PENDING,
            settlement_status: { notIn: [SettlementStatus.SETTLED, SettlementStatus.CANCELLED] },
        };
    }

    private async countReroutableDistributions(ruleId: string) {
        return this.prisma.tipDistribution.count({ where: this.pendingDistributionsFilter(ruleId) });
    }

    // Applies a rule's new payout_mode to everything still pending under it, so
    // the Store isn't left running two modes side by side after a switch.
    private async reroutePendingDistributions(
        tx: Prisma.TransactionClient,
        ruleId: string,
        mode: DistributionPayoutMode,
    ): Promise<number> {
        const pending = await tx.tipDistribution.findMany({
            where: this.pendingDistributionsFilter(ruleId),
            select: { id: true, recipient_type: true },
        });

        if (pending.length === 0) return 0;

        // Only an employee's share can be owed — the Store can't owe itself.
        const employeeIds = pending
            .filter((d) => d.recipient_type === DistributionRecipientType.EMPLOYEE)
            .map((d) => d.id);
        const storeIds = pending
            .filter((d) => d.recipient_type === DistributionRecipientType.STORE)
            .map((d) => d.id);

        if (employeeIds.length > 0) {
            await tx.tipDistribution.updateMany({
                where: { id: { in: employeeIds } },
                data: {
                    payout_mode: mode,
                    settlement_status:
                        mode === DistributionPayoutMode.VIA_STORE
                            ? SettlementStatus.OWED
                            : SettlementStatus.NOT_REQUIRED,
                },
            });
        }

        if (storeIds.length > 0) {
            await tx.tipDistribution.updateMany({
                where: { id: { in: storeIds } },
                data: { payout_mode: mode, settlement_status: SettlementStatus.NOT_REQUIRED },
            });
        }

        return pending.length;
    }

    // What a mode switch would move, so the UI can warn before saving.
    async previewPayoutModeChange(user: AuthUser, id: string) {
        const rule = await this.prisma.distributionRule.findUnique({ where: { id } });
        if (!rule) throw new NotFoundException('Distribution rule not found');

        await this.accessControl.assertStoreAccess(user, rule.store_id, MANAGE_ROLES);

        return {
            current_payout_mode: rule.payout_mode,
            affected_distributions_count: await this.countReroutableDistributions(id),
        };
    }

    async create(user: AuthUser, storeId: string, dto: CreateDistributionRuleDto) {
        await this.accessControl.assertStoreAccess(user, storeId, MANAGE_ROLES);

        await this.validateRecipients(storeId, dto.recipients);

        const rule = await this.prisma.$transaction(async (tx) => {
            const created = await tx.distributionRule.create({
                data: { store_id: storeId, name: dto.name, payout_mode: dto.payout_mode ?? DistributionPayoutMode.DIRECT },
            });

            await tx.distributionRuleRecipient.createMany({
                data: dto.recipients.map((recipient, index) => ({
                    distribution_rule_id: created.id,
                    recipient_type: recipient.recipient_type,
                    employee_id:
                        recipient.recipient_type === DistributionRecipientType.EMPLOYEE
                            ? recipient.employee_id
                            : null,
                    percentage: recipient.percentage,
                    sort_order: recipient.sort_order ?? index,
                })),
            });

            return tx.distributionRule.findUnique({ where: { id: created.id }, include: RECIPIENTS_INCLUDE });
        });

        return this.resolveRecipientNames(rule, storeId);
    }

    async findAllForStore(user: AuthUser, storeId: string) {
        await this.accessControl.assertStoreAccess(user, storeId);

        const rules = await this.prisma.distributionRule.findMany({
            where: { store_id: storeId },
            include: RECIPIENTS_INCLUDE,
            orderBy: { created_at: 'desc' },
        });

        const store = await this.prisma.store.findUnique({ where: { id: storeId }, select: { primary_language: true } });
        const primaryLanguage: Language = store?.primary_language ?? Language.EN;

        return rules.map((rule) => ({
            ...rule,
            recipients: rule.recipients.map((recipient) =>
                recipient.employee
                    ? {
                        ...recipient,
                        employee: {
                            ...recipient.employee,
                            full_name: resolveTranslatedText(recipient.employee.full_name as TranslatedText, undefined, primaryLanguage),
                        },
                    }
                    : recipient,
            ),
        }));
    }

    async findOne(user: AuthUser, id: string) {
        const rule = await this.prisma.distributionRule.findUnique({ where: { id } });
        if (!rule) throw new NotFoundException('Distribution rule not found');

        await this.accessControl.assertStoreAccess(user, rule.store_id);

        const full = await this.prisma.distributionRule.findUnique({ where: { id }, include: RECIPIENTS_INCLUDE });
        return this.resolveRecipientNames(full, rule.store_id);
    }

    async update(user: AuthUser, id: string, dto: UpdateDistributionRuleDto) {
        const rule = await this.prisma.distributionRule.findUnique({ where: { id } });
        if (!rule) throw new NotFoundException('Distribution rule not found');

        await this.accessControl.assertStoreAccess(user, rule.store_id, MANAGE_ROLES);

        if (dto.recipients) {
            await this.validateRecipients(rule.store_id, dto.recipients);
        }

        const payoutModeChanged = dto.payout_mode !== undefined && dto.payout_mode !== rule.payout_mode;

        const { updated, reroutedCount } = await this.prisma.$transaction(async (tx) => {
            if (dto.name !== undefined || dto.payout_mode !== undefined) {
                await tx.distributionRule.update({
                    where: { id },
                    data: {
                        ...(dto.name !== undefined ? { name: dto.name } : {}),
                        ...(dto.payout_mode !== undefined ? { payout_mode: dto.payout_mode } : {}),
                    },
                });
            }

            if (dto.recipients) {
                await tx.distributionRuleRecipient.deleteMany({ where: { distribution_rule_id: id } });

                await tx.distributionRuleRecipient.createMany({
                    data: dto.recipients.map((recipient, index) => ({
                        distribution_rule_id: id,
                        recipient_type: recipient.recipient_type,
                        employee_id:
                            recipient.recipient_type === DistributionRecipientType.EMPLOYEE
                                ? recipient.employee_id
                                : null,
                        percentage: recipient.percentage,
                        sort_order: recipient.sort_order ?? index,
                    })),
                });
            }

            // A mode switch takes everything still pending under this rule with
            // it, so a Store never has to chase the same money down two routes.
            const rerouted = payoutModeChanged
                ? await this.reroutePendingDistributions(tx, id, dto.payout_mode!)
                : 0;

            return {
                updated: await tx.distributionRule.findUnique({ where: { id }, include: RECIPIENTS_INCLUDE }),
                reroutedCount: rerouted,
            };
        });

        const resolved = await this.resolveRecipientNames(updated, rule.store_id);
        if (!resolved) throw new NotFoundException('Distribution rule not found');

        return { ...resolved, rerouted_distributions_count: reroutedCount };
    }

    async remove(user: AuthUser, id: string) {
        const rule = await this.prisma.distributionRule.findUnique({ where: { id } });
        if (!rule) throw new NotFoundException('Distribution rule not found');

        await this.accessControl.assertStoreAccess(user, rule.store_id, MANAGE_ROLES);

        // Tip.distribution_rule is SetNull on delete, so deleting a rule that was
        // ever actually used wouldn't corrupt the historical TipDistribution payout
        // rows themselves, but it would silently erase which rule produced a past
        // tip's split from the Tip record — block that rather than lose the trail.
        const usedByPastTip = await this.prisma.tip.findFirst({
            where: { distribution_rule_id: id },
            select: { id: true },
        });
        if (usedByPastTip) {
            throw new BadRequestException(
                'This rule has already been used for past tips and cannot be deleted — historical records depend on it',
            );
        }

        const [isStoreDefault, usedByQrCode] = await Promise.all([
            this.prisma.store.findFirst({
                where: { id: rule.store_id, default_distribution_rule_id: id },
                select: { id: true },
            }),
            this.prisma.qrCode.findFirst({
                where: { distribution_rule_id: id },
                select: { id: true },
            }),
        ]);
        if (isStoreDefault) {
            throw new BadRequestException(
                'This rule is set as the Store default — choose a different default before deleting it',
            );
        }
        if (usedByQrCode) {
            throw new BadRequestException(
                'This rule is assigned to one or more QR codes — unassign it first',
            );
        }

        await this.prisma.distributionRule.delete({ where: { id } });
        return { success: true };
    }

    async setDefaultForStore(user: AuthUser, storeId: string, dto: SetDefaultDistributionRuleDto) {
        await this.accessControl.assertStoreAccess(user, storeId, MANAGE_ROLES);

        if (dto.distribution_rule_id) {
            const rule = await this.prisma.distributionRule.findFirst({
                where: { id: dto.distribution_rule_id, store_id: storeId },
            });
            if (!rule) throw new BadRequestException('Distribution rule does not belong to this store');
        }

        return this.prisma.store.update({
            where: { id: storeId },
            data: { default_distribution_rule_id: dto.distribution_rule_id },
            select: { id: true, default_distribution_rule_id: true },
        });
    }
}
