import { AuthRole, SubscriptionPlan } from 'generated/prisma';
import { SubscriptionsController } from './subscriptions.controller';

describe('SubscriptionsController', () => {
    let controller: SubscriptionsController;
    let service: any;

    const user = { id: 'u1', role: AuthRole.USER };

    beforeEach(() => {
        service = { findOne: jest.fn(), changePlan: jest.fn(), cancel: jest.fn() };
        controller = new SubscriptionsController(service);
    });

    it('findOne() delegates to the service with the current user and organizationId param', () => {
        service.findOne.mockReturnValue('subscription');

        expect(controller.findOne(user, 'org1')).toBe('subscription');
        expect(service.findOne).toHaveBeenCalledWith(user, 'org1');
    });

    it('changePlan() delegates to the service with the body', () => {
        const dto = { plan: SubscriptionPlan.PROFESSIONAL };
        service.changePlan.mockReturnValue('changed');

        expect(controller.changePlan(user, 'org1', dto)).toBe('changed');
        expect(service.changePlan).toHaveBeenCalledWith(user, 'org1', dto);
    });

    it('cancel() delegates to the service', () => {
        service.cancel.mockReturnValue('canceled');

        expect(controller.cancel(user, 'org1')).toBe('canceled');
        expect(service.cancel).toHaveBeenCalledWith(user, 'org1');
    });
});
