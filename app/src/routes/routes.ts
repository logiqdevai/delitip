export const DASHBOARD_TAB_PARAM = "tab";

export const AccessTabs = {
  qrCodes: "qr-codes",
  distribution: "distribution",
} as const;

export const QR_EDITOR_SECTION_PARAM = "section";
export const QR_EDITOR_EMPLOYEE_PARAM = "employee";

export type AccessTab = (typeof AccessTabs)[keyof typeof AccessTabs];

export const TipsTabs = {
  ledger: "ledger",
  staffBalances: "staff-balances",
  payouts: "payouts",
} as const;

export type TipsTab = (typeof TipsTabs)[keyof typeof TipsTabs];

export const Routes = {
  home: "/",
  contact: "/contact",
  landing: {
    about: "/#about",
    features: "/#how-it-works",
    howItWorks: "/#how-it-works",
    ecosystem: "/#ecosystem",
    faq: "/#faq",
    calculator: "/#calculator",
    pricing: "/#pricing",
    getStarted: "/auth/sign-up",
  },
  auth: {
    sign_in: "/auth/sign-in",
    sign_up: "/auth/sign-up",
    forgot_password: "/auth/forgot-password",
    reset_password: "/auth/reset-password",
    accept_invite: "/auth/accept-invite",
  },
  onboarding: "/onboarding",
  tip: (storeSlug: string, code: string) =>
    `/${storeSlug}/q/${code}` as const,
  checkoutReturn: "/checkout/return",
  dashboard: {
    root: "/dashboard",
    gettingStarted: "/dashboard/getting-started",
    employees: "/dashboard/employees",
    employeeDetail: (employeeId: string) =>
      `/dashboard/employees/${employeeId}` as const,
    tips: "/dashboard/tips",
    tipsPayouts:
      `/dashboard/tips?${DASHBOARD_TAB_PARAM}=${TipsTabs.payouts}` as const,
    tipDetail: (tipId: string) => `/dashboard/tips/${tipId}` as const,
    reviews: "/dashboard/reviews",
    analytics: {
      root: "/dashboard/analytics",
      overview: "/dashboard/analytics/overview",
      tips: "/dashboard/analytics/tips",
      employees: "/dashboard/analytics/employees",
      stores: "/dashboard/analytics/stores",
      insights: "/dashboard/analytics/insights",
    },
    access: "/dashboard/access",
    accessQrNew: "/dashboard/access/qr/new",
    accessQrEdit: (id: string) => `/dashboard/access/qr/${id}` as const,
    accessQrNewForEmployee: (employeeId: string) =>
      `/dashboard/access/qr/new?${QR_EDITOR_EMPLOYEE_PARAM}=${employeeId}` as const,
    accessDistribution:
      `/dashboard/access?${DASHBOARD_TAB_PARAM}=${AccessTabs.distribution}` as const,
    alerts: "/dashboard/alerts",
    account: "/dashboard/account",
    admin: {
      root: "/dashboard/admin",
      users: "/dashboard/admin/users",
      payments: "/dashboard/admin/payments",
      paymentDetail: (id: string) =>
        `/dashboard/admin/payments/${id}` as const,
      payoutDetail: (id: string) => `/dashboard/admin/payouts/${id}` as const,
      payoutRequests: "/dashboard/admin/payout-requests",
      payoutRequestDetail: (id: string) =>
        `/dashboard/admin/payout-requests/${id}` as const,
      analytics: "/dashboard/admin/analytics",
      vatSimulator: "/dashboard/admin/vat-simulator",
      webhookEvents: "/dashboard/admin/webhook-events",
      changelog: "/dashboard/admin/changelog",
      appConfig: "/dashboard/admin/app-config",
    },
    settings: {
      root: "/dashboard/settings",
      profile: "/dashboard/settings/profile",
      stores: "/dashboard/settings/stores",
      branding: "/dashboard/settings/branding",
      tipping: "/dashboard/settings/tipping",
      localization: "/dashboard/settings/localization",
      reviewsFeedback: "/dashboard/settings/reviews-feedback",
      alerts: "/dashboard/settings/alerts",
      members: "/dashboard/settings/members",
      billing: "/dashboard/settings/billing",
      taxDetails: "/dashboard/settings/tax-details",
    },
  },
  employee: {
    root: "/employee",
    reviews: "/employee/reviews",
    qr: "/employee/qr",
    profile: "/employee/profile",
  },
  legal: {
    terms: "/legal/terms",
    privacy: "/legal/privacy",
  },
  help: {
    root: "/help",
    category: (categorySlug: string) => `/help/${categorySlug}` as const,
    article: (categorySlug: string, articleSlug: string) =>
      `/help/${categorySlug}/${articleSlug}` as const,
  },
} as const;
