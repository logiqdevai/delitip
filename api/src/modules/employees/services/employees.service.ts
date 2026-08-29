import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { AccessControlService, AuthUser } from '@/shared/services/access-control/access-control.service';
import { UsersService } from '@/modules/users/services/users.service';
import { paginate, PaginationQueryType } from '@/shared/utils/pagination/pagination-query.schema';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { UpdateEmployeeDto } from '../dto/update-employee.dto';
import { EmployeesQueryType } from '../dto/employees-query.schema';
import { OrganizationRole, PayoutStatus } from 'generated/prisma';

@Injectable()
export class EmployeesService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly accessControl: AccessControlService,
        private readonly usersService: UsersService,
    ) { }

    async create(user: AuthUser, storeId: string, dto: CreateEmployeeDto) {
        await this.accessControl.assertStoreAccess(user, storeId, [OrganizationRole.OWNER, OrganizationRole.STORE_MANAGER]);

        const firstName = dto.full_name.trim().split(/\s+/)[0];
        const linkedUser = await this.usersService.findOrCreateByEmail(dto.email, { first_name: firstName });

        return this.prisma.employee.create({
            data: {
                store_id: storeId,
                user_id: linkedUser.id,
                full_name: dto.full_name,
                email: dto.email,
                position: dto.position,
                photo_document_id: dto.photo_document_id,
            },
        });
    }

    async findAllForStore(user: AuthUser, storeId: string, query: EmployeesQueryType) {
        await this.accessControl.assertStoreAccess(user, storeId);

        const where = {
            store_id: storeId,
            ...(query.is_active !== undefined && { is_active: query.is_active }),
        };

        const [items, total] = await Promise.all([
            this.prisma.employee.findMany({
                where,
                skip: (query.page - 1) * query.limit,
                take: query.limit,
                orderBy: { created_at: 'desc' },
            }),
            this.prisma.employee.count({ where }),
        ]);

        return paginate(items, total, query);
    }

    async findOne(user: AuthUser, id: string) {
        const { employee } = await this.accessControl.assertEmployeeSelfOrStoreAccess(user, id);

        return this.prisma.employee.findUnique({
            where: { id: employee.id },
            include: { photo_document: true },
        });
    }

    async update(user: AuthUser, id: string, dto: UpdateEmployeeDto) {
        const employee = await this.prisma.employee.findUnique({ where: { id } });
        if (!employee) throw new NotFoundException('Employee not found');

        await this.accessControl.assertStoreAccess(user, employee.store_id, [OrganizationRole.OWNER, OrganizationRole.STORE_MANAGER]);

        return this.prisma.employee.update({ where: { id }, data: dto });
    }

    async remove(user: AuthUser, id: string) {
        const employee = await this.prisma.employee.findUnique({ where: { id } });
        if (!employee) throw new NotFoundException('Employee not found');

        await this.accessControl.assertStoreAccess(user, employee.store_id, [OrganizationRole.OWNER, OrganizationRole.STORE_MANAGER]);

        await this.prisma.employee.delete({ where: { id } });
        return { success: true };
    }

    async dashboard(user: AuthUser, id: string) {
        const { employee } = await this.accessControl.assertEmployeeSelfOrStoreAccess(user, id);

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const [distributionsThisMonth, ratingAgg, reviewsCount, recentFeedback] = await Promise.all([
            this.prisma.tipDistribution.findMany({
                where: {
                    employee_id: employee.id,
                    created_at: { gte: startOfMonth },
                    payout_status: { not: PayoutStatus.CANCELLED },
                },
                include: { tip: { include: { distribution_rule: true } } },
            }),
            this.prisma.review.aggregate({
                where: { employee_id: employee.id },
                _avg: { rating: true },
            }),
            this.prisma.review.count({ where: { employee_id: employee.id } }),
            this.prisma.review.findMany({
                where: { employee_id: employee.id, comment: { not: null } },
                orderBy: { created_at: 'desc' },
                take: 5,
                select: { comment: true, rating: true, created_at: true },
            }),
        ]);

        const totalAmount = distributionsThisMonth.reduce((sum, d) => sum + d.amount, 0);

        const byRuleMap = new Map<string, number>();
        for (const d of distributionsThisMonth) {
            const ruleName = d.tip?.distribution_rule?.name ?? 'No rule';
            byRuleMap.set(ruleName, (byRuleMap.get(ruleName) ?? 0) + d.amount);
        }
        const byDistributionRule = Array.from(byRuleMap.entries()).map(([rule_name, total_amount]) => ({
            rule_name,
            total_amount,
        }));

        return {
            tips_this_month: {
                total_amount: totalAmount,
                by_distribution_rule: byDistributionRule,
            },
            average_rating: ratingAgg._avg.rating,
            reviews_count: reviewsCount,
            customer_recognition_count: reviewsCount,
            recent_feedback: recentFeedback,
        };
    }

    async tips(user: AuthUser, id: string, query: PaginationQueryType) {
        const { employee } = await this.accessControl.assertEmployeeSelfOrStoreAccess(user, id);

        const where = { employee_id: employee.id, payout_status: { not: PayoutStatus.CANCELLED } };

        const [items, total] = await Promise.all([
            this.prisma.tipDistribution.findMany({
                where,
                skip: (query.page - 1) * query.limit,
                take: query.limit,
                orderBy: { created_at: 'desc' },
                include: {
                    tip: {
                        select: { amount: true, currency: true, created_at: true, store_id: true },
                    },
                },
            }),
            this.prisma.tipDistribution.count({ where }),
        ]);

        return paginate(items, total, query);
    }

    async reviews(user: AuthUser, id: string, query: PaginationQueryType) {
        const { employee } = await this.accessControl.assertEmployeeSelfOrStoreAccess(user, id);

        const where = { employee_id: employee.id };

        const [items, total] = await Promise.all([
            this.prisma.review.findMany({
                where,
                skip: (query.page - 1) * query.limit,
                take: query.limit,
                orderBy: { created_at: 'desc' },
            }),
            this.prisma.review.count({ where }),
        ]);

        return paginate(items, total, query);
    }
}
