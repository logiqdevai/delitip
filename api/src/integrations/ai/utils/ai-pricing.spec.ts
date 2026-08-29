import { AiPricing } from './ai-pricing';
import { AiProviders, AiModels } from '../interfaces/ai.interface';

// Pure data module — no functions to exercise, so this guards the shape of the
// pricing table itself: every provider/model that AiProviders/AiModels declares
// must have a corresponding entry here, or calculateAiCost() would silently
// throw "Unknown provider/model" for a value the rest of the codebase considers valid.
describe('AiPricing', () => {
    it('has a pricing entry for every declared provider', () => {
        Object.values(AiProviders).forEach((provider) => {
            expect(AiPricing[provider]).toBeDefined();
        });
    });

    it('has a pricing entry for every declared model of every declared provider', () => {
        Object.entries(AiModels).forEach(([providerKey, models]) => {
            const providerPricing = (AiPricing as any)[providerKey];
            expect(providerPricing).toBeDefined();

            Object.values(models as Record<string, string>).forEach((modelId) => {
                expect(providerPricing[modelId]).toBeDefined();
            });
        });
    });

    it('gives every pricing entry a positive numeric input and output rate', () => {
        Object.values(AiPricing).forEach((providerPricing) => {
            Object.values(providerPricing).forEach((rates: any) => {
                expect(typeof rates.input).toBe('number');
                expect(typeof rates.output).toBe('number');
                expect(rates.input).toBeGreaterThan(0);
                expect(rates.output).toBeGreaterThan(0);
            });
        });
    });
});
