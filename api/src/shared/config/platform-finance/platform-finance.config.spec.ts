import { PlatformFinanceConfig } from './platform-finance.config';

describe('PlatformFinanceConfig', () => {
    let configService: any;
    let config: PlatformFinanceConfig;

    beforeEach(() => {
        configService = { get: jest.fn() };
        config = new PlatformFinanceConfig(configService);
    });

    it('reads the commission percentage from env when set', () => {
        configService.get.mockReturnValue(7.5);

        expect(config.getCommissionPercentage()).toBe(7.5);
        expect(configService.get).toHaveBeenCalledWith('TIP_PLATFORM_COMMISSION_PERCENTAGE');
    });

    it('falls back to the default commission percentage when unset', () => {
        configService.get.mockReturnValue(undefined);

        expect(config.getCommissionPercentage()).toBe(5);
    });

    it('reads the processor fee estimate percentage from env when set', () => {
        configService.get.mockReturnValue(2);

        expect(config.getProcessorFeeEstimatePercentage()).toBe(2);
    });

    it('falls back to the default processor fee estimate percentage when unset', () => {
        configService.get.mockReturnValue(undefined);

        expect(config.getProcessorFeeEstimatePercentage()).toBe(4.8);
    });

    it('reads the payout hold window from env when set', () => {
        configService.get.mockReturnValue(72);

        expect(config.getPayoutHoldWindowHours()).toBe(72);
    });

    it('falls back to the default payout hold window when unset', () => {
        configService.get.mockReturnValue(undefined);

        expect(config.getPayoutHoldWindowHours()).toBe(48);
    });
});
