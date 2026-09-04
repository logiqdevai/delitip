import { z } from 'zod';

const EnvSchema = z.object({
    NODE_ENV: z.enum(['local', 'development', 'test', 'staging', 'production']),
    PORT: z.coerce.number().default(3000),
    APP_URL: z.string().url().optional(),
    LANDING_URL: z.string().url().optional(),
    API_URL: z.string().url().optional(),
    DATABASE_URL: z.string().url(),
    REDIS_URL: z.string().optional(),
    CACHE_TTL_SECONDS: z.coerce.number().optional(),
    JWT_SECRET: z.string(),
    JWT_EXPIRATION_TIME: z.string().optional(),
    RESEND_API_KEY: z.string().optional(),
    SMTP_HOST: z.string().optional(),
    SMTP_PORT: z.coerce.number().optional(),
    SMTP_USER: z.string().optional(),
    SMTP_PASSWORD: z.string().optional(),
    SMTP_SECURE: z.enum(['true', 'false']).optional(),
    SMTP_FROM: z.string().optional(),
    SMTP_FROM_NAME: z.string().optional(),
    TWILIO_ACCOUNT_SID: z.string().optional(),
    TWILIO_AUTH_TOKEN: z.string().optional(),
    GOOGLE_MAPS_API_KEY: z.string().optional(),
    GCS_PROJECT_ID: z.string().optional(),
    GCS_BUCKET_NAME: z.string().optional(),
    GCS_CREDENTIALS_JSON_BASE64: z.string().optional(),
    GCS_CREDENTIALS: z.string().optional(),
    STRIPE_PUBLISHABLE_KEY: z.string().optional(),
    STRIPE_SECRET_KEY: z.string().optional(),
    STRIPE_WEBHOOK_SECRET: z.string().optional(),
    OPENAI_API_KEY: z.string().optional(),
    BULL_BOARD_USER: z.string().optional(),
    BULL_BOARD_PASSWORD: z.string().optional(),
    VIVA_ENVIRONMENT: z.enum(['demo', 'production']).optional(),
    VIVA_CLIENT_ID: z.string().optional(),
    VIVA_CLIENT_SECRET: z.string().optional(),
    VIVA_ACCOUNT_TRANSACTIONS_CLIENT_ID: z.string().optional(),
    VIVA_ACCOUNT_TRANSACTIONS_CLIENT_SECRET: z.string().optional(),
    VIVA_PLATFORM_CLIENT_ID: z.string().optional(),
    VIVA_PLATFORM_CLIENT_SECRET: z.string().optional(),
    VIVA_MARKETPLACE_PARTNER_NAME: z.string().optional(),
    VIVA_MARKETPLACE_LOGO_URL: z.string().optional(),
    VIVA_MERCHANT_ID: z.string().optional(),
    VIVA_API_KEY: z.string().optional(),
    VIVA_SOURCE_CODE: z.string().optional(),
    VIVA_WALLET_ID: z.coerce.number().optional(),
    VIVA_WEBHOOK_IP_ALLOWLIST: z.string().optional(),
    TIP_PLATFORM_COMMISSION_PERCENTAGE: z.coerce.number().optional(),
    TIP_PROCESSOR_FEE_ESTIMATE_PERCENTAGE: z.coerce.number().optional(),
    TIP_PROCESSOR_FEE_ESTIMATE_FIXED_AMOUNT: z.coerce.number().optional(),
    PAYOUT_HOLD_WINDOW_HOURS: z.coerce.number().optional(),
    CONNECTED_ACCOUNT_PAYOUTS_ENABLED: z.enum(['true', 'false']).optional(),
});

export function validateEnv(config: Record<string, unknown>) {
    const parsed = EnvSchema.safeParse(config);

    if (!parsed.success) {
        console.error(parsed.error.format());
        throw new Error('Invalid environment variables');
    }

    return parsed.data;
}

export type EnvConfig = z.infer<typeof EnvSchema>;
