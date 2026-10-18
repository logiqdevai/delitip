import { BadRequestException, ConflictException, ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { GcsService } from '@/integrations/storage/gcs/services/gcs.service';
import { GcsFolders } from '@/integrations/storage/gcs/config/gcs-folders.config';
import { VivaBankTransfersService } from '@/integrations/viva/services/viva-bank-transfers.service';
import { AuthUser } from '@/shared/services/access-control/access-control.service';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UsersQueryType } from '../dto/users-query.schema';
import { paginate } from '@/shared/utils/pagination/pagination-query.schema';
import { resolveTranslatedText, TranslatedText } from '@/shared/utils/translation/translation.utils';

@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly gcsService: GcsService,
        private readonly vivaBankTransfers: VivaBankTransfersService,
    ) { }

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
                include: {
                    organization: true,
                    store: { include: { logo_document: true } },
                },
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
            employee_accounts: employee_accounts.map((employee) => {
                const translations = (employee.full_name as TranslatedText) || {};
                return {
                    ...employee,
                    full_name: resolveTranslatedText(translations, undefined, employee.store.primary_language) ?? '',
                    full_name_translations: translations,
                };
            }),
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

    // Permanently deletes a user and everything hanging off them. Postgres
    // cascades handle most rows (memberships, documents, payout account, reset
    // tokens); the rest is done explicitly here:
    //  - organizations the user is the only member of go with them (stores,
    //    tips, etc. cascade from the organization), since nobody could ever
    //    manage them again;
    //  - every document row/file that belonged to the user or to those
    //    organizations is removed from Google Cloud Storage once the database
    //    delete has committed.
    // Employee/tip/review/settlement rows that merely reference the user are
    // detached (SET NULL) because they belong to other businesses' records.
    async remove(actor: AuthUser, id: string) {
        if (actor.id === id) throw new BadRequestException('You cannot delete your own account');

        const target = await this.prisma.user.findUnique({ where: { id }, select: { id: true, role: true } });
        if (!target) throw new NotFoundException('User not found');
        if (target.role === 'SUPER_ADMIN') throw new ForbiddenException('Super admins cannot be deleted');
        if (target.role === 'ADMIN' && actor.role !== 'SUPER_ADMIN') {
            throw new ForbiddenException('Only a super admin can delete an admin');
        }

        const memberships = await this.prisma.organizationMember.findMany({
            where: { user_id: id },
            select: { organization_id: true },
        });
        const soleOrganizations = await this.prisma.organization.findMany({
            where: {
                id: { in: [...new Set(memberships.map((membership) => membership.organization_id))] },
                members: { every: { user_id: id } },
            },
            select: { id: true },
        });
        const organizationIds = soleOrganizations.map((organization) => organization.id);

        const documents = await this.prisma.document.findMany({
            where: {
                OR: [
                    { user_uuid: id },
                    { organizations_logo: { some: { id: { in: organizationIds } } } },
                    { stores_logo: { some: { organization_id: { in: organizationIds } } } },
                    { stores_cover: { some: { organization_id: { in: organizationIds } } } },
                    { employees_photo: { some: { store: { organization_id: { in: organizationIds } } } } },
                ],
            },
            select: { id: true, filename: true },
        });

        // Read before the delete: the payout account rows (the user's own, and
        // those of the doomed organizations' stores) cascade away with it.
        const payoutAccounts = await this.prisma.payoutAccount.findMany({
            where: { OR: [{ user_id: id }, { store: { organization_id: { in: organizationIds } } }] },
            select: { bank_account_id: true, connected_account_id: true },
        });
        const bankAccountIds = payoutAccounts.flatMap((account) => (account.bank_account_id ? [account.bank_account_id] : []));
        const connectedAccountIds = payoutAccounts.flatMap((account) => (account.connected_account_id ? [account.connected_account_id] : []));

        try {
            await this.prisma.$transaction(async (tx) => {
                // Organizations first: their stores' payout requests hold a
                // Restrict FK on the invoice documents deleted below.
                await tx.organization.deleteMany({ where: { id: { in: organizationIds } } });
                await tx.document.deleteMany({ where: { id: { in: documents.map((document) => document.id) } } });
                await tx.user.delete({ where: { id } });
            });
        } catch (error) {
            // Restrict FK from payout_requests.invoice_document_id: an invoice
            // the user uploaded for another business's payout request is part
            // of that business's audit trail.
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
                throw new ConflictException(
                    "This user uploaded an invoice attached to another business's payout request and cannot be deleted",
                );
            }
            throw error;
        }

        const results = await Promise.allSettled(
            documents.map((document) =>
                this.gcsService.deleteImage({ filename: document.filename, folder: GcsFolders.documents }),
            ),
        );
        const failed = results.filter((result) => result.status === 'rejected').length;
        if (failed > 0) {
            this.logger.warn(`Deleted user ${id} but ${failed} of ${documents.length} storage files could not be removed`);
        }

        // Viva has no delete for linked bank accounts, only archiving, so that
        // is as far as the cleanup can go. Its API exposes no way to close a
        // connected (marketplace) account at all: those are only reported.
        const archiveResults = await Promise.allSettled(
            bankAccountIds.map((bankAccountId) => this.vivaBankTransfers.updateBankAccount(bankAccountId, { archive: true })),
        );
        const bankAccountsFailed = archiveResults.filter((result) => result.status === 'rejected').length;
        if (bankAccountsFailed > 0) {
            this.logger.warn(`Deleted user ${id} but ${bankAccountsFailed} of ${bankAccountIds.length} Viva bank accounts could not be archived`);
        }
        if (connectedAccountIds.length > 0) {
            this.logger.warn(`Deleted user ${id}; Viva connected accounts must be closed manually: ${connectedAccountIds.join(', ')}`);
        }

        return {
            success: true,
            organizations_deleted: organizationIds.length,
            files_deleted: documents.length - failed,
            files_failed: failed,
            viva_bank_accounts_archived: bankAccountIds.length - bankAccountsFailed,
            viva_bank_accounts_failed: bankAccountsFailed,
            viva_connected_accounts_remaining: connectedAccountIds.length,
        };
    }
}
