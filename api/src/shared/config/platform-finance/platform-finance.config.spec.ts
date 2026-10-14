import { PlatformFinanceConfig } from './platform-finance.config';

describe('PlatformFinanceConfig', () => {
    let configService: any;
    let prisma: any;
    let config: PlatformFinanceConfig;

    const row = {
        id: 'default',
        tip_platform_commission_percentage: '7.50',
        tip_processor_fee_estimate_percentage: '2.00',
        tip_processor_fee_estimate_fixed_amount: 30,
        payout_hold_window_hours: 72,
        vat_rate_percentage: '24.00',
    };

    beforeEach(() => {
        configService = { get: jest.fn() };
        prisma = { appConfig: { findUnique: jest.fn().mockResolvedValue(row), upsert: jest.fn() } };
        config = new PlatformFinanceConfig(configService, prisma);
    });

    it('reads the commission percentage from the app_config row', async () => {
        expect(await config.getCommissionPercentage()).toBe(7.5);
    });

    it('reads the processor fee estimate percentage from the app_config row', async () => {
        expect(await config.getProcessorFeeEstimatePercentage()).toBe(2);
    });

    it('reads the processor fee estimate fixed amount from the app_config row', async () => {
        expect(await config.getProcessorFeeEstimateFixedAmount()).toBe(30);
    });

    it('reads the payout hold window from the app_config row', async () => {
        expect(await config.getPayoutHoldWindowHours()).toBe(72);
    });

    it('reads the VAT rate from the app_config row', async () => {
        expect(await config.getVatRatePercentage()).toBe(24);
    });

    it('creates the default row when none exists yet', async () => {
        prisma.appConfig.findUnique.mockResolvedValue(null);
        prisma.appConfig.upsert.mockResolvedValue({ ...row, payout_hold_window_hours: 48 });

        expect(await config.getPayoutHoldWindowHours()).toBe(48);
        expect(prisma.appConfig.upsert).toHaveBeenCalledWith({
            where: { id: 'default' },
            create: { id: 'default' },
            update: {},
        });
    });

    it('reports connected-account payouts disabled by default', () => {
        configService.get.mockReturnValue(undefined);

        expect(config.isConnectedAccountPayoutsEnabled()).toBe(false);
        expect(configService.get).toHaveBeenCalledWith('CONNECTED_ACCOUNT_PAYOUTS_ENABLED');
    });

    it('reports connected-account payouts enabled when the flag is set to true', () => {
        configService.get.mockReturnValue('true');

        expect(config.isConnectedAccountPayoutsEnabled()).toBe(true);
    });

    it('reports connected-account payouts disabled for any non-"true" value', () => {
        configService.get.mockReturnValue('false');

        expect(config.isConnectedAccountPayoutsEnabled()).toBe(false);
    });
});
