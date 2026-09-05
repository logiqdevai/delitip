import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { AccessControlService, AuthUser } from '@/shared/services/access-control/access-control.service';
import { paginate } from '@/shared/utils/pagination/pagination-query.schema';
import { resolveTranslatedText, TranslatedText } from '@/shared/utils/translation/translation.utils';
import { ensureUniqueQrCode } from './utils/qr-code.utils';
import { CreateQrCodeDto } from './dto/create-qr-code.dto';
import { UpdateQrCodeDto } from './dto/update-qr-code.dto';
import { QrCodesQueryType } from './dto/qr-codes-query.schema';
import { Language, OrganizationRole, QrCodeSelectionMode, TipStatus } from 'generated/prisma';

const MANAGE_ROLES: OrganizationRole[] = [OrganizationRole.OWNER, OrganizationRole.STORE_MANAGER];

const QR_CODE_INCLUDE = {
    employees: {
        include: {
            employee: { select: { id: true, full_name: true, position: true } },
        },
    },
    spots: {
        include: {
            spot: { select: { id: true, name: true } },
        },
    },
    distribution_rule: { select: { id: true, name: true } },
};

interface RefDto {
    distribution_rule_id?: string | null;
    employee_ids?: string[];
    spot_ids?: string[];
}

type QrCodeWithEmployees = {
    employees: { employee: { full_name: unknown } }[];
} | null;

@Injectable()
export class QrCodesService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly accessControl: AccessControlService,
    ) { }

    private async resolveEmployeeNames<T extends QrCodeWithEmployees>(qrCode: T, storeId: string): Promise<T> {
        if (!qrCode) return qrCode;
        const store = await this.prisma.store.findUnique({ where: { id: storeId }, select: { primary_language: true } });
        const primaryLanguage: Language = store?.primary_language ?? Language.EN;
        return {
            ...qrCode,
            employees: qrCode.employees.map((qrCodeEmployee) => ({
                ...qrCodeEmployee,
                employee: {
                    ...qrCodeEmployee.employee,
                    full_name: resolveTranslatedText(qrCodeEmployee.employee.full_name as TranslatedText, undefined, primaryLanguage),
                },
            })),
        };
    }

    private async validateRefs(storeId: string, dto: RefDto) {
        if (dto.distribution_rule_id) {
            const rule = await this.prisma.distributionRule.findFirst({
                where: { id: dto.distribution_rule_id, store_id: storeId },
            });
            if (!rule) throw new BadRequestException('Distribution rule does not belong to this store');
        }

        if (dto.employee_ids && dto.employee_ids.length > 0) {
            const uniqueIds = Array.from(new Set(dto.employee_ids));
            const employees = await this.prisma.employee.findMany({
                where: { id: { in: uniqueIds }, store_id: storeId },
                select: { id: true },
            });
            if (employees.length !== uniqueIds.length) {
                throw new BadRequestException('One or more employees do not belong to this store');
            }
        }

        if (dto.spot_ids && dto.spot_ids.length > 0) {
            const uniqueIds = Array.from(new Set(dto.spot_ids));
            const spots = await this.prisma.spot.findMany({
                where: { id: { in: uniqueIds }, store_id: storeId },
                select: { id: true },
            });
            if (spots.length !== uniqueIds.length) {
                throw new BadRequestException('One or more spots do not belong to this store');
            }
        }
    }

    async create(user: AuthUser, storeId: string, dto: CreateQrCodeDto) {
        await this.accessControl.assertStoreAccess(user, storeId, MANAGE_ROLES);

        await this.validateRefs(storeId, dto);

        const code = await ensureUniqueQrCode(async (candidate) => {
            const existing = await this.prisma.qrCode.findUnique({ where: { code: candidate } });
            return !!existing;
        });

        const created = await this.prisma.$transaction(async (tx) => {
            const qrCode = await tx.qrCode.create({
                data: {
                    store_id: storeId,
                    code,
                    label: dto.label,
                    selection_mode: dto.selection_mode ?? QrCodeSelectionMode.CHOOSE_ONE,
                    distribution_rule_id: dto.distribution_rule_id ?? null,
                },
            });

            if (dto.employee_ids && dto.employee_ids.length > 0) {
                await tx.qrCodeEmployee.createMany({
                    data: dto.employee_ids.map((employee_id) => ({ qr_code_id: qrCode.id, employee_id })),
                });
            }

            if (dto.spot_ids && dto.spot_ids.length > 0) {
                await tx.qrCodeSpot.createMany({
                    data: dto.spot_ids.map((spot_id) => ({ qr_code_id: qrCode.id, spot_id })),
                });
            }

            return tx.qrCode.findUnique({ where: { id: qrCode.id }, include: QR_CODE_INCLUDE });
        });

        return this.resolveEmployeeNames(created, storeId);
    }

    async findAllForStore(user: AuthUser, storeId: string, query: QrCodesQueryType) {
        await this.accessControl.assertStoreAccess(user, storeId);

        const where = {
            store_id: storeId,
            ...(query.is_active !== undefined ? { is_active: query.is_active } : {}),
            ...(query.employee_ids?.length
                ? { employees: { some: { employee_id: { in: query.employee_ids } } } }
                : {}),
            ...(query.spot_ids?.length ? { spots: { some: { spot_id: { in: query.spot_ids } } } } : {}),
            ...(query.distribution_rule_ids?.length
                ? { distribution_rule_id: { in: query.distribution_rule_ids } }
                : {}),
        };

        const [items, total] = await Promise.all([
            this.prisma.qrCode.findMany({
                where,
                include: QR_CODE_INCLUDE,
                skip: (query.page - 1) * query.limit,
                take: query.limit,
                orderBy: { created_at: 'desc' },
            }),
            this.prisma.qrCode.count({ where }),
        ]);

        const store = await this.prisma.store.findUnique({ where: { id: storeId }, select: { primary_language: true } });
        const primaryLanguage: Language = store?.primary_language ?? Language.EN;
        const resolvedItems = items.map((qrCode) => ({
            ...qrCode,
            employees: qrCode.employees.map((qrCodeEmployee) => ({
                ...qrCodeEmployee,
                employee: {
                    ...qrCodeEmployee.employee,
                    full_name: resolveTranslatedText(qrCodeEmployee.employee.full_name as TranslatedText, undefined, primaryLanguage),
                },
            })),
        }));

        return paginate(resolvedItems, total, query);
    }

    async findOne(user: AuthUser, id: string) {
        const qrCode = await this.prisma.qrCode.findUnique({ where: { id } });
        if (!qrCode) throw new NotFoundException('QR code not found');

        await this.accessControl.assertStoreAccess(user, qrCode.store_id);

        const full = await this.prisma.qrCode.findUnique({ where: { id }, include: QR_CODE_INCLUDE });
        return this.resolveEmployeeNames(full, qrCode.store_id);
    }

    async update(user: AuthUser, id: string, dto: UpdateQrCodeDto) {
        const qrCode = await this.prisma.qrCode.findUnique({ where: { id } });
        if (!qrCode) throw new NotFoundException('QR code not found');

        await this.accessControl.assertStoreAccess(user, qrCode.store_id, MANAGE_ROLES);

        await this.validateRefs(qrCode.store_id, dto);

        const updated = await this.prisma.$transaction(async (tx) => {
            await tx.qrCode.update({
                where: { id },
                data: {
                    ...(dto.label !== undefined ? { label: dto.label } : {}),
                    ...(dto.selection_mode !== undefined ? { selection_mode: dto.selection_mode } : {}),
                    ...(dto.is_active !== undefined ? { is_active: dto.is_active } : {}),
                    ...(dto.distribution_rule_id !== undefined
                        ? { distribution_rule_id: dto.distribution_rule_id }
                        : {}),
                },
            });

            if (dto.employee_ids !== undefined) {
                await tx.qrCodeEmployee.deleteMany({ where: { qr_code_id: id } });
                if (dto.employee_ids.length > 0) {
                    await tx.qrCodeEmployee.createMany({
                        data: dto.employee_ids.map((employee_id) => ({ qr_code_id: id, employee_id })),
                    });
                }
            }

            if (dto.spot_ids !== undefined) {
                await tx.qrCodeSpot.deleteMany({ where: { qr_code_id: id } });
                if (dto.spot_ids.length > 0) {
                    await tx.qrCodeSpot.createMany({
                        data: dto.spot_ids.map((spot_id) => ({ qr_code_id: id, spot_id })),
                    });
                }
            }

            return tx.qrCode.findUnique({ where: { id }, include: QR_CODE_INCLUDE });
        });

        return this.resolveEmployeeNames(updated, qrCode.store_id);
    }

    async remove(user: AuthUser, id: string) {
        const qrCode = await this.prisma.qrCode.findUnique({ where: { id } });
        if (!qrCode) throw new NotFoundException('QR code not found');

        await this.accessControl.assertStoreAccess(user, qrCode.store_id, MANAGE_ROLES);

        await this.prisma.qrCode.delete({ where: { id } });
        return { success: true };
    }

    async stats(user: AuthUser, id: string) {
        const qrCode = await this.prisma.qrCode.findUnique({ where: { id } });
        if (!qrCode) throw new NotFoundException('QR code not found');

        await this.accessControl.assertStoreAccess(user, qrCode.store_id);

        const [tipsCount, tipsAggregate, reviewsCount] = await Promise.all([
            this.prisma.tip.count({ where: { qr_code_id: id } }),
            this.prisma.tip.aggregate({
                where: { qr_code_id: id, status: TipStatus.COMPLETED },
                _sum: { amount: true },
            }),
            this.prisma.review.count({ where: { tip: { qr_code_id: id } } }),
        ]);

        return {
            tips_count: tipsCount,
            tips_total_amount: tipsAggregate._sum.amount ?? 0,
            reviews_count: reviewsCount,
        };
    }

    async findPersonalForEmployee(user: AuthUser, employeeId: string) {
        const { employee } = await this.accessControl.assertEmployeeSelfOrStoreAccess(user, employeeId);

        const [fullEmployee, qrCodes] = await Promise.all([
            this.prisma.employee.findUnique({
                where: { id: employeeId },
                include: {
                    photo_document: true,
                    store: { select: { name: true, slug: true, primary_language: true } },
                },
            }),
            this.prisma.qrCode.findMany({
                where: {
                    store_id: employee.store_id,
                    is_active: true,
                    employees: { some: { employee_id: employeeId } },
                },
                orderBy: { created_at: 'desc' },
            }),
        ]);

        const primaryLanguage: Language = fullEmployee?.store.primary_language ?? Language.EN;

        return {
            employee: {
                id: employee.id,
                full_name: resolveTranslatedText(fullEmployee!.full_name as TranslatedText, undefined, primaryLanguage),
                position: fullEmployee!.position,
                photo_url: fullEmployee!.photo_document?.url ?? null,
            },
            store: {
                name: fullEmployee!.store.name,
                slug: fullEmployee!.store.slug,
            },
            qr_codes: qrCodes.map((qrCode) => ({ id: qrCode.id, code: qrCode.code, label: qrCode.label })),
        };
    }

    async findPublicByCode(code: string, lang?: string) {
        const qrCode = await this.prisma.qrCode.findUnique({
            where: { code },
            include: {
                store: { include: { logo_document: true } },
                employees: { include: { employee: { include: { photo_document: true } } } },
                spots: { include: { spot: true } },
            },
        });

        if (!qrCode) {
            throw new NotFoundException('QR code not found');
        }
        if (!qrCode.is_active) {
            throw new BadRequestException('This QR code is no longer active');
        }
        if (!qrCode.store.is_active) {
            throw new BadRequestException('This store is no longer active');
        }

        const activeEmployees = qrCode.employees
            .map((qrCodeEmployee) => qrCodeEmployee.employee)
            .filter((employee) => employee.is_active);

        return {
            qr_code: {
                id: qrCode.id,
                label: qrCode.label,
                selection_mode: qrCode.selection_mode,
            },
            store: {
                id: qrCode.store.id,
                name: qrCode.store.name,
                slug: qrCode.store.slug,
                currency: qrCode.store.currency,
                suggested_tip_amounts: qrCode.store.suggested_tip_amounts,
                allow_custom_tip_amount: qrCode.store.allow_custom_tip_amount,
                primary_color: qrCode.store.primary_color,
                secondary_color: qrCode.store.secondary_color,
                logo_url: qrCode.store.logo_document?.url ?? null,
            },
            spots: qrCode.spots.map((qrCodeSpot) => ({ id: qrCodeSpot.spot.id, name: qrCodeSpot.spot.name })),
            employees: activeEmployees.map((employee) => ({
                id: employee.id,
                full_name: resolveTranslatedText(employee.full_name as TranslatedText, lang, qrCode.store.primary_language),
                position: employee.position,
                photo_url: employee.photo_document?.url ?? null,
            })),
        };
    }
}
