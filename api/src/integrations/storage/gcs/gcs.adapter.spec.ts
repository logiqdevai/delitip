import { GcsAdapter } from './gcs.adapter';
import { DEFAULT_GCS_FOLDER } from './config/gcs-folders.config';

function createFakeWriteStream(mode: 'success' | 'error', error?: Error) {
    const handlers: Record<string, (...args: any[]) => void> = {};
    return {
        on: jest.fn((event: string, cb: (...args: any[]) => void) => {
            handlers[event] = cb;
        }),
        end: jest.fn(() => {
            if (mode === 'error') {
                handlers['error'](error);
            } else {
                handlers['finish']();
            }
        }),
    };
}

describe('GcsAdapter', () => {
    let adapter: GcsAdapter;
    let gcsConfig: any;
    let storage: any;
    let bucket: any;
    let file: any;

    beforeEach(() => {
        jest.spyOn(Date, 'now').mockReturnValue(1700000000000);

        file = {
            createWriteStream: jest.fn(),
            getMetadata: jest.fn(),
            delete: jest.fn(),
            getSignedUrl: jest.fn(),
            exists: jest.fn(),
            download: jest.fn(),
        };
        bucket = {
            file: jest.fn().mockReturnValue(file),
            getFiles: jest.fn(),
        };
        storage = { bucket: jest.fn().mockReturnValue(bucket) };
        gcsConfig = {
            getStorageClient: jest.fn().mockReturnValue(storage),
            getBucketName: jest.fn().mockReturnValue('my-bucket'),
        };
        adapter = new GcsAdapter(gcsConfig);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('uploadImage', () => {
        it('uploads to the default folder and resolves with the public URL/metadata', async () => {
            file.createWriteStream.mockReturnValue(createFakeWriteStream('success'));
            file.getMetadata.mockResolvedValue([{ size: '42', contentType: 'image/png' }]);

            const result = await adapter.uploadImage({ file: Buffer.from('x'), filename: 'photo.png', contentType: 'image/png' });

            const expectedFilename = `${DEFAULT_GCS_FOLDER}/1700000000000-photo.png`;
            expect(bucket.file).toHaveBeenCalledWith(expectedFilename);
            expect(result).toEqual({
                url: `https://storage.googleapis.com/my-bucket/${expectedFilename}`,
                filename: expectedFilename,
                size: 42,
                contentType: 'image/png',
                bucket: 'my-bucket',
                path: expectedFilename,
            });
        });

        it('uses a custom folder and bucket override when provided', async () => {
            file.createWriteStream.mockReturnValue(createFakeWriteStream('success'));
            file.getMetadata.mockResolvedValue([{ size: '1', contentType: 'image/png' }]);

            await adapter.uploadImage({
                file: Buffer.from('x'),
                filename: 'p.png',
                contentType: 'image/png',
                folder: 'avatars',
                bucket: 'other-bucket',
            });

            expect(storage.bucket).toHaveBeenCalledWith('other-bucket');
            expect(bucket.file).toHaveBeenCalledWith('avatars/1700000000000-p.png');
        });

        it('rejects with a wrapped error when the write stream errors', async () => {
            file.createWriteStream.mockReturnValue(createFakeWriteStream('error', new Error('stream boom')));

            await expect(
                adapter.uploadImage({ file: Buffer.from('x'), filename: 'p.png', contentType: 'image/png' }),
            ).rejects.toThrow('Failed to upload image: stream boom');
        });
    });

    describe('deleteImage', () => {
        it('deletes the file and returns success', async () => {
            file.delete.mockResolvedValue(undefined);

            await expect(adapter.deleteImage({ filename: 'p.png' })).resolves.toEqual({ success: true, filename: 'p.png' });
            expect(bucket.file).toHaveBeenCalledWith('p.png');
        });

        it('wraps a delete failure', async () => {
            file.delete.mockRejectedValue(new Error('not found'));

            await expect(adapter.deleteImage({ filename: 'p.png' })).rejects.toThrow('Failed to delete image: not found');
        });
    });

    describe('listImages', () => {
        it('lists files under the default folder with the default page size', async () => {
            bucket.getFiles.mockResolvedValue([
                [{ name: 'documents/a.png', getMetadata: jest.fn().mockResolvedValue([{ size: '10', contentType: 'image/png', timeCreated: '2024-01-01T00:00:00Z' }]) }],
            ]);

            const result = await adapter.listImages({});

            expect(bucket.getFiles).toHaveBeenCalledWith({ prefix: `${DEFAULT_GCS_FOLDER}/`, maxResults: 100 });
            expect(result.documents).toHaveLength(1);
            expect(result.documents[0]).toMatchObject({ name: 'documents/a.png', size: 10, contentType: 'image/png' });
            expect(result.nextPageToken).toBeUndefined();
        });

        it('combines folder and prefix, respects a custom maxResults, and sets nextPageToken when the page is full', async () => {
            const makeFile = (name: string) => ({
                name,
                getMetadata: jest.fn().mockResolvedValue([{ size: '1', contentType: 'image/png', timeCreated: '2024-01-01T00:00:00Z' }]),
            });
            bucket.getFiles.mockResolvedValue([[makeFile('avatars/x-1.png')]]);

            const result = await adapter.listImages({ folder: 'avatars', prefix: 'x', maxResults: 1 });

            expect(bucket.getFiles).toHaveBeenCalledWith({ prefix: 'avatars/x', maxResults: 1 });
            expect(result.nextPageToken).toBe('has_more');
        });

        it('rejects with a wrapped error, including when called with no request (unguarded request.folder access)', async () => {
            // GcsService/GcsAdapter both type `request` as optional, but listImages accesses
            // `request.folder` unguarded — calling with no args always throws. Documented as a
            // finding rather than "fixed" silently; this test locks in the current behavior.
            await expect(adapter.listImages()).rejects.toThrow(/Failed to list documents/);
        });

        it('wraps a getFiles failure', async () => {
            bucket.getFiles.mockRejectedValue(new Error('boom'));

            await expect(adapter.listImages({})).rejects.toThrow('Failed to list documents: boom');
        });
    });

    describe('getSignedUrl', () => {
        it('signs a URL under the default folder with the default expiry', async () => {
            file.getSignedUrl.mockResolvedValue(['https://signed-url']);

            const result = await adapter.getSignedUrl('p.png');

            expect(bucket.file).toHaveBeenCalledWith(`${DEFAULT_GCS_FOLDER}/p.png`);
            expect(file.getSignedUrl).toHaveBeenCalledWith({ action: 'read', expires: 1700000000000 + 60 * 60 * 1000 });
            expect(result).toBe('https://signed-url');
        });

        it('honors a custom folder and expiry', async () => {
            file.getSignedUrl.mockResolvedValue(['https://signed-url']);

            await adapter.getSignedUrl('p.png', 'avatars', 5);

            expect(bucket.file).toHaveBeenCalledWith('avatars/p.png');
            expect(file.getSignedUrl).toHaveBeenCalledWith({ action: 'read', expires: 1700000000000 + 5 * 60 * 1000 });
        });

        it('wraps a signing failure', async () => {
            file.getSignedUrl.mockRejectedValue(new Error('boom'));

            await expect(adapter.getSignedUrl('p.png')).rejects.toThrow('Failed to get signed URL: boom');
        });
    });

    describe('downloadImage', () => {
        it('downloads an existing file', async () => {
            file.exists.mockResolvedValue([true]);
            file.download.mockResolvedValue([Buffer.from('data')]);
            file.getMetadata.mockResolvedValue([{ contentType: 'image/png' }]);

            const result = await adapter.downloadImage({ filename: 'p.png', folder: 'avatars' });

            expect(bucket.file).toHaveBeenCalledWith('avatars/p.png');
            expect(result).toEqual({ buffer: Buffer.from('data'), contentType: 'image/png' });
        });

        it('defaults contentType when metadata omits it', async () => {
            file.exists.mockResolvedValue([true]);
            file.download.mockResolvedValue([Buffer.from('data')]);
            file.getMetadata.mockResolvedValue([{}]);

            const result = await adapter.downloadImage({ filename: 'p.png' });

            expect(result.contentType).toBe('application/octet-stream');
        });

        it('wraps a not-found file as a failure', async () => {
            file.exists.mockResolvedValue([false]);

            await expect(adapter.downloadImage({ filename: 'missing.png' })).rejects.toThrow(
                'Failed to download image: File not found: missing.png',
            );
        });
    });
});
