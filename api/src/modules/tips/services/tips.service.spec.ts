import { BadGatewayException, BadRequestException, NotFoundException } from '@nestjs/common';
import { Currency, Language, OrganizationRole, QrCodeSelectionMode, TipStatus } from 'generated/prisma';
import { AuthRole } from 'generated/prisma';
import { TipsService } from './tips.service';
import { CreatePublicTipDto } from '../dto/create-public-tip.dto';

const flush = () => new Promise((resolve) => setImmediate(resolve));

describe('TipsService', () => {
    let service: TipsService;
    let prisma: any;
    let accessControl: any;
    let usersService: any;
    let platformFinanceConfig: any;
    let vivaConfig: any;
    let vivaCheckout: any;

    const store = (overrides: Partial<any> = {}) => ({
        id: 'store1',
        organization_id: 'org1',
        name: 'The Corner Cafe',
        is_active: true,
        allow_custom_tip_amount: true,
        suggested_tip_amounts: [500, 1000],
        currency: Currency.EUR,
        default_distribution_rule_id: null,
        thank_you_message: null,
        primary_language: Language.EN,
        ...overrides,
    });

    const employee = (id: string, overrides: Partial<any> = {}) => ({
        id,
        full_name: { en: `Employee ${id}` },
        is_active: true,
        ...overrides,
    });

    const qrCode = (overrides: Partial<any> = {}) => ({
        id: 'qr1',
        is_active: true,
        selection_mode: QrCodeSelectionMode.CHOOSE_ONE,
        distribution_rule_id: null,
        store: store(),
        employees: [],
        ...overrides,
    });

    const baseDto = (overrides: Partial<CreatePublicTipDto> = {}): CreatePublicTipDto => ({
        qr_code_id: 'qr1',
        amount: 1000,
        ...overrides,
    } as CreatePublicTipDto);

    beforeEach(() => {
        prisma = {
            qrCode: { findUnique: jest.fn() },
            distributionRuleRecipient: { findMany: jest.fn().mockResolvedValue([]) },
            tip: {
                create: jest.fn(),
                update: jest.fn(),
                findUnique: jest.fn(),
                findMany: jest.fn(),
                count: jest.fn(),
                aggregate: jest.fn(),
            },
            paymentTransaction: {
                create: jest.fn(),
                update: jest.fn().mockResolvedValue({}),
                findUnique: jest.fn().mockResolvedValue(null),
            },
            tipDistribution: { createMany: jest.fn() },
            alertPreference: { findFirst: jest.fn().mockResolvedValue(null) },
            alert: { findFirst: jest.fn().mockResolvedValue(null), create: jest.fn() },
            store: { findUnique: jest.fn() },
            $transaction: jest.fn((arg) => (Array.isArray(arg) ? Promise.all(arg) : arg(prisma))),
        };
        accessControl = {
            assertStoreAccess: jest.fn().mockResolvedValue({ membership: { role: OrganizationRole.OWNER }, organizationId: 'org1' }),
            isPlatformAdmin: jest.fn().mockReturnValue(false),
        };
        usersService = { findOrCreateByEmail: jest.fn() };
        platformFinanceConfig = {
            getCommissionPercentage: jest.fn().mockReturnValue(5),
            getProcessorFeeEstimatePercentage: jest.fn().mockReturnValue(1.5),
        };
        vivaConfig = {
            getDefaultSourceCode: jest.fn().mockReturnValue('Default'),
            getNativeBaseUrl: jest.fn().mockReturnValue('https://demo.vivapayments.com'),
        };
        vivaCheckout = { createOrder: jest.fn().mockResolvedValue({ orderCode: 123456789 }) };

        service = new TipsService(prisma, accessControl, usersService, platformFinanceConfig, vivaConfig, vivaCheckout);

        prisma.tip.create.mockImplementation(async ({ data }: any) => ({ id: 'tip1', ...data }));
        prisma.paymentTransaction.create.mockImplementation(async ({ data }: any) => ({ id: 'pt1', ...data }));
        prisma.tip.findUnique.mockResolvedValue({ id: 'tip1', distributions: [] });
    });

    describe('createPublicTip', () => {
        it('throws NotFoundException when the QR code does not exist', async () => {
            prisma.qrCode.findUnique.mockResolvedValue(null);

            await expect(service.createPublicTip(baseDto())).rejects.toThrow(NotFoundException);
        });

        it('throws BadRequestException when the QR code is inactive', async () => {
            prisma.qrCode.findUnique.mockResolvedValue(qrCode({ is_active: false }));

            await expect(service.createPublicTip(baseDto())).rejects.toThrow(BadRequestException);
        });

        it('throws BadRequestException when the store is inactive', async () => {
            prisma.qrCode.findUnique.mockResolvedValue(qrCode({ store: store({ is_active: false }) }));

            await expect(service.createPublicTip(baseDto())).rejects.toThrow(BadRequestException);
        });

        it('throws BadRequestException when a custom amount is used but the store disallows it', async () => {
            prisma.qrCode.findUnique.mockResolvedValue(
                qrCode({ store: store({ allow_custom_tip_amount: false, suggested_tip_amounts: [500, 1000] }) }),
            );

            await expect(service.createPublicTip(baseDto({ amount: 750 }))).rejects.toThrow(BadRequestException);
        });

        it('allows a non-suggested amount when the store allows custom amounts', async () => {
            prisma.qrCode.findUnique.mockResolvedValue(
                qrCode({ store: store({ allow_custom_tip_amount: true, suggested_tip_amounts: [500, 1000] }) }),
            );

            await expect(service.createPublicTip(baseDto({ amount: 750 }))).resolves.toBeDefined();
        });

        it('allows a suggested amount even when custom amounts are disallowed', async () => {
            prisma.qrCode.findUnique.mockResolvedValue(
                qrCode({ store: store({ allow_custom_tip_amount: false, suggested_tip_amounts: [500, 1000] }) }),
            );

            await expect(service.createPublicTip(baseDto({ amount: 500 }))).resolves.toBeDefined();
        });

        describe('resolveSelectedEmployeeIds (via createPublicTip)', () => {
            it('selects no one when zero employees are assigned to the QR code', async () => {
                prisma.qrCode.findUnique.mockResolvedValue(qrCode({ employees: [] }));

                await service.createPublicTip(baseDto());

                expect(prisma.tip.create).toHaveBeenCalledWith(
                    expect.objectContaining({ data: expect.objectContaining({ employee_id: null, selected_employee_ids: [] }) }),
                );
            });

            it('auto-selects the sole employee when exactly one is assigned, regardless of selection_mode', async () => {
                prisma.qrCode.findUnique.mockResolvedValue(
                    qrCode({
                        selection_mode: QrCodeSelectionMode.CHOOSE_MANY,
                        employees: [{ employee: employee('e1') }],
                    }),
                );

                await service.createPublicTip(baseDto());

                expect(prisma.tip.create).toHaveBeenCalledWith(
                    expect.objectContaining({ data: expect.objectContaining({ employee_id: 'e1' }) }),
                );
            });

            it('TEAM mode selects every assigned employee with no input required', async () => {
                prisma.qrCode.findUnique.mockResolvedValue(
                    qrCode({
                        selection_mode: QrCodeSelectionMode.TEAM,
                        employees: [{ employee: employee('e1') }, { employee: employee('e2') }],
                    }),
                );

                await service.createPublicTip(baseDto());

                // employee_id on the tip itself is only set for a single selected employee;
                // the full set is preserved on selected_employee_ids for the webhook handler.
                expect(prisma.tip.create).toHaveBeenCalledWith(
                    expect.objectContaining({ data: expect.objectContaining({ employee_id: null, selected_employee_ids: ['e1', 'e2'] }) }),
                );
            });

            it('CHOOSE_MANY throws BadRequestException when employee_ids is missing', async () => {
                prisma.qrCode.findUnique.mockResolvedValue(
                    qrCode({
                        selection_mode: QrCodeSelectionMode.CHOOSE_MANY,
                        employees: [{ employee: employee('e1') }, { employee: employee('e2') }],
                    }),
                );

                await expect(service.createPublicTip(baseDto())).rejects.toThrow(BadRequestException);
            });

            it('CHOOSE_MANY throws BadRequestException when employee_ids is empty', async () => {
                prisma.qrCode.findUnique.mockResolvedValue(
                    qrCode({
                        selection_mode: QrCodeSelectionMode.CHOOSE_MANY,
                        employees: [{ employee: employee('e1') }, { employee: employee('e2') }],
                    }),
                );

                await expect(service.createPublicTip(baseDto({ employee_ids: [] }))).rejects.toThrow(BadRequestException);
            });

            it('CHOOSE_MANY throws BadRequestException when a picked id is not assigned to the QR code', async () => {
                prisma.qrCode.findUnique.mockResolvedValue(
                    qrCode({
                        selection_mode: QrCodeSelectionMode.CHOOSE_MANY,
                        employees: [{ employee: employee('e1') }, { employee: employee('e2') }],
                    }),
                );

                await expect(
                    service.createPublicTip(baseDto({ employee_ids: ['e1', 'not-assigned'] })),
                ).rejects.toThrow(BadRequestException);
            });

            it('CHOOSE_MANY accepts a valid subset', async () => {
                prisma.qrCode.findUnique.mockResolvedValue(
                    qrCode({
                        selection_mode: QrCodeSelectionMode.CHOOSE_MANY,
                        employees: [{ employee: employee('e1') }, { employee: employee('e2') }],
                    }),
                );

                await expect(service.createPublicTip(baseDto({ employee_ids: ['e1'] }))).resolves.toBeDefined();
            });

            it('CHOOSE_ONE (default) throws BadRequestException when employee_id is missing', async () => {
                prisma.qrCode.findUnique.mockResolvedValue(
                    qrCode({ employees: [{ employee: employee('e1') }, { employee: employee('e2') }] }),
                );

                await expect(service.createPublicTip(baseDto())).rejects.toThrow(BadRequestException);
            });

            it('CHOOSE_ONE throws BadRequestException when the picked id is not assigned to the QR code', async () => {
                prisma.qrCode.findUnique.mockResolvedValue(
                    qrCode({ employees: [{ employee: employee('e1') }, { employee: employee('e2') }] }),
                );

                await expect(service.createPublicTip(baseDto({ employee_id: 'not-assigned' }))).rejects.toThrow(
                    BadRequestException,
                );
            });

            it('CHOOSE_ONE accepts a valid pick', async () => {
                prisma.qrCode.findUnique.mockResolvedValue(
                    qrCode({ employees: [{ employee: employee('e1') }, { employee: employee('e2') }] }),
                );

                await expect(service.createPublicTip(baseDto({ employee_id: 'e2' }))).resolves.toBeDefined();
            });
        });

        describe('distribution rule resolution', () => {
            it('prefers the QR-level distribution rule over the store default', async () => {
                prisma.qrCode.findUnique.mockResolvedValue(
                    qrCode({ distribution_rule_id: 'qr-rule', store: store({ default_distribution_rule_id: 'store-rule' }) }),
                );

                await service.createPublicTip(baseDto());

                expect(prisma.tip.create).toHaveBeenCalledWith(
                    expect.objectContaining({ data: expect.objectContaining({ distribution_rule_id: 'qr-rule' }) }),
                );
            });

            it('falls back to the store default distribution rule when the QR has none', async () => {
                prisma.qrCode.findUnique.mockResolvedValue(
                    qrCode({ distribution_rule_id: null, store: store({ default_distribution_rule_id: 'store-rule' }) }),
                );

                await service.createPublicTip(baseDto());

                expect(prisma.tip.create).toHaveBeenCalledWith(
                    expect.objectContaining({ data: expect.objectContaining({ distribution_rule_id: 'store-rule' }) }),
                );
            });
        });

        describe('customer resolution', () => {
            it('resolves a customer user via email when provided', async () => {
                prisma.qrCode.findUnique.mockResolvedValue(qrCode());
                usersService.findOrCreateByEmail.mockResolvedValue({ id: 'user1' });

                await service.createPublicTip(baseDto({ customer_email: 'a@b.com', customer_name: 'Ada Lovelace' }));

                expect(usersService.findOrCreateByEmail).toHaveBeenCalledWith('a@b.com', { first_name: 'Ada' });
                expect(prisma.tip.create).toHaveBeenCalledWith(
                    expect.objectContaining({ data: expect.objectContaining({ customer_user_id: 'user1' }) }),
                );
            });

            it('leaves customer_user_id undefined when no email is provided', async () => {
                prisma.qrCode.findUnique.mockResolvedValue(qrCode());

                await service.createPublicTip(baseDto());

                expect(usersService.findOrCreateByEmail).not.toHaveBeenCalled();
                expect(prisma.tip.create).toHaveBeenCalledWith(
                    expect.objectContaining({ data: expect.objectContaining({ customer_user_id: undefined }) }),
                );
            });
        });

        describe('currency resolution', () => {
            it('uses the DTO currency when provided', async () => {
                prisma.qrCode.findUnique.mockResolvedValue(qrCode({ store: store({ currency: Currency.EUR }) }));

                await service.createPublicTip(baseDto({ currency: Currency.USD }));

                expect(prisma.tip.create).toHaveBeenCalledWith(
                    expect.objectContaining({ data: expect.objectContaining({ currency: Currency.USD }) }),
                );
            });

            it('falls back to the store currency when the DTO omits one', async () => {
                prisma.qrCode.findUnique.mockResolvedValue(qrCode({ store: store({ currency: Currency.GBP }) }));

                await service.createPublicTip(baseDto());

                expect(prisma.tip.create).toHaveBeenCalledWith(
                    expect.objectContaining({ data: expect.objectContaining({ currency: Currency.GBP }) }),
                );
            });
        });

        it('creates the tip as CREATED with a PaymentTransaction, opens a Viva order, and returns a checkout URL', async () => {
            prisma.qrCode.findUnique.mockResolvedValue(qrCode());

            const result = await service.createPublicTip(baseDto({ amount: 1000 }));

            expect(prisma.tip.create).toHaveBeenCalledWith(
                expect.objectContaining({ data: expect.objectContaining({ status: TipStatus.CREATED }) }),
            );
            expect(prisma.paymentTransaction.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        gross_amount: 1000,
                        commission_percentage_used: 5,
                        commission_amount: 50,
                    }),
                }),
            );
            expect(vivaCheckout.createOrder).toHaveBeenCalledWith(
                expect.objectContaining({ amount: 1000, tipAmount: 1000, merchantTrns: 'tip1' }),
            );
            expect(prisma.tipDistribution.createMany).not.toHaveBeenCalled();
            expect(result).toEqual({ tip_id: 'tip1', checkout_url: expect.stringContaining('123456789') });
        });

        it('reuses an in-flight order for the same client_request_id instead of creating a new one', async () => {
            prisma.paymentTransaction.findUnique.mockResolvedValue({
                provider_order_code: '999',
                tip: { id: 'existing-tip', status: TipStatus.CREATED },
            });

            const result = await service.createPublicTip(baseDto({ client_request_id: '11111111-1111-1111-1111-111111111111' }));

            expect(prisma.qrCode.findUnique).not.toHaveBeenCalled();
            expect(vivaCheckout.createOrder).not.toHaveBeenCalled();
            expect(result).toEqual({ tip_id: 'existing-tip', checkout_url: expect.stringContaining('999') });
        });

        it('marks the tip/payment transaction FAILED and throws BadGatewayException when Viva order creation fails', async () => {
            prisma.qrCode.findUnique.mockResolvedValue(qrCode());
            vivaCheckout.createOrder.mockRejectedValue(new Error('Viva is down'));

            await expect(service.createPublicTip(baseDto())).rejects.toThrow(BadGatewayException);
            expect(prisma.tip.update).toHaveBeenCalledWith(
                expect.objectContaining({ data: expect.objectContaining({ status: TipStatus.FAILED }) }),
            );
        });
    });

    describe('getPublicStatus', () => {
        const completedTip = (overrides: Partial<any> = {}) => ({
            id: 'tip1',
            status: TipStatus.COMPLETED,
            amount: 1000,
            currency: Currency.EUR,
            employee: null,
            store: store(),
            payment_transaction: { provider_order_code: '123' },
            distributions: [],
            ...overrides,
        });

        it('throws NotFoundException when the tip does not exist', async () => {
            prisma.tip.findUnique.mockResolvedValue(null);

            await expect(service.getPublicStatus('missing')).rejects.toThrow(NotFoundException);
        });

        it('uses the store\'s translated thank-you message when present', async () => {
            prisma.tip.findUnique.mockResolvedValue(
                completedTip({ store: store({ thank_you_message: { en: 'Cheers from the team!' } }) }),
            );

            const result = await service.getPublicStatus('tip1');

            expect(result.thank_you_message).toBe('Cheers from the team!');
        });

        it('falls back to a generated default naming the store when no employee was thanked', async () => {
            prisma.tip.findUnique.mockResolvedValue(
                completedTip({ store: store({ thank_you_message: null, name: 'The Corner Cafe' }) }),
            );

            const result = await service.getPublicStatus('tip1');

            expect(result.thank_you_message).toContain('The Corner Cafe');
        });

        it('falls back to a generated default naming the thanked employee', async () => {
            prisma.tip.findUnique.mockResolvedValue(
                completedTip({
                    store: store({ thank_you_message: null }),
                    distributions: [{ recipient_type: 'EMPLOYEE', employee: employee('e1', { full_name: { en: 'Nikos' } }), amount: 950, percentage: 95 }],
                }),
            );

            const result = await service.getPublicStatus('tip1');

            expect(result.thank_you_message).toContain('Nikos');
        });

        it('omits distribution_summary and thank_you_message while not yet COMPLETED', async () => {
            prisma.tip.findUnique.mockResolvedValue(completedTip({ status: TipStatus.PROCESSING }));

            const result = await service.getPublicStatus('tip1');

            expect(result.distribution_summary).toBeUndefined();
            expect(result.thank_you_message).toBeUndefined();
        });
    });

    describe('triggerPerformanceChangeAlert (isolated)', () => {
        const call = (storeId = 'store1') => service.triggerPerformanceChangeAlert(storeId);

        it('does nothing when the alert preference is disabled', async () => {
            prisma.alertPreference.findFirst.mockResolvedValue({ is_enabled: false });

            await call();

            expect(prisma.alert.create).not.toHaveBeenCalled();
        });

        it('does nothing when an alert was already raised in the last 24h', async () => {
            prisma.alertPreference.findFirst.mockResolvedValue(null);
            prisma.alert.findFirst.mockResolvedValue({ id: 'existing-alert' });

            await call();

            expect(prisma.alert.create).not.toHaveBeenCalled();
        });

        it('does nothing when last week had zero tips (avoids divide-by-zero)', async () => {
            prisma.alert.findFirst.mockResolvedValue(null);
            prisma.tip.aggregate
                .mockResolvedValueOnce({ _sum: { amount: 1000 } })
                .mockResolvedValueOnce({ _sum: { amount: 0 } });

            await call();

            expect(prisma.alert.create).not.toHaveBeenCalled();
        });

        it('does nothing when the change is below the threshold', async () => {
            prisma.alert.findFirst.mockResolvedValue(null);
            prisma.tip.aggregate
                .mockResolvedValueOnce({ _sum: { amount: 1050 } }) // this week
                .mockResolvedValueOnce({ _sum: { amount: 1000 } }); // last week -> +5%

            await call();

            expect(prisma.alert.create).not.toHaveBeenCalled();
        });

        it('creates an "up" alert when tips increased past the threshold', async () => {
            prisma.alert.findFirst.mockResolvedValue(null);
            prisma.tip.aggregate
                .mockResolvedValueOnce({ _sum: { amount: 1500 } }) // this week: +50%
                .mockResolvedValueOnce({ _sum: { amount: 1000 } }); // last week
            prisma.store.findUnique.mockResolvedValue(store({ name: 'The Corner Cafe' }));

            await call();

            expect(prisma.alert.create).toHaveBeenCalledWith(
                expect.objectContaining({ data: expect.objectContaining({ title: 'Tips are up' }) }),
            );
        });

        it('creates a "down" alert when tips decreased past the threshold', async () => {
            prisma.alert.findFirst.mockResolvedValue(null);
            prisma.tip.aggregate
                .mockResolvedValueOnce({ _sum: { amount: 500 } }) // this week: -50%
                .mockResolvedValueOnce({ _sum: { amount: 1000 } }); // last week
            prisma.store.findUnique.mockResolvedValue(store({ name: 'The Corner Cafe' }));

            await call();

            expect(prisma.alert.create).toHaveBeenCalledWith(
                expect.objectContaining({ data: expect.objectContaining({ title: 'Tips are down' }) }),
            );
        });

        it('does nothing when the store cannot be found', async () => {
            prisma.alert.findFirst.mockResolvedValue(null);
            prisma.tip.aggregate
                .mockResolvedValueOnce({ _sum: { amount: 1500 } })
                .mockResolvedValueOnce({ _sum: { amount: 1000 } });
            prisma.store.findUnique.mockResolvedValue(null);

            await call();

            expect(prisma.alert.create).not.toHaveBeenCalled();
        });
    });

    describe('findAll', () => {
        const user = { id: 'u1', role: AuthRole.USER };

        beforeEach(() => {
            prisma.tip.findMany.mockResolvedValue([]);
            prisma.tip.count.mockResolvedValue(0);
        });

        it('asserts store access before listing', async () => {
            await service.findAll(user, 'store1', { page: 1, limit: 20 } as any);

            expect(accessControl.assertStoreAccess).toHaveBeenCalledWith(user, 'store1');
        });

        it('applies every optional filter when provided', async () => {
            await service.findAll(user, 'store1', {
                page: 1,
                limit: 20,
                employee_id: 'e1',
                qr_code_id: 'qr1',
                status: TipStatus.COMPLETED,
                date_from: '2024-01-01',
                date_to: '2024-01-31',
            } as any);

            expect(prisma.tip.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: {
                        store_id: 'store1',
                        employee_id: 'e1',
                        qr_code_id: 'qr1',
                        status: TipStatus.COMPLETED,
                        created_at: { gte: new Date('2024-01-01'), lte: new Date('2024-01-31') },
                    },
                }),
            );
        });

        it('paginates the results', async () => {
            prisma.tip.findMany.mockResolvedValue([{ id: 't1' }]);
            prisma.tip.count.mockResolvedValue(1);

            const result = await service.findAll(user, 'store1', { page: 1, limit: 20 } as any);

            expect(result).toEqual({
                data: [{ id: 't1' }],
                pagination: { total: 1, page: 1, limit: 20, total_pages: 1, has_next: false, has_prev: false },
            });
        });
    });

    describe('findOne', () => {
        const user = { id: 'u1', role: AuthRole.USER };

        it('throws NotFoundException when the tip does not exist', async () => {
            prisma.tip.findUnique.mockResolvedValue(null);

            await expect(service.findOne(user, 'missing')).rejects.toThrow(NotFoundException);
        });

        it('asserts store access using the tip\'s store_id and returns the tip with financials for an OWNER', async () => {
            const tip = { id: 'tip1', store_id: 'store1', payment_transaction: { gross_amount: 1000 } };
            prisma.tip.findUnique.mockResolvedValue(tip);
            prisma.store.findUnique.mockResolvedValue(store());

            const result = await service.findOne(user, 'tip1');

            expect(accessControl.assertStoreAccess).toHaveBeenCalledWith(user, 'store1');
            expect(result.payment_transaction).toEqual({ gross_amount: 1000 });
        });

        it('strips the financial breakdown for a non-OWNER/ACCOUNTANT store member', async () => {
            accessControl.assertStoreAccess.mockResolvedValue({ membership: { role: OrganizationRole.STORE_MANAGER }, organizationId: 'org1' });
            const tip = { id: 'tip1', store_id: 'store1', payment_transaction: { gross_amount: 1000 } };
            prisma.tip.findUnique.mockResolvedValue(tip);
            prisma.store.findUnique.mockResolvedValue(store());

            const result = await service.findOne(user, 'tip1');

            expect(result.payment_transaction).toBeUndefined();
        });
    });
});
