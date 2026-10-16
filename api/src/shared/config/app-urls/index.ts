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
    // Admin review page for an invoice-backed payout request.
    adminPayoutRequest: (requestId: string) =>
        `${process.env.APP_URL}/dashboard/admin/payout-requests/${encodeURIComponent(requestId)}`,
    // Where a Store sees its own payout requests (Tips → Payouts tab).
    storePayouts: `${process.env.APP_URL}/dashboard/tips?tab=payouts`,
} as const;

export const ApiUrls = {
    api_url: process.env.API_URL,
} as const;