export const AppUrls = {
    billing: `${process.env.APP_URL}/dashboard/billing/account`,
    resetPassword: (token: string) =>
        `${process.env.APP_URL}/auth/reset-password?token=${encodeURIComponent(token)}`,
    employeeInvite: (token: string) =>
        `${process.env.APP_URL}/auth/accept-invite?token=${encodeURIComponent(token)}`,
    // Where a connected-account payout provider (Viva Marketplace today)
    // redirects the store owner after they finish hosted onboarding.
    payoutAccountOnboardingReturn: (storeId: string) =>
        `${process.env.APP_URL}/dashboard/payments/onboarding-return?storeId=${encodeURIComponent(storeId)}`,
} as const;

export const ApiUrls = {
    api_url: process.env.API_URL,
} as const;