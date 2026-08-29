const StorageMock = jest.fn();
jest.mock('@google-cloud/storage', () => ({ Storage: StorageMock }));

import { GcsConfig } from './gcs.config';

function makeConfigService(values: Record<string, string | undefined>) {
    return { get: jest.fn((key: string) => values[key]) };
}

describe('GcsConfig', () => {
    beforeEach(() => {
        StorageMock.mockClear();
        StorageMock.mockImplementation(function (this: any, options: any) {
            this.__options = options;
        });
    });

    it('logs and leaves the client unconfigured when GCS_PROJECT_ID/GCS_BUCKET_NAME are missing', () => {
        const config = new GcsConfig(makeConfigService({}) as any);

        expect(StorageMock).not.toHaveBeenCalled();
        expect(config.getStorageClient()).toBeUndefined();
        expect(config.getConfig()).toBeUndefined();
        expect(() => config.getBucketName()).toThrow();
    });

    it('initializes the Storage client with just a projectId when no credentials are provided', () => {
        const config = new GcsConfig(
            makeConfigService({ GCS_PROJECT_ID: 'proj', GCS_BUCKET_NAME: 'bucket' }) as any,
        );

        expect(StorageMock).toHaveBeenCalledWith({ projectId: 'proj' });
        expect(config.getBucketName()).toBe('bucket');
        expect(config.getConfig()).toEqual({ project_id: 'proj', bucket_name: 'bucket', credentials: undefined });
    });

    it('decodes base64-encoded credentials JSON and passes it to the Storage client', () => {
        const credentials = { client_email: 'a@b.com', private_key: 'pk' };
        const base64 = Buffer.from(JSON.stringify(credentials)).toString('base64');

        const config = new GcsConfig(
            makeConfigService({ GCS_PROJECT_ID: 'proj', GCS_BUCKET_NAME: 'bucket', GCS_CREDENTIALS_JSON_BASE64: base64 }) as any,
        );

        expect(StorageMock).toHaveBeenCalledWith({ projectId: 'proj', credentials });
        expect(config.getConfig().credentials).toEqual(credentials);
    });

    it('parses raw (non-base64) credentials JSON when only GCS_CREDENTIALS is provided', () => {
        const credentials = { client_email: 'a@b.com' };

        const config = new GcsConfig(
            makeConfigService({
                GCS_PROJECT_ID: 'proj',
                GCS_BUCKET_NAME: 'bucket',
                GCS_CREDENTIALS: JSON.stringify(credentials),
            }) as any,
        );

        expect(StorageMock).toHaveBeenCalledWith({ projectId: 'proj', credentials });
    });

    it('prefers the base64 credentials variant when both are provided', () => {
        const base64Creds = { source: 'base64' };
        const jsonCreds = { source: 'json' };

        new GcsConfig(
            makeConfigService({
                GCS_PROJECT_ID: 'proj',
                GCS_BUCKET_NAME: 'bucket',
                GCS_CREDENTIALS_JSON_BASE64: Buffer.from(JSON.stringify(base64Creds)).toString('base64'),
                GCS_CREDENTIALS: JSON.stringify(jsonCreds),
            }) as any,
        );

        expect(StorageMock).toHaveBeenCalledWith({ projectId: 'proj', credentials: base64Creds });
    });

    it('leaves the client unconfigured (and getBucketName throwing) when the credentials JSON is malformed', () => {
        const config = new GcsConfig(
            makeConfigService({
                GCS_PROJECT_ID: 'proj',
                GCS_BUCKET_NAME: 'bucket',
                GCS_CREDENTIALS_JSON_BASE64: Buffer.from('not-json').toString('base64'),
            }) as any,
        );

        expect(StorageMock).not.toHaveBeenCalled();
        expect(config.getStorageClient()).toBeUndefined();
        expect(() => config.getBucketName()).toThrow();
    });
});
