import { BadGatewayException, BadRequestException, NotFoundException } from '@nestjs/common';
import { AuthRole, OrganizationRole, PayoutStatus, RefundStatus, TipStatus } from 'generated/prisma';
import { RefundsService } from './refunds.service';

describe('RefundsService', () => {
    let service: RefundsService;
    let prisma: any;
    let accessControl: any;
    let usersService: any;
    let vivaTransactions: any;

    const user = { id: 'u1', role: AuthRole.USER };

    const paidTip = (overrides: Partial<any> = {}) => ({
        store_id: 'store1',
        payment_transaction: { provider_transaction_id: 'vt1', confirmed_at: new Date() },
        distributions: [],
        created_at: new Date(),
        ...overrides,
    });

    beforeEach(() => {
        prisma = {
            tip: { findUnique: jest.fn(), update: jest.fn() },
            refund: { create: jest.fn(), findMany: jest.fn(), count: jest.fn(), findUnique: jest.fn(), update: jest.fn() },
            tipDistribution: { updateMany: jest.fn() },
            $transaction: jest.fn((fn) => fn(prisma)),
        };
        accessControl = { assertStoreAccess: jest.fn() };
        usersService = { findOrCreateByEmail: jest.fn() };
        vivaTransactions = {
            createFastRefund: jest.fn().mockResolvedValue({ transactionId: 'refund-tx-1' }),
            createRebate: jest.fn().mockResolvedValue({ transactionId: 'refund-tx-1' }),
        };
        service = new RefundsService(prisma, accessControl, usersService, vivaTransactions);
    });

    describe('createPublicRequest', () => {
        it('throws NotFoundException when the tip does not exist', async () => {
            prisma.tip.findUnique.mockResolvedValue(null);

            await expect(service.createPublicRequest('missing', {})).rejects.toThrow(NotFoundException);
        });

        it('resolves the requester via email when provided', async () => {
            prisma.tip.findUnique.mockResolvedValue({ id: 'tip1', amount: 1000, customer_user_id: null });
            usersService.findOrCreateByEmail.mockResolvedValue({ id: 'user1' });
            prisma.refund.create.mockResolvedValue({ id: 'refund1' });

            await service.createPublicRequest('tip1', { customer_email: 'a@b.com' } as any);

            expect(usersService.findOrCreateByEmail).toHaveBeenCalledWith('a@b.com');
            expect(prisma.refund.create).toHaveBeenCalledWith({
                data: { tip_id: 'tip1', amount: 1000, reason: undefined, requested_by_user_id: 'user1' },
            });
        });

        it('falls back to the tip\'s existing customer_user_id when no email is provided', async () => {
            prisma.tip.findUnique.mockResolvedValue({ id: 'tip1', amount: 1000, customer_user_id: 'existing-user' });
            prisma.refund.create.mockResolvedValue({ id: 'refund1' });

            await service.createPublicRequest('tip1', {} as any);

            expect(usersService.findOrCreateByEmail).not.toHaveBeenCalled();
            expect(prisma.refund.create).toHaveBeenCalledWith({
                data: { tip_id: 'tip1', amount: 1000, reason: undefined, requested_by_user_id: 'existing-user' },
            });
        });

        it('defaults the refund amount to the full tip amount when omitted', async () => {
            prisma.tip.findUnique.mockResolvedValue({ id: 'tip1', amount: 2500, customer_user_id: null });
            prisma.refund.create.mockResolvedValue({ id: 'refund1' });

            await service.createPublicRequest('tip1', { reason: 'too much' } as any);

            expect(prisma.refund.create).toHaveBeenCalledWith({
                data: { tip_id: 'tip1', amount: 2500, reason: 'too much', requested_by_user_id: undefined },
            });
        });

        it('uses the DTO amount when provided', async () => {
            prisma.tip.findUnique.mockResolvedValue({ id: 'tip1', amount: 2500, customer_user_id: null });
            prisma.refund.create.mockResolvedValue({ id: 'refund1' });

            await service.createPublicRequest('tip1', { amount: 1000 } as any);

            expect(prisma.refund.create).toHaveBeenCalledWith(
                expect.objectContaining({ data: expect.objectContaining({ amount: 1000 }) }),
            );
        });
    });

    describe('create', () => {
        const dto = { tip_id: 'tip1' } as any;

        it('throws NotFoundException when the tip does not exist', async () => {
            prisma.tip.findUnique.mockResolvedValue(null);

            await expect(service.create(user, dto)).rejects.toThrow(NotFoundException);
        });

        it('asserts store access with OWNER/STORE_MANAGER/ACCOUNTANT roles', async () => {
            prisma.tip.findUnique.mockResolvedValue({ id: 'tip1', store_id: 'store1', amount: 1000 });
            prisma.refund.create.mockResolvedValue({ id: 'refund1' });

            await service.create(user, dto);

            expect(accessControl.assertStoreAccess).toHaveBeenCalledWith(user, 'store1', [
                OrganizationRole.OWNER,
                OrganizationRole.STORE_MANAGER,
                OrganizationRole.ACCOUNTANT,
            ]);
        });

        it('creates the refund attributed to the acting user', async () => {
            prisma.tip.findUnique.mockResolvedValue({ id: 'tip1', store_id: 'store1', amount: 1000 });
            prisma.refund.create.mockResolvedValue({ id: 'refund1' });

            await service.create(user, { tip_id: 'tip1', amount: 400, reason: 'partial' } as any);

            expect(prisma.refund.create).toHaveBeenCalledWith({
                data: { tip_id: 'tip1', amount: 400, reason: 'partial', requested_by_user_id: 'u1' },
            });
        });
    });

    describe('findAll', () => {
        beforeEach(() => {
            prisma.refund.findMany.mockResolvedValue([]);
            prisma.refund.count.mockResolvedValue(0);
        });

        it('asserts store access with the manage roles', async () => {
            await service.findAll(user, 'store1', { page: 1, limit: 20 } as any);

            expect(accessControl.assertStoreAccess).toHaveBeenCalledWith(user, 'store1', [
                OrganizationRole.OWNER,
                OrganizationRole.STORE_MANAGER,
                OrganizationRole.ACCOUNTANT,
            ]);
        });

        it('scopes the query to the store via the tip relation and applies the status filter', async () => {
            await service.findAll(user, 'store1', { page: 1, limit: 20, status: RefundStatus.PENDING } as any);

            expect(prisma.refund.findMany).toHaveBeenCalledWith(
                expect.objectContaining({ where: { tip: { store_id: 'store1' }, status: RefundStatus.PENDING } }),
            );
        });

        it('paginates the results', async () => {
            prisma.refund.findMany.mockResolvedValue([{ id: 'r1' }]);
            prisma.refund.count.mockResolvedValue(1);

            const result = await service.findAll(user, 'store1', { page: 1, limit: 20 } as any);

            expect(result).toEqual({
                data: [{ id: 'r1' }],
                pagination: { total: 1, page: 1, limit: 20, total_pages: 1, has_next: false, has_prev: false },
            });
        });
    });

    describe('findOne', () => {
        it('throws NotFoundException when the refund does not exist', async () => {
            prisma.refund.findUnique.mockResolvedValue(null);

            await expect(service.findOne(user, 'missing')).rejects.toThrow(NotFoundException);
        });

        it('asserts store access via the refund\'s tip store_id and returns the refund', async () => {
            const refund = { id: 'refund1', tip: { store_id: 'store1' } };
            prisma.refund.findUnique.mockResolvedValue(refund);

            const result = await service.findOne(user, 'refund1');

            expect(accessControl.assertStoreAccess).toHaveBeenCalledWith(user, 'store1', [
                OrganizationRole.OWNER,
                OrganizationRole.STORE_MANAGER,
                OrganizationRole.ACCOUNTANT,
            ]);
            expect(result).toBe(refund);
        });
    });

    describe('update', () => {
        it('throws NotFoundException when the refund does not exist', async () => {
            prisma.refund.findUnique.mockResolvedValue(null);

            await expect(service.update(user, 'missing', { status: RefundStatus.APPROVED })).rejects.toThrow(
                NotFoundException,
            );
        });

        it('throws BadRequestException when the refund is already COMPLETED', async () => {
            prisma.refund.findUnique.mockResolvedValue({
                id: 'refund1',
                status: RefundStatus.COMPLETED,
                tip_id: 'tip1',
                tip: { store_id: 'store1' },
            });

            await expect(service.update(user, 'refund1', { status: RefundStatus.APPROVED })).rejects.toThrow(
                BadRequestException,
            );
        });

        it('throws BadRequestException when the refund is already REJECTED', async () => {
            prisma.refund.findUnique.mockResolvedValue({
                id: 'refund1',
                status: RefundStatus.REJECTED,
                tip_id: 'tip1',
                tip: { store_id: 'store1' },
            });

            await expect(service.update(user, 'refund1', { status: RefundStatus.APPROVED })).rejects.toThrow(
                BadRequestException,
            );
        });

        it('calls Viva\'s fast-refund endpoint and flips the tip to REFUNDED when the refund becomes COMPLETED same-day', async () => {
            prisma.refund.findUnique.mockResolvedValue({
                id: 'refund1',
                amount: 500,
                status: RefundStatus.APPROVED,
                tip_id: 'tip1',
                tip: paidTip(),
            });
            prisma.refund.update.mockResolvedValue({ id: 'refund1', status: RefundStatus.COMPLETED });

            await service.update(user, 'refund1', { status: RefundStatus.COMPLETED });

            expect(vivaTransactions.createFastRefund).toHaveBeenCalledWith('vt1', { amount: 500, merchantTrns: 'refund1' });
            expect(prisma.$transaction).toHaveBeenCalledTimes(1);
            expect(prisma.refund.update).toHaveBeenCalledWith({
                where: { id: 'refund1' },
                data: {
                    status: RefundStatus.COMPLETED,
                    processed_by_user_id: 'u1',
                    provider_reference: 'refund-tx-1',
                    provider_status: 'REQUESTED',
                    requires_manual_reconciliation: false,
                },
            });
            expect(prisma.tip.update).toHaveBeenCalledWith({
                where: { id: 'tip1' },
                data: { status: TipStatus.REFUNDED },
            });
        });

        it('uses the rebate endpoint instead of fast-refund when the payment was confirmed on a previous day', async () => {
            const yesterday = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
            prisma.refund.findUnique.mockResolvedValue({
                id: 'refund1',
                amount: 500,
                status: RefundStatus.APPROVED,
                tip_id: 'tip1',
                tip: paidTip({ payment_transaction: { provider_transaction_id: 'vt1', confirmed_at: yesterday } }),
            });
            prisma.refund.update.mockResolvedValue({ id: 'refund1', status: RefundStatus.COMPLETED });

            await service.update(user, 'refund1', { status: RefundStatus.COMPLETED });

            expect(vivaTransactions.createRebate).toHaveBeenCalledWith('vt1', { amount: 500, merchantTrns: 'refund1' });
            expect(vivaTransactions.createFastRefund).not.toHaveBeenCalled();
        });

        it('throws BadRequestException when the tip has no confirmed payment to refund', async () => {
            prisma.refund.findUnique.mockResolvedValue({
                id: 'refund1',
                amount: 500,
                status: RefundStatus.APPROVED,
                tip_id: 'tip1',
                tip: paidTip({ payment_transaction: null }),
            });

            await expect(service.update(user, 'refund1', { status: RefundStatus.COMPLETED })).rejects.toThrow(BadRequestException);
            expect(prisma.refund.update).not.toHaveBeenCalled();
        });

        it('wraps a Viva refund failure in BadGatewayException and never finalizes locally', async () => {
            prisma.refund.findUnique.mockResolvedValue({
                id: 'refund1',
                amount: 500,
                status: RefundStatus.APPROVED,
                tip_id: 'tip1',
                tip: paidTip(),
            });
            vivaTransactions.createFastRefund.mockRejectedValue(new Error('Viva rejected the refund'));

            await expect(service.update(user, 'refund1', { status: RefundStatus.COMPLETED })).rejects.toThrow(BadGatewayException);
            expect(prisma.refund.update).not.toHaveBeenCalled();
        });

        it('flags the refund for manual reconciliation when a distribution was already paid out', async () => {
            prisma.refund.findUnique.mockResolvedValue({
                id: 'refund1',
                amount: 500,
                status: RefundStatus.APPROVED,
                tip_id: 'tip1',
                tip: paidTip({ distributions: [{ payout_status: PayoutStatus.PAID }] }),
            });
            prisma.refund.update.mockResolvedValue({ id: 'refund1', status: RefundStatus.COMPLETED });

            await service.update(user, 'refund1', { status: RefundStatus.COMPLETED });

            expect(prisma.refund.update).toHaveBeenCalledWith(
                expect.objectContaining({ data: expect.objectContaining({ requires_manual_reconciliation: true }) }),
            );
        });

        it('cancels the tip\'s still-pending distributions when the refund becomes COMPLETED', async () => {
            prisma.refund.findUnique.mockResolvedValue({
                id: 'refund1',
                amount: 500,
                status: RefundStatus.APPROVED,
                tip_id: 'tip1',
                tip: paidTip(),
            });
            prisma.refund.update.mockResolvedValue({ id: 'refund1', status: RefundStatus.COMPLETED });

            await service.update(user, 'refund1', { status: RefundStatus.COMPLETED });

            expect(prisma.tipDistribution.updateMany).toHaveBeenCalledWith({
                where: { tip_id: 'tip1', payout_status: PayoutStatus.PENDING },
                data: { payout_status: PayoutStatus.CANCELLED },
            });
        });

        it('does not touch the tip or its distributions when transitioning to a non-COMPLETED status', async () => {
            prisma.refund.findUnique.mockResolvedValue({
                id: 'refund1',
                status: RefundStatus.PENDING,
                tip_id: 'tip1',
                tip: { store_id: 'store1' },
            });
            prisma.refund.update.mockResolvedValue({ id: 'refund1', status: RefundStatus.APPROVED });

            await service.update(user, 'refund1', { status: RefundStatus.APPROVED });

            expect(prisma.tip.update).not.toHaveBeenCalled();
            expect(prisma.tipDistribution.updateMany).not.toHaveBeenCalled();
        });

        it('asserts store access with the manage roles before updating', async () => {
            prisma.refund.findUnique.mockResolvedValue({
                id: 'refund1',
                status: RefundStatus.PENDING,
                tip_id: 'tip1',
                tip: { store_id: 'store1' },
            });
            prisma.refund.update.mockResolvedValue({ id: 'refund1' });

            await service.update(user, 'refund1', { status: RefundStatus.APPROVED });

            expect(accessControl.assertStoreAccess).toHaveBeenCalledWith(user, 'store1', [
                OrganizationRole.OWNER,
                OrganizationRole.STORE_MANAGER,
                OrganizationRole.ACCOUNTANT,
            ]);
        });
    });
});
