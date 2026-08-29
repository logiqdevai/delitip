const generateTextMock = jest.fn();
const generateObjectMock = jest.fn();
const streamTextMock = jest.fn();
const embedMock = jest.fn();
jest.mock('ai', () => ({
    generateText: (...args: any[]) => generateTextMock(...args),
    generateObject: (...args: any[]) => generateObjectMock(...args),
    streamText: (...args: any[]) => streamTextMock(...args),
    embed: (...args: any[]) => embedMock(...args),
}));

const embeddingModelFactory = jest.fn().mockReturnValue({ __isMockEmbeddingModel: true });
jest.mock('@ai-sdk/openai', () => ({ openai: { embedding: (...args: any[]) => embeddingModelFactory(...args) } }));

const calculateAiCostMock = jest.fn();
jest.mock('../utils/ai-cost', () => ({ calculateAiCost: (...args: any[]) => calculateAiCostMock(...args) }));

import { AiService } from './ai.service';

describe('AiService', () => {
    let service: AiService;
    let aiConfig: any;

    const fakeModelAdapter = { __isMockModelAdapter: true };
    const fakeCost = {
        inputTokens: 10,
        outputTokens: 5,
        totalTokens: 15,
        inputRate: 0.001,
        outputRate: 0.002,
        inputCost: 0.01,
        outputCost: 0.01,
        totalCost: 0.02,
    };

    beforeEach(() => {
        jest.clearAllMocks();
        aiConfig = {
            getModelAdapter: jest.fn().mockReturnValue(fakeModelAdapter),
            validateProviderAndModel: jest.fn(),
        };
        calculateAiCostMock.mockReturnValue(fakeCost);
        service = new AiService(aiConfig);
    });

    describe('generateText', () => {
        it('generates text and returns it with the calculated cost', async () => {
            generateTextMock.mockResolvedValue({ text: 'hello world', usage: { promptTokens: 10, completionTokens: 5 } });

            const result = await service.generateText({ prompt: 'say hi', provider: 'openai', model: 'gpt-4o' });

            expect(aiConfig.getModelAdapter).toHaveBeenCalledWith('openai', 'gpt-4o');
            expect(generateTextMock).toHaveBeenCalledWith(
                expect.objectContaining({ prompt: 'say hi', model: fakeModelAdapter, system: 'You are a helpful assistant.' }),
            );
            expect(calculateAiCostMock).toHaveBeenCalledWith({
                provider: 'openai',
                model: 'gpt-4o',
                inputTokens: 10,
                outputTokens: 5,
            });
            expect(result).toEqual({ response: 'hello world', usage: fakeCost });
        });

        it('uses a custom system prompt when given', async () => {
            generateTextMock.mockResolvedValue({ text: 'x', usage: { promptTokens: 1, completionTokens: 1 } });

            await service.generateText({ prompt: 'p', system: 'Be terse.' });

            expect(generateTextMock).toHaveBeenCalledWith(expect.objectContaining({ system: 'Be terse.' }));
        });

        it('wraps a generation failure in a generic Error', async () => {
            generateTextMock.mockRejectedValue(new Error('rate limited'));

            await expect(service.generateText({ prompt: 'p' })).rejects.toThrow('Failed to generate text: rate limited');
        });
    });

    describe('generateTextWithSchema', () => {
        it('generates a structured object and returns it with the calculated cost', async () => {
            generateObjectMock.mockResolvedValue({ object: [{ a: 1 }], usage: { promptTokens: 8, completionTokens: 4 } });

            const result = await service.generateTextWithSchema({ prompt: 'extract' });

            expect(generateObjectMock).toHaveBeenCalledWith(expect.objectContaining({ output: 'array', prompt: 'extract' }));
            expect(result).toEqual({ response: [{ a: 1 }], usage: fakeCost });
        });

        it('retries on failure up to 3 attempts, then succeeds', async () => {
            generateObjectMock
                .mockRejectedValueOnce(new Error('bad schema'))
                .mockRejectedValueOnce(new Error('bad schema again'))
                .mockResolvedValueOnce({ object: [{ a: 1 }], usage: { promptTokens: 1, completionTokens: 1 } });

            const result = await service.generateTextWithSchema({ prompt: 'p' });

            expect(generateObjectMock).toHaveBeenCalledTimes(3);
            expect(result.response).toEqual([{ a: 1 }]);
        });

        it('throws after exhausting all 3 retry attempts', async () => {
            generateObjectMock.mockRejectedValue(new Error('always bad'));

            await expect(service.generateTextWithSchema({ prompt: 'p' })).rejects.toThrow('Failed to generate text: always bad');
            expect(generateObjectMock).toHaveBeenCalledTimes(3);
        });
    });

    describe('streamText', () => {
        async function* fakeTextStream(chunks: string[]) {
            for (const chunk of chunks) yield chunk;
        }

        it('validates provider/model, streams tokens via onToken, and calls onComplete with the full text', async () => {
            streamTextMock.mockResolvedValue({ textStream: fakeTextStream(['Hel', 'lo']) });
            const onToken = jest.fn();
            const onComplete = jest.fn();

            await service.streamText({ prompt: 'p', provider: 'openai', model: 'gpt-4o', onToken, onComplete });

            expect(aiConfig.validateProviderAndModel).toHaveBeenCalledWith('openai', 'gpt-4o');
            expect(onToken).toHaveBeenNthCalledWith(1, 'Hel');
            expect(onToken).toHaveBeenNthCalledWith(2, 'lo');
            expect(onComplete).toHaveBeenCalledWith('Hello');
        });

        it('works without onToken/onComplete callbacks', async () => {
            streamTextMock.mockResolvedValue({ textStream: fakeTextStream(['x']) });

            await expect(service.streamText({ prompt: 'p' })).resolves.toBeUndefined();
        });

        it('wraps a validation failure (unsupported model) in a generic Error', async () => {
            aiConfig.validateProviderAndModel.mockImplementation(() => {
                throw new Error('Model not supported');
            });

            await expect(service.streamText({ prompt: 'p' })).rejects.toThrow('Failed to stream text: Model not supported');
        });

        it('wraps a streaming failure in a generic Error', async () => {
            streamTextMock.mockRejectedValue(new Error('stream boom'));

            await expect(service.streamText({ prompt: 'p' })).rejects.toThrow('Failed to stream text: stream boom');
        });
    });

    describe('embedText', () => {
        it('embeds the given text using the text-embedding-3-small model', async () => {
            embedMock.mockResolvedValue({ embedding: [0.1, 0.2, 0.3] });

            const result = await service.embedText('hello');

            expect(embeddingModelFactory).toHaveBeenCalledWith('text-embedding-3-small');
            expect(embedMock).toHaveBeenCalledWith(expect.objectContaining({ value: 'hello' }));
            expect(result).toEqual([0.1, 0.2, 0.3]);
        });
    });
});
