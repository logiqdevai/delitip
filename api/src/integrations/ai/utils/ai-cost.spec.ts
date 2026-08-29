import { calculateAiCost, estimateWordsFromPrice } from './ai-cost';
import { AiProviders, AiModels } from '../interfaces/ai.interface';

describe('calculateAiCost', () => {
    it('defaults to the openai gpt-4o pricing when provider/model are omitted', () => {
        const result = calculateAiCost({ inputTokens: 1000, outputTokens: 500 });

        expect(result.inputRate).toBe(0.00001);
        expect(result.outputRate).toBe(0.00003);
        expect(result.inputCost).toBeCloseTo(0.01);
        expect(result.outputCost).toBeCloseTo(0.015);
        expect(result.totalCost).toBeCloseTo(0.025);
        expect(result.totalTokens).toBe(1500);
    });

    it('uses the pricing for an explicitly given provider/model', () => {
        const result = calculateAiCost({
            provider: AiProviders.grok,
            model: AiModels.grok.grokPro,
            inputTokens: 100,
            outputTokens: 50,
        });

        expect(result.inputRate).toBe(0.00002);
        expect(result.outputRate).toBe(0.00004);
        expect(result.inputCost).toBeCloseTo(0.002);
        expect(result.outputCost).toBeCloseTo(0.002);
        expect(result.totalCost).toBeCloseTo(0.004);
    });

    it('throws for an unknown provider', () => {
        expect(() =>
            calculateAiCost({ provider: 'bogus' as any, inputTokens: 1, outputTokens: 1 }),
        ).toThrow('Unknown provider: bogus');
    });

    it('throws for an unknown model on a known provider', () => {
        expect(() =>
            calculateAiCost({
                provider: AiProviders.openai,
                model: 'bogus-model' as any,
                inputTokens: 1,
                outputTokens: 1,
            }),
        ).toThrow('Unknown model: bogus-model for provider: openai');
    });

    it('treats missing token counts as zero for cost purposes', () => {
        const result = calculateAiCost({ inputTokens: undefined as any, outputTokens: 500 });

        expect(result.inputCost).toBe(0);
        expect(result.outputCost).toBeCloseTo(0.015);
    });

    it('documented quirk: totalTokens is NOT defaulted the same way as the cost fields', () => {
        // inputCost/outputCost use `?? 0`, but totalTokens is a raw `inputTokens + outputTokens`
        // sum with no such guard — so a missing inputTokens yields a real NaN in the response
        // even though the cost fields stay well-defined. Documenting current behavior, not fixing.
        const result = calculateAiCost({ inputTokens: undefined as any, outputTokens: 500 });

        expect(Number.isNaN(result.totalTokens)).toBe(true);
    });
});

describe('estimateWordsFromPrice', () => {
    it('returns 0 words for a price of 0', () => {
        expect(estimateWordsFromPrice(0)).toBe(0);
    });

    it('estimates words using the openai gpt-4o average token cost, floored', () => {
        // avgTokenCost = (0.00001 + 0.00003) / 2 = 0.00002
        // price 0.0002 -> 10 tokens -> 10 * 0.75 = 7.5 words -> floored to 7
        expect(estimateWordsFromPrice(0.0002)).toBe(7);
    });

    it('returns an exact word count when it divides evenly', () => {
        // price 0.002 -> 100 tokens -> 100 * 0.75 = 75 words exactly
        expect(estimateWordsFromPrice(0.002)).toBe(75);
    });
});
