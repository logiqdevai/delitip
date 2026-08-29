import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { AccessControlService, AuthUser } from '@/shared/services/access-control/access-control.service';
import { CreateDistributionRuleDto } from './dto/create-distribution-rule.dto';
import { UpdateDistributionRuleDto } from './dto/update-distribution-rule.dto';
import { RecipientInputDto } from './dto/recipient-input.dto';
import { SetDefaultDistributionRuleDto } from './dto/set-default-distribution-rule.dto';
import { DistributionRecipientType, OrganizationRole } from 'generated/prisma';

const MANAGE_ROLES: OrganizationRole[] = [OrganizationRole.OWNER, OrganizationRole.STORE_MANAGER];

const RECIPIENTS_INCLUDE = {
    recipients: {
        orderBy: { sort_order: 'asc' as const },
        include: {
            employee: { select: { id: true, full_name: true } },
        },
    },
};

@Injectable()
export class DistributionRulesService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly accessControl: AccessControlService,
    ) { }

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

    async create(user: AuthUser, storeId: string, dto: CreateDistributionRuleDto) {
        await this.accessControl.assertStoreAccess(user, storeId, MANAGE_ROLES);

        await this.validateRecipients(storeId, dto.recipients);

        return this.prisma.$transaction(async (tx) => {
            const rule = await tx.distributionRule.create({
                data: { store_id: storeId, name: dto.name },
            });

            await tx.distributionRuleRecipient.createMany({
                data: dto.recipients.map((recipient, index) => ({
                    distribution_rule_id: rule.id,
                    recipient_type: recipient.recipient_type,
                    employee_id:
                        recipient.recipient_type === DistributionRecipientType.EMPLOYEE
                            ? recipient.employee_id
                            : null,
                    percentage: recipient.percentage,
                    sort_order: recipient.sort_order ?? index,
                })),
            });

            return tx.distributionRule.findUnique({ where: { id: rule.id }, include: RECIPIENTS_INCLUDE });
        });
    }

    async findAllForStore(user: AuthUser, storeId: string) {
        await this.accessControl.assertStoreAccess(user, storeId);

        return this.prisma.distributionRule.findMany({
            where: { store_id: storeId },
            include: RECIPIENTS_INCLUDE,
            orderBy: { created_at: 'desc' },
        });
    }

    async findOne(user: AuthUser, id: string) {
        const rule = await this.prisma.distributionRule.findUnique({ where: { id } });
        if (!rule) throw new NotFoundException('Distribution rule not found');

        await this.accessControl.assertStoreAccess(user, rule.store_id);

        return this.prisma.distributionRule.findUnique({ where: { id }, include: RECIPIENTS_INCLUDE });
    }

    async update(user: AuthUser, id: string, dto: UpdateDistributionRuleDto) {
        const rule = await this.prisma.distributionRule.findUnique({ where: { id } });
        if (!rule) throw new NotFoundException('Distribution rule not found');

        await this.accessControl.assertStoreAccess(user, rule.store_id, MANAGE_ROLES);

        if (dto.recipients) {
            await this.validateRecipients(rule.store_id, dto.recipients);

            return this.prisma.$transaction(async (tx) => {
                if (dto.name !== undefined) {
                    await tx.distributionRule.update({ where: { id }, data: { name: dto.name } });
                }

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

                return tx.distributionRule.findUnique({ where: { id }, include: RECIPIENTS_INCLUDE });
            });
        }

        if (dto.name !== undefined) {
            await this.prisma.distributionRule.update({ where: { id }, data: { name: dto.name } });
        }

        return this.prisma.distributionRule.findUnique({ where: { id }, include: RECIPIENTS_INCLUDE });
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
