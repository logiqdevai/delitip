import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UsersQueryType } from '../dto/users-query.schema';
import { paginate } from '@/shared/utils/pagination/pagination-query.schema';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) { }

    async findOrCreateByEmail(
        email: string,
        data?: { first_name?: string; last_name?: string; phone?: string },
    ) {
        const existing = await this.prisma.user.findUnique({ where: { email } });
        if (existing) return existing;

        return this.prisma.user.create({
            data: {
                email,
                first_name: data?.first_name,
                last_name: data?.last_name,
                phone: data?.phone || undefined,
            },
        });
    }

    async getById(id: string) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) throw new NotFoundException('User not found');
        delete user.password;
        return user;
    }

    async updateProfile(id: string, dto: UpdateUserDto) {
        const user = await this.prisma.user.update({ where: { id }, data: dto });
        delete user.password;
        return user;
    }

    async getMyAccounts(id: string) {
        const [organization_memberships, employee_accounts, customerActivity] = await Promise.all([
            this.prisma.organizationMember.findMany({
                where: { user_id: id },
                include: { organization: true, store: true },
            }),
            this.prisma.employee.findMany({
                where: { user_id: id },
                include: { store: true, photo_document: true },
            }),
            this.prisma.tip.findFirst({ where: { customer_user_id: id }, select: { id: true } }),
        ]);

        const hasReview = customerActivity
            ? true
            : !!(await this.prisma.review.findFirst({ where: { customer_user_id: id }, select: { id: true } }));

        return {
            organization_memberships,
            employee_accounts,
            has_customer_account: !!customerActivity || hasReview,
        };
    }

    async findAll(query: UsersQueryType) {
        const where = query.search
            ? {
                OR: [
                    { email: { contains: query.search, mode: 'insensitive' as const } },
                    { first_name: { contains: query.search, mode: 'insensitive' as const } },
                    { last_name: { contains: query.search, mode: 'insensitive' as const } },
                ],
            }
            : {};

        const [items, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                skip: (query.page - 1) * query.limit,
                take: query.limit,
                orderBy: { created_at: 'desc' },
            }),
            this.prisma.user.count({ where }),
        ]);

        items.forEach((u) => delete u.password);

        return paginate(items, total, query);
    }
}
