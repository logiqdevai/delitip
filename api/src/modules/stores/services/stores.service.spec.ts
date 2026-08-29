import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AuthRole, Language, OrganizationRole } from 'generated/prisma';
import { StoresService } from './stores.service';

describe('StoresService', () => {
    let service: StoresService;
    let prisma: any;
    let accessControl: any;

    const user = { id: 'u1', role: AuthRole.USER };

    beforeEach(() => {
        prisma = {
            store: { findUnique: jest.fn(), findMany: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn() },
            distributionRule: { findFirst: jest.fn() },
        };
        accessControl = {
            assertOrgAccess: jest.fn(),
            assertStoreAccess: jest.fn(),
            getAccessibleStoreIds: jest.fn(),
        };
        service = new StoresService(prisma, accessControl);
    });

    describe('create', () => {
        it('asserts OWNER-only org access, generates a unique slug, and creates the store', async () => {
            prisma.store.findUnique.mockResolvedValue(null); // slug is available on first try
            prisma.store.create.mockResolvedValue({ id: 's1', slug: 'my-diner' });

            const result = await service.create(user, 'org1', { name: 'My Diner' } as any);

            expect(accessControl.assertOrgAccess).toHaveBeenCalledWith(user, 'org1', [OrganizationRole.OWNER]);
            expect(prisma.store.create).toHaveBeenCalledWith({
                data: expect.objectContaining({ organization_id: 'org1', name: 'My Diner', slug: 'my-diner' }),
            });
            expect(result).toEqual({ id: 's1', slug: 'my-diner' });
        });

        it('appends a numeric suffix when the base slug is already taken', async () => {
            prisma.store.findUnique
                .mockResolvedValueOnce({ id: 'existing' }) // 'my-diner' taken
                .mockResolvedValueOnce(null); // 'my-diner-1' free
            prisma.store.create.mockResolvedValue({ id: 's1', slug: 'my-diner-1' });

            await service.create(user, 'org1', { name: 'My Diner' } as any);

            expect(prisma.store.create).toHaveBeenCalledWith({
                data: expect.objectContaining({ slug: 'my-diner-1' }),
            });
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

        it('runs welcome_message/thank_you_message through autoTranslateStub using the store\'s existing translations and languages', async () => {
            prisma.store.findUnique.mockResolvedValue({
                id: 's1',
                primary_language: Language.EN,
                supported_languages: [Language.EN, Language.EL],
                welcome_message: { en: 'Old welcome' },
                thank_you_message: null,
            });
            prisma.store.update.mockResolvedValue({});

            await service.update(user, 's1', { welcome_message: 'New welcome', thank_you_message: 'Thanks!' } as any);

            expect(prisma.store.update).toHaveBeenCalledWith({
                where: { id: 's1' },
                data: {
                    welcome_message: { en: 'New welcome', el: 'New welcome' },
                    thank_you_message: { en: 'Thanks!', el: 'Thanks!' },
                },
            });
        });
    });

    describe('updateTranslation', () => {
        it('throws BadRequestException for an unsupported field before checking access', async () => {
            await expect(
                service.updateTranslation(user, 's1', 'not_a_field', { language: 'EN', text: 'x' } as any),
            ).rejects.toThrow(BadRequestException);
            expect(accessControl.assertStoreAccess).not.toHaveBeenCalled();
        });

        it('throws NotFoundException when the store does not exist', async () => {
            prisma.store.findUnique.mockResolvedValue(null);

            await expect(
                service.updateTranslation(user, 's1', 'welcome_message', { language: 'EN', text: 'x' } as any),
            ).rejects.toThrow(NotFoundException);
        });

        it('merges the single language into the existing translation map, lowercasing the language key', async () => {
            prisma.store.findUnique.mockResolvedValue({ id: 's1', welcome_message: { en: 'Hi' } });
            prisma.store.update.mockResolvedValue({});

            await service.updateTranslation(user, 's1', 'welcome_message', { language: 'EL', text: 'Γεια' } as any);

            expect(prisma.store.update).toHaveBeenCalledWith({
                where: { id: 's1' },
                data: { welcome_message: { en: 'Hi', el: 'Γεια' } },
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
