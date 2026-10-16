import { BadRequestException, ConflictException, ForbiddenException } from '@nestjs/common';
import {
    DistributionPayoutMode,
    DistributionRecipientType,
    OrganizationRole,
    PayoutExecutionStatus,
    PayoutRequestStatus,
    PayoutStatus,
    TipStatus,
} from 'generated/prisma';
import { PayoutRequestsService } from './payout-requests.service';

const owner = { id: 'owner1', role: 'USER' };
const admin = { id: 'admin1', role: 'ADMIN' };

const flushAsync = () => new Promise((resolve) => setImmediate(resolve));

describe('PayoutRequestsService', () => {
    let service: PayoutRequestsService;
    let prisma: any;
    let accessControl: any;
    let platformFinanceConfig: any;
    let vivaConfig: any;
    let gcsService: any;
    let payoutsService: any;
    let invoiceVerification: any;
    let notifications: any;

    const distribution = (overrides: Partial<any> = {}) => ({
        id: 'dist1',
        recipient_type: DistributionRecipientType.STORE,
        employee_id: null,
        payout_mode: DistributionPayoutMode.DIRECT,
        payout_status: PayoutStatus.PENDING,
        payout_id: null,
        amount: 500,
        tip: { status: TipStatus.COMPLETED, paid_at: new Date('2026-10-01T10:00:00Z'), currency: 'EUR' },
        ...overrides,
    });

    const invoiceDocument = (overrides: Partial<any> = {}) => ({
        id: 'doc1',
        user_uuid: 'owner1',
        mimetype: 'application/pdf',
        size: 1024,
        filename: 'documents/123-invoice.pdf',
        ...overrides,
    });

    const pendingRequest = (overrides: Partial<any> = {}) => ({
        id: 'req1',
        store_id: 'store1',
        status: PayoutRequestStatus.PENDING_REVIEW,
        amount: 500,
        own_share_amount: 500,
        held_for_staff_amount: 0,
        currency: 'EUR',
        distributions: [distribution()],
        ...overrides,
    });

    beforeEach(() => {
        prisma = {
            tipDistribution: {
                findMany: jest.fn().mockResolvedValue([]),
                findFirst: jest.fn().mockResolvedValue(null),
                updateMany: jest.fn().mockResolvedValue({ count: 1 }),
                aggregate: jest.fn().mockResolvedValue({ _sum: { amount: 0 } }),
            },
            payoutRequest: {
                findFirst: jest.fn().mockResolvedValue(null),
                findUnique: jest.fn(),
                findUniqueOrThrow: jest.fn(),
                create: jest.fn(),
                update: jest.fn(),
                findMany: jest.fn().mockResolvedValue([]),
                count: jest.fn().mockResolvedValue(0),
            },
            payoutAccount: { findUnique: jest.fn().mockResolvedValue(null) },
            document: { findUnique: jest.fn().mockResolvedValue(invoiceDocument()) },
            $transaction: jest.fn((fn) => fn(prisma)),
        };
        accessControl = { assertStoreAccess: jest.fn() };
        platformFinanceConfig = {
            getPayoutHoldWindowHours: jest.fn().mockResolvedValue(48),
            isPayoutInvoiceRequired: jest.fn().mockResolvedValue(true),
            getPlatformInvoiceDetails: jest.fn().mockResolvedValue({
                legal_name: 'Delitip P.C.',
                vat_number: 'EL987654321',
                tax_office: null,
                address: null,
                instructions: 'Email the PDF too',
            }),
        };
        vivaConfig = { getWalletId: jest.fn().mockReturnValue(999) };
        gcsService = { getSignedUrl: jest.fn().mockResolvedValue('https://signed') };
        payoutsService = {
            resolvePayoutAccount: jest.fn().mockResolvedValue({
                payoutAccount: { id: 'pa1', payout_method: 'IBAN', bank_account_id: 'bank1', connected_account_id: null },
            }),
            claimGroup: jest.fn().mockResolvedValue({ id: 'payout1', amount: 500 }),
            executeTransfer: jest.fn().mockResolvedValue({ id: 'payout1', status: PayoutExecutionStatus.PROCESSING }),
        };
        invoiceVerification = { verify: jest.fn().mockResolvedValue(undefined) };
        notifications = {
            notifyAdminsSubmitted: jest.fn().mockResolvedValue(undefined),
            notifyStoreReviewed: jest.fn().mockResolvedValue(undefined),
        };

        service = new PayoutRequestsService(
            prisma,
            accessControl,
            platformFinanceConfig,
            vivaConfig,
            gcsService,
            payoutsService,
            invoiceVerification,
            notifications,
        );
    });

    describe('preview', () => {
        it('reports the store group amount, period and who to invoice', async () => {
            prisma.tipDistribution.findMany.mockResolvedValue([
                distribution({ id: 'a', amount: 300, tip: { status: TipStatus.COMPLETED, paid_at: new Date('2026-10-01T10:00:00Z'), currency: 'EUR' } }),
                distribution({
                    id: 'b',
                    amount: 200,
                    recipient_type: DistributionRecipientType.EMPLOYEE,
                    employee_id: 'emp1',
                    payout_mode: DistributionPayoutMode.VIA_STORE,
                    tip: { status: TipStatus.COMPLETED, paid_at: new Date('2026-10-05T10:00:00Z'), currency: 'EUR' },
                }),
                // DIRECT employee share — not the Store's money, excluded.
                distribution({
                    id: 'c',
                    amount: 999,
                    recipient_type: DistributionRecipientType.EMPLOYEE,
                    employee_id: 'emp2',
                    payout_mode: DistributionPayoutMode.DIRECT,
                }),
            ]);
            prisma.tipDistribution.aggregate.mockResolvedValue({ _sum: { amount: 4200 } });

            const result = await service.preview(owner, 'store1');

            expect(result).toEqual(
                expect.objectContaining({
                    policy_required: true,
                    amount: 500,
                    own_share_amount: 300,
                    held_for_staff_amount: 200,
                    distribution_count: 2,
                    period_from: new Date('2026-10-01T10:00:00Z'),
                    period_to: new Date('2026-10-05T10:00:00Z'),
                    already_paid_total_amount: 4200,
                    invoice_to: expect.objectContaining({ legal_name: 'Delitip P.C.', vat_number: 'EL987654321' }),
                    instructions: 'Email the PDF too',
                }),
            );
        });
    });

    describe('create', () => {
        beforeEach(() => {
            prisma.tipDistribution.findMany.mockResolvedValue([distribution()]);
            prisma.payoutRequest.create.mockResolvedValue({ id: 'req1' });
            prisma.payoutRequest.findUniqueOrThrow.mockResolvedValue(pendingRequest());
        });

        it('requires OWNER access and the gate to be on', async () => {
            platformFinanceConfig.isPayoutInvoiceRequired.mockResolvedValue(false);

            await expect(service.create(owner, 'store1', { invoice_document_id: 'doc1' })).rejects.toThrow(BadRequestException);
            expect(accessControl.assertStoreAccess).toHaveBeenCalledWith(owner, 'store1', [OrganizationRole.OWNER]);
        });

        it('refuses a second open request for the same store', async () => {
            prisma.payoutRequest.findFirst.mockResolvedValue({ id: 'open' });

            await expect(service.create(owner, 'store1', { invoice_document_id: 'doc1' })).rejects.toThrow(ConflictException);
        });

        it('rejects an invoice uploaded by someone else or of the wrong type', async () => {
            prisma.document.findUnique.mockResolvedValue(invoiceDocument({ user_uuid: 'other' }));
            await expect(service.create(owner, 'store1', { invoice_document_id: 'doc1' })).rejects.toThrow(ForbiddenException);

            prisma.document.findUnique.mockResolvedValue(invoiceDocument({ mimetype: 'text/plain' }));
            await expect(service.create(owner, 'store1', { invoice_document_id: 'doc1' })).rejects.toThrow(BadRequestException);
        });

        it('snapshots the store group and locks exactly those distributions, then kicks off the invoice check', async () => {
            const result = await service.create(owner, 'store1', { invoice_document_id: 'doc1', invoice_number: ' A-1 ' });

            expect(prisma.payoutRequest.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        store_id: 'store1',
                        requested_by_user_id: 'owner1',
                        amount: 500,
                        distribution_count: 1,
                        invoice_document_id: 'doc1',
                        invoice_number: 'A-1',
                    }),
                }),
            );
            expect(prisma.tipDistribution.updateMany).toHaveBeenCalledWith({
                where: { id: { in: ['dist1'] }, payout_id: null, payout_request_id: null, payout_status: PayoutStatus.PENDING },
                data: { payout_request_id: 'req1' },
            });
            expect(result.id).toBe('req1');

            await flushAsync();
            expect(invoiceVerification.verify).toHaveBeenCalledWith('req1');
            expect(notifications.notifyAdminsSubmitted).toHaveBeenCalledWith('req1');
        });

        it('fails with a conflict when every distribution was claimed by someone else in the meantime', async () => {
            prisma.tipDistribution.updateMany.mockResolvedValue({ count: 0 });

            await expect(service.create(owner, 'store1', { invoice_document_id: 'doc1' })).rejects.toThrow(ConflictException);
        });
    });

    describe('approve', () => {
        beforeEach(() => {
            prisma.payoutRequest.findUnique.mockResolvedValue(pendingRequest());
            prisma.payoutRequest.update.mockImplementation(async ({ data }: any) => pendingRequest({ ...data }));
        });

        it('claims the locked rows for this request, executes the transfer and marks the request APPROVED', async () => {
            const result = await service.approve(admin, 'req1', { admin_note: 'ok' });

            expect(payoutsService.claimGroup).toHaveBeenCalledWith(
                expect.objectContaining({ key: 'STORE', distributionIds: ['dist1'], amount: 500 }),
                'pa1',
                999,
                'req1',
            );
            expect(payoutsService.executeTransfer).toHaveBeenCalled();
            expect(prisma.payoutRequest.update).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        status: PayoutRequestStatus.APPROVED,
                        payout_id: 'payout1',
                        reviewed_by_user_id: 'admin1',
                        admin_note: 'ok',
                        failure_reason: null,
                    }),
                }),
            );
            expect(result.status).toBe(PayoutRequestStatus.APPROVED);

            await flushAsync();
            expect(notifications.notifyStoreReviewed).toHaveBeenCalledWith('req1', 'APPROVED');
        });

        it('refuses when a locked distribution was cancelled (e.g. refunded) since submission', async () => {
            prisma.payoutRequest.findUnique.mockResolvedValue(
                pendingRequest({ distributions: [distribution({ payout_status: PayoutStatus.CANCELLED })] }),
            );

            await expect(service.approve(admin, 'req1', {})).rejects.toThrow(ConflictException);
            expect(payoutsService.claimGroup).not.toHaveBeenCalled();
        });

        it('refuses when the request is not awaiting review', async () => {
            prisma.payoutRequest.findUnique.mockResolvedValue(pendingRequest({ status: PayoutRequestStatus.REJECTED }));

            await expect(service.approve(admin, 'req1', {})).rejects.toThrow(ConflictException);
        });

        it('leaves the request PENDING_REVIEW with a failure reason when the bank transfer fails', async () => {
            payoutsService.executeTransfer.mockResolvedValue({
                id: 'payout1',
                status: PayoutExecutionStatus.FAILED,
                failure_reason: 'Viva said no',
            });

            await service.approve(admin, 'req1', {});

            expect(prisma.payoutRequest.update).toHaveBeenCalledWith(
                expect.objectContaining({ data: { failure_reason: 'Viva said no' } }),
            );
            expect(notifications.notifyStoreReviewed).not.toHaveBeenCalled();
        });

        it('tells the admin when the store has no usable payout account instead of touching the request', async () => {
            payoutsService.resolvePayoutAccount.mockResolvedValue({ payoutAccount: null, reason: 'NO_PAYOUT_ACCOUNT' });

            await expect(service.approve(admin, 'req1', {})).rejects.toThrow(BadRequestException);
            expect(prisma.payoutRequest.update).not.toHaveBeenCalled();
        });
    });

    describe('reject / cancel', () => {
        it('rejects with a note and releases the locked distributions', async () => {
            prisma.payoutRequest.findUnique.mockResolvedValue(pendingRequest());
            prisma.payoutRequest.update.mockResolvedValue(pendingRequest({ status: PayoutRequestStatus.REJECTED }));

            await service.reject(admin, 'req1', { admin_note: 'Wrong total' });

            expect(prisma.payoutRequest.update).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({ status: PayoutRequestStatus.REJECTED, admin_note: 'Wrong total' }),
                }),
            );
            expect(prisma.tipDistribution.updateMany).toHaveBeenCalledWith({
                where: { payout_request_id: 'req1' },
                data: { payout_request_id: null },
            });

            await flushAsync();
            expect(notifications.notifyStoreReviewed).toHaveBeenCalledWith('req1', 'REJECTED');
        });

        it('lets the owner cancel only while awaiting review', async () => {
            prisma.payoutRequest.findFirst.mockResolvedValue(pendingRequest({ status: PayoutRequestStatus.APPROVED }));

            await expect(service.cancel(owner, 'store1', 'req1')).rejects.toThrow(ConflictException);

            prisma.payoutRequest.findFirst.mockResolvedValue(pendingRequest());
            prisma.payoutRequest.update.mockResolvedValue(pendingRequest({ status: PayoutRequestStatus.CANCELLED }));

            await service.cancel(owner, 'store1', 'req1');

            expect(prisma.tipDistribution.updateMany).toHaveBeenCalledWith({
                where: { payout_request_id: 'req1' },
                data: { payout_request_id: null },
            });
        });
    });

    describe('invoice url', () => {
        it('signs the object name without doubling the folder', async () => {
            prisma.payoutRequest.findUnique.mockResolvedValue({ invoice_document: invoiceDocument() });

            const result = await service.getInvoiceUrlAdmin('req1');

            expect(gcsService.getSignedUrl).toHaveBeenCalledWith('123-invoice.pdf', 'documents', 30);
            expect(result.url).toBe('https://signed');
        });
    });
});
