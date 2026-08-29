import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { AccessControlService, AuthUser } from '@/shared/services/access-control/access-control.service';
import { AlertType, OrganizationRole } from 'generated/prisma';

@Injectable()
export class AlertPreferencesService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly accessControl: AccessControlService,
    ) { }

    async findAll(user: AuthUser, storeId: string) {
        await this.accessControl.assertStoreAccess(user, storeId);

        const preferences = await this.prisma.alertPreference.findMany({ where: { store_id: storeId } });
        const isEnabledByType = new Map(preferences.map((p) => [p.alert_type, p.is_enabled]));

        // Every AlertType is returned even without a stored row — a missing row
        // means the default (enabled) applies, not that the type is unavailable.
        return Object.values(AlertType).map((alert_type) => ({
            alert_type,
            is_enabled: isEnabledByType.has(alert_type) ? isEnabledByType.get(alert_type) : true,
        }));
    }

    async update(user: AuthUser, storeId: string, alertType: string, isEnabled: boolean) {
        await this.accessControl.assertStoreAccess(user, storeId, [
            OrganizationRole.OWNER,
            OrganizationRole.STORE_MANAGER,
        ]);

        if (!Object.values(AlertType).includes(alertType as AlertType)) {
            throw new BadRequestException(`Invalid alert type: ${alertType}`);
        }

        const existing = await this.prisma.alertPreference.findFirst({
            where: { store_id: storeId, alert_type: alertType as AlertType },
        });

        if (existing) {
            return this.prisma.alertPreference.update({
                where: { id: existing.id },
                data: { is_enabled: isEnabled },
            });
        }

        return this.prisma.alertPreference.create({
            data: { store_id: storeId, alert_type: alertType as AlertType, is_enabled: isEnabled },
        });
    }
}
