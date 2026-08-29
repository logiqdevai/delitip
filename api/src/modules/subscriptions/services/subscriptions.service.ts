import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { AccessControlService, AuthUser } from '@/shared/services/access-control/access-control.service';
import { UpdateSubscriptionDto } from '../dto/update-subscription.dto';
import { OrganizationRole, SubscriptionStatus } from 'generated/prisma';

const BILLING_PERIOD_DAYS = 30;

// No real billing provider is wired up (no Stripe, no live subscriptions) —
// plan changes take effect immediately and for free, purely to model the
// Organization's current tier (§32).
@Injectable()
export class SubscriptionsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly accessControl: AccessControlService,
    ) { }

    async findOne(user: AuthUser, organizationId: string) {
        await this.accessControl.assertOrgAccess(user, organizationId);

        const subscription = await this.prisma.subscription.findUnique({
            where: { organization_id: organizationId },
        });
        if (!subscription) throw new NotFoundException('Subscription not found');
        return subscription;
    }

    async changePlan(user: AuthUser, organizationId: string, dto: UpdateSubscriptionDto) {
        await this.accessControl.assertOrgAccess(user, organizationId, [OrganizationRole.OWNER]);

        const now = new Date();
        const periodEnd = new Date(now.getTime() + BILLING_PERIOD_DAYS * 24 * 60 * 60 * 1000);

        return this.prisma.subscription.update({
            where: { organization_id: organizationId },
            data: {
                plan: dto.plan,
                status: SubscriptionStatus.ACTIVE,
                current_period_start: now,
                current_period_end: periodEnd,
            },
        });
    }

    async cancel(user: AuthUser, organizationId: string) {
        await this.accessControl.assertOrgAccess(user, organizationId, [OrganizationRole.OWNER]);

        return this.prisma.subscription.update({
            where: { organization_id: organizationId },
            data: { status: SubscriptionStatus.CANCELED },
        });
    }
}
