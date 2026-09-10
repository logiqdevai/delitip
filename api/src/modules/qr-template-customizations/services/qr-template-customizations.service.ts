import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, OrganizationRole } from 'generated/prisma';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { AccessControlService, AuthUser } from '@/shared/services/access-control/access-control.service';
import { QR_TEMPLATE_IDS } from '../constants/qr-template-ids.constant';
import type { UpsertQrTemplateCustomizationType } from '../dto/qr-template-elements.schema';

@Injectable()
export class QrTemplateCustomizationsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly accessControl: AccessControlService,
    ) { }

    async findOne(user: AuthUser, storeId: string, templateId: string) {
        await this.accessControl.assertStoreAccess(user, storeId);
        this.assertValidTemplateId(templateId);

        return this.prisma.qrTemplateCustomization.findFirst({
            where: { store_id: storeId, template_id: templateId },
        });
    }

    async upsert(user: AuthUser, storeId: string, templateId: string, payload: UpsertQrTemplateCustomizationType) {
        await this.accessControl.assertStoreAccess(user, storeId, [
            OrganizationRole.OWNER,
            OrganizationRole.STORE_MANAGER,
        ]);
        this.assertValidTemplateId(templateId);

        const canvas = payload.canvas as unknown as Prisma.InputJsonValue;
        const elements = payload.elements as unknown as Prisma.InputJsonValue;

        const existing = await this.prisma.qrTemplateCustomization.findFirst({
            where: { store_id: storeId, template_id: templateId },
        });

        if (existing) {
            return this.prisma.qrTemplateCustomization.update({
                where: { id: existing.id },
                data: { canvas, elements },
            });
        }

        return this.prisma.qrTemplateCustomization.create({
            data: { store_id: storeId, template_id: templateId, canvas, elements },
        });
    }

    async remove(user: AuthUser, storeId: string, templateId: string) {
        await this.accessControl.assertStoreAccess(user, storeId, [
            OrganizationRole.OWNER,
            OrganizationRole.STORE_MANAGER,
        ]);
        this.assertValidTemplateId(templateId);

        const existing = await this.prisma.qrTemplateCustomization.findFirst({
            where: { store_id: storeId, template_id: templateId },
        });
        if (!existing) return null;

        return this.prisma.qrTemplateCustomization.delete({ where: { id: existing.id } });
    }

    private assertValidTemplateId(templateId: string): void {
        if (!(QR_TEMPLATE_IDS as readonly string[]).includes(templateId)) {
            throw new BadRequestException(`Invalid template id: ${templateId}`);
        }
    }
}
