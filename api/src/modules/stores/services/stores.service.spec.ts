import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AuthRole, Language, OrganizationRole, Prisma, StoreIndustry } from 'generated/prisma';
import { StoresService } from './stores.service';
import { StoreCopyOptions } from '../constants/store-copy-options.constant';

function slugConflictError() {
    return new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        clientVersion: '7.0.0',
        meta: { target: ['slug'] },
    });
}

describe('StoresService', () => {
    let service: StoresService;
    let prisma: any;
    let accessControl: any;
    let documentsService: any;

    const user = { id: 'u1', role: AuthRole.USER };

    beforeEach(() => {
        prisma = {
            store: { findUnique: jest.fn(), findFirst: jest.fn(), findMany: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn() },
            distributionRule: { findFirst: jest.fn(), create: jest.fn().mockResolvedValue({ id: 'rule1' }) },
            distributionRuleRecipient: { createMany: jest.fn() },
            spot: { create: jest.fn().mockResolvedValue({ id: 'spot1' }) },
            qrCode: { findUnique: jest.fn().mockResolvedValue(null), create: jest.fn().mockResolvedValue({ id: 'qr1' }) },
            qrCodeSpot: { create: jest.fn() },
            reviewCategory: { createMany: jest.fn() },
            feedbackQuestion: { createMany: jest.fn() },
            reviewTag: { createMany: jest.fn() },
            alertPreference: { createMany: jest.fn() },
            qrTemplateCustomization: { createMany: jest.fn() },
            $transaction: jest.fn((fn) => fn(prisma)),
        };
        accessControl = {
            assertOrgAccess: jest.fn(),
            assertStoreAccess: jest.fn(),
            getAccessibleStoreIds: jest.fn(),
        };
        documentsService = {
            duplicate: jest.fn(),
            removeById: jest.fn().mockResolvedValue({ success: true }),
        };
        service = new StoresService(prisma, accessControl, documentsService);
    });

    describe('create', () => {
        it('asserts OWNER-only org access, generates a unique slug, and creates the store', async () => {
            prisma.store.findUnique.mockResolvedValue(null); // slug is available on first try
            prisma.store.create.mockResolvedValue({ id: 's1', slug: 'my-diner', industry: StoreIndustry.RESTAURANT, primary_language: Language.EN });
            prisma.store.update.mockResolvedValue({ id: 's1', slug: 'my-diner', industry: StoreIndustry.RESTAURANT, primary_language: Language.EN, default_distribution_rule_id: 'rule1' });

            const result = await service.create(user, 'org1', { name: 'My Diner', industry: StoreIndustry.RESTAURANT } as any);

            expect(accessControl.assertOrgAccess).toHaveBeenCalledWith(user, 'org1', [OrganizationRole.OWNER]);
            expect(prisma.store.create).toHaveBeenCalledWith({
                data: expect.objectContaining({ organization_id: 'org1', name: 'My Diner', slug: 'my-diner' }),
            });
            expect(prisma.store.update).toHaveBeenCalledWith({
                where: { id: 's1' },
                data: { default_distribution_rule_id: 'rule1' },
            });
            expect(result).toEqual({ id: 's1', slug: 'my-diner', industry: StoreIndustry.RESTAURANT, primary_language: Language.EN, default_distribution_rule_id: 'rule1' });
        });

        it('appends a numeric suffix when the base slug is already taken', async () => {
            prisma.store.findUnique
                .mockResolvedValueOnce({ id: 'existing' }) // 'my-diner' taken
                .mockResolvedValueOnce(null); // 'my-diner-1' free
            prisma.store.create.mockResolvedValue({ id: 's1', slug: 'my-diner-1', industry: StoreIndustry.RESTAURANT, primary_language: Language.EN });

            await service.create(user, 'org1', { name: 'My Diner', industry: StoreIndustry.RESTAURANT } as any);

            expect(prisma.store.create).toHaveBeenCalledWith({
                data: expect.objectContaining({ slug: 'my-diner-1' }),
            });
        });

        it('retries the whole transaction with a fresh slug when two requests race to insert the same slug', async () => {
            prisma.store.findUnique.mockResolvedValueOnce(null).mockResolvedValueOnce({ id: 'existing' });
            prisma.store.create
                .mockRejectedValueOnce(slugConflictError())
                .mockResolvedValueOnce({ id: 's1', slug: 'my-diner-1', industry: StoreIndustry.RESTAURANT, primary_language: Language.EN });
            prisma.store.update.mockResolvedValue({ id: 's1', slug: 'my-diner-1', industry: StoreIndustry.RESTAURANT, primary_language: Language.EN, default_distribution_rule_id: 'rule1' });

            const result = await service.create(user, 'org1', { name: 'My Diner', industry: StoreIndustry.RESTAURANT } as any);

            expect(prisma.store.create).toHaveBeenNthCalledWith(1, {
                data: expect.objectContaining({ slug: 'my-diner' }),
            });
            expect(prisma.store.create).toHaveBeenNthCalledWith(2, {
                data: expect.objectContaining({ slug: 'my-diner-1' }),
            });
            expect(result).toEqual({ id: 's1', slug: 'my-diner-1', industry: StoreIndustry.RESTAURANT, primary_language: Language.EN, default_distribution_rule_id: 'rule1' });
        });

        it('seeds the default review categories, feedback questions, and tags for the store industry', async () => {
            prisma.store.findUnique.mockResolvedValue(null);
            prisma.store.create.mockResolvedValue({ id: 's1', slug: 'my-diner', industry: StoreIndustry.RESTAURANT, primary_language: Language.EN });

            await service.create(user, 'org1', { name: 'My Diner', industry: StoreIndustry.RESTAURANT } as any);

            expect(prisma.reviewCategory.createMany).toHaveBeenCalledWith({
                data: expect.arrayContaining([expect.objectContaining({ store_id: 's1' })]),
            });
            expect(prisma.feedbackQuestion.createMany).toHaveBeenCalledWith({
                data: expect.arrayContaining([expect.objectContaining({ store_id: 's1' })]),
            });
            expect(prisma.reviewTag.createMany).toHaveBeenCalledWith({
                data: expect.arrayContaining([expect.objectContaining({ store_id: 's1', name: expect.any(String) })]),
            });
        });
    });

    describe('create with copy options', () => {
        const sourceStore = {
            id: 'src1',
            organization_id: 'org1',
            primary_color: '#111111',
            secondary_color: '#222222',
            logo_document_id: 'logo-src',
            cover_document_id: null,
            welcome_message: { en: 'Welcome!' },
            thank_you_message: null,
            primary_language: Language.EL,
            supported_languages: [Language.EL, Language.EN],
            currency: 'EUR',
            timezone: 'Europe/Athens',
            suggested_tip_amounts: [100, 300],
            allow_custom_tip_amount: false,
            vat_rate_percentage: null,
            public_review_rating_threshold: 5,
            review_categories: [{ name: { en: 'Service' }, is_active: true, sort_order: 0 }],
            review_tags: [{ name: 'Friendly', sentiment: 'POSITIVE', is_active: true }],
            feedback_questions: [{ question: { en: 'How was it?' }, type: 'RATING', is_active: false, sort_order: 2 }],
            alert_preferences: [{ alert_type: 'NEGATIVE_REVIEW', is_enabled: false }],
            qr_template_customizations: [{ template_id: 't1', canvas: { w: 1 }, elements: [] }],
        };

        beforeEach(() => {
            prisma.store.findUnique.mockResolvedValue(null);
            prisma.store.create.mockResolvedValue({ id: 's2', slug: 'branch', industry: StoreIndustry.RESTAURANT, primary_language: Language.EL });
            prisma.store.update.mockResolvedValue({ id: 's2' });
        });

        it('rejects a source store outside the organization', async () => {
            prisma.store.findFirst.mockResolvedValue(null);

            await expect(
                service.create(user, 'org1', {
                    name: 'Branch',
                    industry: StoreIndustry.RESTAURANT,
                    copy_from_store_id: 'other',
                    copy_options: [StoreCopyOptions.TIPPING],
                } as any),
            ).rejects.toThrow(BadRequestException);
            expect(prisma.store.findFirst).toHaveBeenCalledWith(
                expect.objectContaining({ where: { id: 'other', organization_id: 'org1' } }),
            );
            expect(prisma.store.create).not.toHaveBeenCalled();
        });

        it('copies only the selected store fields, duplicating the logo instead of sharing it', async () => {
            prisma.store.findFirst.mockResolvedValue(sourceStore);
            documentsService.duplicate.mockResolvedValue({ id: 'logo-copy' });

            await service.create(user, 'org1', {
                name: 'Branch',
                industry: StoreIndustry.RESTAURANT,
                currency: 'USD',
                copy_from_store_id: 'src1',
                copy_options: [StoreCopyOptions.BRANDING, StoreCopyOptions.TIPPING],
            } as any);

            expect(documentsService.duplicate).toHaveBeenCalledWith('logo-src', 'u1');
            const data = prisma.store.create.mock.calls[0][0].data;
            expect(data).toMatchObject({
                primary_color: '#111111',
                logo_document_id: 'logo-copy',
                cover_document_id: null,
                suggested_tip_amounts: [100, 300],
                allow_custom_tip_amount: false,
                currency: 'USD', // LOCALIZATION not selected, so the request's own value stays
            });
            expect(data).not.toHaveProperty('welcome_message');
            expect(data).not.toHaveProperty('copy_options');
            expect(data).not.toHaveProperty('copy_from_store_id');
            // REVIEWS not selected, so industry defaults are seeded as usual
            expect(prisma.reviewCategory.createMany).toHaveBeenCalledWith({
                data: expect.arrayContaining([expect.objectContaining({ store_id: 's2' })]),
            });
            expect(prisma.alertPreference.createMany).not.toHaveBeenCalled();
        });

        it('copies review config, alert preferences and QR designs instead of seeding industry defaults', async () => {
            prisma.store.findFirst.mockResolvedValue(sourceStore);

            await service.create(user, 'org1', {
                name: 'Branch',
                industry: StoreIndustry.RESTAURANT,
                copy_from_store_id: 'src1',
                copy_options: [StoreCopyOptions.REVIEWS, StoreCopyOptions.ALERTS, StoreCopyOptions.QR_DESIGNS],
            } as any);

            expect(prisma.store.create.mock.calls[0][0].data).toMatchObject({ public_review_rating_threshold: 5 });
            expect(prisma.reviewCategory.createMany).toHaveBeenCalledTimes(1);
            expect(prisma.reviewCategory.createMany).toHaveBeenCalledWith({
                data: [{ store_id: 's2', name: { en: 'Service' }, is_active: true, sort_order: 0 }],
            });
            expect(prisma.reviewTag.createMany).toHaveBeenCalledWith({
                data: [{ store_id: 's2', name: 'Friendly', sentiment: 'POSITIVE', is_active: true }],
            });
            expect(prisma.feedbackQuestion.createMany).toHaveBeenCalledWith({
                data: [{ store_id: 's2', question: { en: 'How was it?' }, type: 'RATING', is_active: false, sort_order: 2 }],
            });
            expect(prisma.alertPreference.createMany).toHaveBeenCalledWith({
                data: [{ store_id: 's2', alert_type: 'NEGATIVE_REVIEW', is_enabled: false }],
            });
            expect(prisma.qrTemplateCustomization.createMany).toHaveBeenCalledWith({
                data: [{ store_id: 's2', template_id: 't1', canvas: { w: 1 }, elements: [] }],
            });
            expect(documentsService.duplicate).not.toHaveBeenCalled();
        });

        it('removes the duplicated documents when creating the store fails', async () => {
            prisma.store.findFirst.mockResolvedValue(sourceStore);
            documentsService.duplicate.mockResolvedValue({ id: 'logo-copy' });
            prisma.store.create.mockRejectedValue(new Error('db down'));

            await expect(
                service.create(user, 'org1', {
                    name: 'Branch',
                    industry: StoreIndustry.RESTAURANT,
                    copy_from_store_id: 'src1',
                    copy_options: [StoreCopyOptions.BRANDING],
                } as any),
            ).rejects.toThrow('db down');
            expect(documentsService.removeById).toHaveBeenCalledWith('logo-copy');
        });
    });

    describe('findAllForOrg', () => {
        it('asserts org access, resolves accessible store ids, and lists only those stores', async () => {
            accessControl.getAccessibleStoreIds.mockResolvedValue(['s1', 's2']);
            prisma.store.findMany.mockResolvedValue([{ id: 's1' }, { id: 's2' }]);

            const result = await service.findAllForOrg(user, 'org1');

            expect(accessControl.assertOrgAccess).toHaveBeenCalledWith(user, 'org1');
            expect(accessControl.getAccessibleStoreIds).toHaveBeenCalledWith(user, 'org1');
            expect(prisma.store.findMany).toHaveBeenCalledWith({
                where: { id: { in: ['s1', 's2'] } },
                include: { logo_document: true },
                orderBy: { created_at: 'desc' },
            });
            expect(result).toEqual([{ id: 's1' }, { id: 's2' }]);
        });
    });

    describe('findOne', () => {
        it('throws NotFoundException when the store does not exist', async () => {
            prisma.store.findUnique.mockResolvedValue(null);

            await expect(service.findOne(user, 's1')).rejects.toThrow(NotFoundException);
            expect(accessControl.assertStoreAccess).toHaveBeenCalledWith(user, 's1');
        });

        it('returns the store with its logo/cover documents included', async () => {
            const store = { id: 's1' };
            prisma.store.findUnique.mockResolvedValue(store);

            await expect(service.findOne(user, 's1')).resolves.toBe(store);
            expect(prisma.store.findUnique).toHaveBeenCalledWith({
                where: { id: 's1' },
                include: { logo_document: true, cover_document: true },
            });
        });
    });

    describe('update', () => {
        it('asserts OWNER/STORE_MANAGER access and throws NotFoundException when the store does not exist', async () => {
            prisma.store.findUnique.mockResolvedValue(null);

            await expect(service.update(user, 's1', {} as any)).rejects.toThrow(NotFoundException);
            expect(accessControl.assertStoreAccess).toHaveBeenCalledWith(user, 's1', [
                OrganizationRole.OWNER,
                OrganizationRole.STORE_MANAGER,
            ]);
        });

        it('throws BadRequestException when default_distribution_rule_id does not belong to the store', async () => {
            prisma.store.findUnique.mockResolvedValue({ id: 's1' });
            prisma.distributionRule.findFirst.mockResolvedValue(null);

            await expect(
                service.update(user, 's1', { default_distribution_rule_id: 'rule1' } as any),
            ).rejects.toThrow(BadRequestException);
            expect(prisma.store.update).not.toHaveBeenCalled();
        });

        it('passes non-translatable fields straight through to the update', async () => {
            prisma.store.findUnique.mockResolvedValue({ id: 's1', primary_language: Language.EN, supported_languages: [Language.EN] });
            prisma.store.update.mockResolvedValue({ id: 's1', name: 'New name' });

            await service.update(user, 's1', { name: 'New name' } as any);

            expect(prisma.store.update).toHaveBeenCalledWith({ where: { id: 's1' }, data: { name: 'New name' } });
        });

        it('merges welcome_message_translations/thank_you_message_translations into the existing maps, lowercasing keys and dropping blanks', async () => {
            prisma.store.findUnique.mockResolvedValue({
                id: 's1',
                primary_language: Language.EN,
                supported_languages: [Language.EN, Language.EL],
                welcome_message: { en: 'Old welcome' },
                thank_you_message: null,
            });
            prisma.store.update.mockResolvedValue({});

            await service.update(user, 's1', {
                welcome_message_translations: { en: 'New welcome', EL: 'Νέο μήνυμα', de: '  ' },
                thank_you_message_translations: { en: 'Thanks!' },
            } as any);

            expect(prisma.store.update).toHaveBeenCalledWith({
                where: { id: 's1' },
                data: {
                    welcome_message: { en: 'New welcome', el: 'Νέο μήνυμα' },
                    thank_you_message: { en: 'Thanks!' },
                },
            });
        });
    });

    describe('remove', () => {
        it('asserts OWNER-only access, deletes, and returns success', async () => {
            prisma.store.delete.mockResolvedValue({});

            const result = await service.remove(user, 's1');

            expect(accessControl.assertStoreAccess).toHaveBeenCalledWith(user, 's1', [OrganizationRole.OWNER]);
            expect(prisma.store.delete).toHaveBeenCalledWith({ where: { id: 's1' } });
            expect(result).toEqual({ success: true });
        });
    });

    describe('findPublicBySlug', () => {
        const buildStore = (overrides: Partial<any> = {}) => ({
            id: 's1',
            name: 'Diner',
            slug: 'diner',
            industry: 'RESTAURANT',
            is_active: true,
            logo_document: null,
            cover_document: null,
            primary_color: '#000',
            secondary_color: '#fff',
            welcome_message: { en: 'Welcome' },
            thank_you_message: { en: 'Thanks' },
            address_line: 'Main St',
            city: 'Athens',
            country: 'GR',
            postal_code: '11111',
            currency: 'EUR',
            suggested_tip_amounts: [100, 200],
            allow_custom_tip_amount: true,
            primary_language: Language.EN,
            supported_languages: [Language.EN],
            public_review_rating_threshold: 4,
            ...overrides,
        });

        it('throws NotFoundException when no store matches the slug', async () => {
            prisma.store.findUnique.mockResolvedValue(null);

            await expect(service.findPublicBySlug('nope')).rejects.toThrow(NotFoundException);
        });

        it('throws NotFoundException when the store is inactive', async () => {
            prisma.store.findUnique.mockResolvedValue(buildStore({ is_active: false }));

            await expect(service.findPublicBySlug('diner')).rejects.toThrow(NotFoundException);
        });

        it('returns the public shape with resolved translations and null-coalesced logo/cover urls', async () => {
            prisma.store.findUnique.mockResolvedValue(buildStore());

            const result = await service.findPublicBySlug('diner', 'en');

            expect(result).toMatchObject({
                id: 's1',
                slug: 'diner',
                logo_url: null,
                cover_url: null,
                welcome_message: 'Welcome',
                thank_you_message: 'Thanks',
            });
        });

        it('resolves a photo/cover url when the document relation is present', async () => {
            prisma.store.findUnique.mockResolvedValue(
                buildStore({
                    logo_document: { url: 'https://example.com/logo.png' },
                    cover_document: { url: 'https://example.com/cover.png' },
                }),
            );

            const result = await service.findPublicBySlug('diner');

            expect(result.logo_url).toBe('https://example.com/logo.png');
            expect(result.cover_url).toBe('https://example.com/cover.png');
        });
    });
});
