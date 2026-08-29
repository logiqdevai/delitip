const mockOpenaiModel = { __isMockOpenAiModel: true };
const openaiFactory = jest.fn().mockReturnValue(mockOpenaiModel);
jest.mock('@ai-sdk/openai', () => ({ openai: (...args: any[]) => openaiFactory(...args) }));

import { AiConfig } from './ai.config';
import { AiProviders, AiModels } from '../interfaces/ai.interface';

describe('AiConfig', () => {
    let config: AiConfig;

    beforeEach(() => {
        openaiFactory.mockClear();
        config = new AiConfig();
    });

    describe('getModelAdapter', () => {
        it('defaults to the openai provider and gpt-4o model when neither is given', () => {
            const adapter = config.getModelAdapter();

            expect(openaiFactory).toHaveBeenCalledWith('gpt-4o');
            expect(adapter).toBe(mockOpenaiModel);
        });

        it('builds an openai adapter for the given model', () => {
            config.getModelAdapter(AiProviders.openai, AiModels.openai.gpt4Turbo);

            expect(openaiFactory).toHaveBeenCalledWith('gpt-4-turbo');
        });

        it('throws for the grok provider (not yet implemented)', () => {
            expect(() => config.getModelAdapter(AiProviders.grok, AiModels.grok.grokBeta)).toThrow(
                'Grok provider not yet implemented. SDK required.',
            );
        });

        it('throws for the gemini provider (not yet implemented)', () => {
            expect(() => config.getModelAdapter(AiProviders.gemini, AiModels.gemini.geminiPro)).toThrow(
                'Gemini provider not yet implemented. SDK required.',
            );
        });

        it('falls back to openai for an unrecognized provider', () => {
            const adapter = config.getModelAdapter('unknown-provider' as any, 'some-model');

            expect(openaiFactory).toHaveBeenCalledWith('some-model');
            expect(adapter).toBe(mockOpenaiModel);
        });
    });

    describe('isModelSupported', () => {
        it('returns true for a known provider/model pair', () => {
            expect(config.isModelSupported(AiProviders.openai, AiModels.openai.gpt4o)).toBe(true);
        });

        it('returns false for an unknown model under a known provider', () => {
            expect(config.isModelSupported(AiProviders.openai, 'not-a-real-model')).toBe(false);
        });

        it('returns false for a provider/model pair from different providers', () => {
            expect(config.isModelSupported(AiProviders.openai, AiModels.grok.grokBeta)).toBe(false);
        });
    });

    describe('getSupportedModels', () => {
        it('returns the full list of supported models', () => {
            const models = config.getSupportedModels();

            expect(models.length).toBeGreaterThan(0);
            expect(models).toContainEqual({ provider: AiProviders.openai, model: AiModels.openai.gpt4o });
        });

        it('returns a defensive copy, not the internal array', () => {
            const a = config.getSupportedModels();
            const b = config.getSupportedModels();

            expect(a).not.toBe(b);
            expect(a).toEqual(b);
        });
    });

    describe('getModelsByProvider', () => {
        it('returns only the models for the given provider', () => {
            const models = config.getModelsByProvider(AiProviders.grok);

            expect(models).toEqual([
                { provider: AiProviders.grok, model: AiModels.grok.grokBeta },
                { provider: AiProviders.grok, model: AiModels.grok.grokPro },
            ]);
        });

        it('returns an empty array for a provider with no supported models', () => {
            expect(config.getModelsByProvider('bogus-provider' as any)).toEqual([]);
        });
    });

    describe('validateProviderAndModel', () => {
        it('does not throw for a supported provider/model pair', () => {
            expect(() => config.validateProviderAndModel(AiProviders.openai, AiModels.openai.gpt4o)).not.toThrow();
        });

        it('throws listing the available models for that provider when the model is unsupported', () => {
            expect(() => config.validateProviderAndModel(AiProviders.openai, 'not-a-real-model')).toThrow(
                /Model not-a-real-model is not supported for provider openai\. Available models for openai: .*gpt-4o/,
            );
        });

        it('throws with "none" listed when the provider itself has no supported models', () => {
            expect(() => config.validateProviderAndModel('bogus-provider' as any, 'x')).toThrow(/Available models for bogus-provider: none/);
        });
    });
});
