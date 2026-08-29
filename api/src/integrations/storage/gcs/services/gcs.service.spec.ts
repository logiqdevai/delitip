import { GcsService } from './gcs.service';

describe('GcsService', () => {
    let service: GcsService;
    let adapter: any;

    beforeEach(() => {
        adapter = {
            uploadImage: jest.fn(),
            deleteImage: jest.fn(),
            listImages: jest.fn(),
            getSignedUrl: jest.fn(),
            downloadImage: jest.fn(),
        };
        service = new GcsService(adapter);
    });

    describe('uploadImage', () => {
        it('returns the adapter result on success', async () => {
            const response = { url: 'https://x', filename: 'f', size: 1, contentType: 'image/png', bucket: 'b', path: 'p' };
            adapter.uploadImage.mockResolvedValue(response);

            const request = { file: Buffer.from('x'), filename: 'f', contentType: 'image/png' };
            await expect(service.uploadImage(request)).resolves.toBe(response);
            expect(adapter.uploadImage).toHaveBeenCalledWith(request);
        });

        it('wraps an adapter failure in a generic Error', async () => {
            adapter.uploadImage.mockRejectedValue(new Error('boom'));

            await expect(service.uploadImage({ file: Buffer.from('x'), filename: 'f', contentType: 'image/png' }))
                .rejects.toThrow('Failed to upload image: boom');
        });
    });

    describe('deleteImage', () => {
        it('returns the adapter result on success', async () => {
            const response = { success: true, filename: 'f' };
            adapter.deleteImage.mockResolvedValue(response);

            await expect(service.deleteImage({ filename: 'f' })).resolves.toBe(response);
        });

        it('wraps an adapter failure in a generic Error', async () => {
            adapter.deleteImage.mockRejectedValue(new Error('boom'));

            await expect(service.deleteImage({ filename: 'f' })).rejects.toThrow('Failed to delete image: boom');
        });
    });

    describe('listImages', () => {
        it('returns the adapter result on success', async () => {
            const response = { documents: [] };
            adapter.listImages.mockResolvedValue(response);

            await expect(service.listImages({ folder: 'x' })).resolves.toBe(response);
        });

        it('wraps an adapter failure in a generic Error', async () => {
            adapter.listImages.mockRejectedValue(new Error('boom'));

            await expect(service.listImages()).rejects.toThrow('Failed to list images: boom');
        });
    });

    describe('getSignedUrl', () => {
        it('returns the adapter result on success', async () => {
            adapter.getSignedUrl.mockResolvedValue('https://signed');

            await expect(service.getSignedUrl('f.png', 'avatars', 30)).resolves.toBe('https://signed');
            expect(adapter.getSignedUrl).toHaveBeenCalledWith('f.png', 'avatars', 30);
        });

        it('wraps an adapter failure in a generic Error', async () => {
            adapter.getSignedUrl.mockRejectedValue(new Error('boom'));

            await expect(service.getSignedUrl('f.png')).rejects.toThrow('Failed to get signed URL: boom');
        });
    });

    describe('downloadImage', () => {
        it('returns the adapter result on success', async () => {
            const response = { buffer: Buffer.from('x'), contentType: 'image/png' };
            adapter.downloadImage.mockResolvedValue(response);

            await expect(service.downloadImage({ filename: 'f' })).resolves.toBe(response);
        });

        it('wraps an adapter failure in a generic Error', async () => {
            adapter.downloadImage.mockRejectedValue(new Error('boom'));

            await expect(service.downloadImage({ filename: 'f' })).rejects.toThrow('Failed to download image: boom');
        });
    });

    describe('uploadImageFromBuffer', () => {
        it('builds a request from the buffer/filename/contentType/folder and delegates to uploadImage', async () => {
            const response = { url: 'https://x' } as any;
            adapter.uploadImage.mockResolvedValue(response);
            const buffer = Buffer.from('data');

            await expect(service.uploadImageFromBuffer(buffer, 'f.png', 'image/png', 'avatars')).resolves.toBe(response);
            expect(adapter.uploadImage).toHaveBeenCalledWith({
                file: buffer,
                filename: 'f.png',
                contentType: 'image/png',
                folder: 'avatars',
            });
        });
    });

    describe('uploadImageFromBase64', () => {
        it('decodes the base64 payload into a Buffer and delegates to uploadImageFromBuffer', async () => {
            const response = { url: 'https://x' } as any;
            adapter.uploadImage.mockResolvedValue(response);
            const base64 = Buffer.from('hello world').toString('base64');

            await expect(service.uploadImageFromBase64(base64, 'f.png', 'image/png')).resolves.toBe(response);
            const callArg = adapter.uploadImage.mock.calls[0][0];
            expect(callArg.file.toString('utf8')).toBe('hello world');
            expect(callArg.filename).toBe('f.png');
            expect(callArg.contentType).toBe('image/png');
        });
    });

    describe('uploadMultipleImages', () => {
        it('uploads every request in parallel and returns results in order', async () => {
            adapter.uploadImage
                .mockResolvedValueOnce({ filename: 'a' })
                .mockResolvedValueOnce({ filename: 'b' });

            const requests = [
                { file: Buffer.from('a'), filename: 'a', contentType: 'image/png' },
                { file: Buffer.from('b'), filename: 'b', contentType: 'image/png' },
            ];

            const result = await service.uploadMultipleImages(requests);

            expect(result).toEqual([{ filename: 'a' }, { filename: 'b' }]);
        });

        it('replaces a failed upload with null instead of failing the whole batch', async () => {
            adapter.uploadImage
                .mockResolvedValueOnce({ filename: 'a' })
                .mockRejectedValueOnce(new Error('boom'));

            const requests = [
                { file: Buffer.from('a'), filename: 'a', contentType: 'image/png' },
                { file: Buffer.from('b'), filename: 'b', contentType: 'image/png' },
            ];

            const result = await service.uploadMultipleImages(requests);

            expect(result).toEqual([{ filename: 'a' }, null]);
        });
    });
});
