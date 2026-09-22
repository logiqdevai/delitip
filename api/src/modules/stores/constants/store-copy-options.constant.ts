// Groups of settings that can be copied from an existing store in the same
// Organization when creating a new one. Venue-specific data (address, staff,
// distribution rules, spots/QR codes, payout account, public review link) is
// never copied.
export const StoreCopyOptions = {
    BRANDING: 'BRANDING', // logo, cover image, primary/secondary colors
    MESSAGES: 'MESSAGES', // welcome + thank-you messages
    LOCALIZATION: 'LOCALIZATION', // languages, currency, timezone
    TIPPING: 'TIPPING', // suggested amounts, custom amount toggle, VAT rate
    REVIEWS: 'REVIEWS', // review categories, tags, feedback questions, rating threshold
    ALERTS: 'ALERTS', // alert preferences
    QR_DESIGNS: 'QR_DESIGNS', // QR template customizations
} as const;

export type StoreCopyOption = (typeof StoreCopyOptions)[keyof typeof StoreCopyOptions];
