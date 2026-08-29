import { NotFoundException } from '@nestjs/common';
import { AuthRole, OrganizationRole, SubscriptionPlan, SubscriptionStatus } from 'generated/prisma';
import { SubscriptionsService } from './subscriptions.service';

// No real billing provider is wired up here — plan changes take effect
// immediately and for free (§32). Don't assume real Stripe billing calls.
describe('SubscriptionsService', () => {
    let service: SubscriptionsService;
    let prisma: any;
    let accessControl: any;

    const user = { id: 'u1', role: AuthRole.USER };

    beforeEach(() => {
        jest.useFakeTimers().setSystemTime(new Date('2026-01-01T00:00:00.000Z'));
        prisma = { subscription: { findUnique: jest.fn(), update: jest.fn() } };
        accessControl = { assertOrgAccess: jest.fn() };
        service = new SubscriptionsService(prisma, accessControl);
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    describe('findOne', () => {
        it('checks org access (any role)', async () => {
            prisma.subscription.findUnique.mockResolvedValue({ id: 'sub1' });

            await service.findOne(user, 'org1');

            expect(accessControl.assertOrgAccess).toHaveBeenCalledWith(user, 'org1');
        });

        it('throws NotFoundException when there is no subscription for the org', async () => {
            prisma.subscription.findUnique.mockResolvedValue(null);

            await expect(service.findOne(user, 'org1')).rejects.toThrow(NotFoundException);
        });

        it('returns the subscription when found', async () => {
            const subscription = { id: 'sub1' };
            prisma.subscription.findUnique.mockResolvedValue(subscription);

            await expect(service.findOne(user, 'org1')).resolves.toBe(subscription);
        });
    });

    describe('changePlan', () => {
        it('requires OWNER-level org access', async () => {
            prisma.subscription.update.mockResolvedValue({});

            await service.changePlan(user, 'org1', { plan: SubscriptionPlan.PROFESSIONAL });

            expect(accessControl.assertOrgAccess).toHaveBeenCalledWith(user, 'org1', [OrganizationRole.OWNER]);
        });

        it('activates the subscription with a 30-day billing period starting now', async () => {
            prisma.subscription.update.mockResolvedValue({});

            await service.changePlan(user, 'org1', { plan: SubscriptionPlan.ENTERPRISE });

            const now = new Date('2026-01-01T00:00:00.000Z');
            const expectedPeriodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

            expect(prisma.subscription.update).toHaveBeenCalledWith({
                where: { organization_id: 'org1' },
                data: {
                    plan: SubscriptionPlan.ENTERPRISE,
                    status: SubscriptionStatus.ACTIVE,
                    current_period_start: now,
                    current_period_end: expectedPeriodEnd,
                },
            });
        });

        it('returns the updated subscription', async () => {
            const updated = { id: 'sub1', plan: SubscriptionPlan.STARTER };
            prisma.subscription.update.mockResolvedValue(updated);

            await expect(service.changePlan(user, 'org1', { plan: SubscriptionPlan.STARTER })).resolves.toBe(updated);
        });
    });

    describe('cancel', () => {
        it('requires OWNER-level org access', async () => {
            prisma.subscription.update.mockResolvedValue({});

            await service.cancel(user, 'org1');

            expect(accessControl.assertOrgAccess).toHaveBeenCalledWith(user, 'org1', [OrganizationRole.OWNER]);
        });

        it('sets the subscription status to CANCELED', async () => {
            prisma.subscription.update.mockResolvedValue({});

            await service.cancel(user, 'org1');

            expect(prisma.subscription.update).toHaveBeenCalledWith({
                where: { organization_id: 'org1' },
                data: { status: SubscriptionStatus.CANCELED },
            });
        });
    });
});
