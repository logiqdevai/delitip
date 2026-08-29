import { GcsFolders, DEFAULT_GCS_FOLDER } from './gcs-folders.config';

describe('gcs-folders.config', () => {
    it('exposes the expected folder keys with matching string values', () => {
        expect(GcsFolders).toEqual({
            documents: 'documents',
            avatars: 'avatars',
            uploads: 'uploads',
        });
    });

    it('has no duplicate folder values', () => {
        const values = Object.values(GcsFolders);
        expect(new Set(values).size).toBe(values.length);
    });

    it('defaults to the documents folder', () => {
        expect(DEFAULT_GCS_FOLDER).toBe(GcsFolders.documents);
        expect(DEFAULT_GCS_FOLDER).toBe('documents');
    });
});
