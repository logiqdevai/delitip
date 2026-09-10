// Mirrors the frontend's QR_TEMPLATE_IDS (app/src/features/qr-templates/config/qr-templates.config.ts).
// Not a DB enum on purpose — the template registry is frontend-owned, so adding
// a template there and here needs no migration, just keeping this list in sync.
export const QR_TEMPLATE_IDS = ['classic-card', 'arched-band-card', 'cta-band-card'] as const;
export type QrTemplateId = (typeof QR_TEMPLATE_IDS)[number];
