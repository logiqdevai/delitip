export const ApiRoutes = {
  health: {
    prefix: "/health",
  },
  auth: {
    email: {
      register: "/auth/email/register",
      login: "/auth/email/login",
      waitlist: "/auth/email/waitlist",
    },
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
  },
  users: {
    prefix: "/users",
    me: "/users/me",
    meAccounts: "/users/me/accounts",
    byId: (id: string) => `/users/${id}` as const,
    mePayoutAccount: "/users/me/payout-account",
    mePayoutAccountRefreshStatus: "/users/me/payout-account/refresh-status",
  },
  organizations: {
    prefix: "/organizations",
    byId: (id: string) => `/organizations/${id}` as const,
    members: (organizationId: string) =>
      `/organizations/${organizationId}/members` as const,
    member: (organizationId: string, memberId: string) =>
      `/organizations/${organizationId}/members/${memberId}` as const,
    stores: (organizationId: string) =>
      `/organizations/${organizationId}/stores` as const,
    subscription: (organizationId: string) =>
      `/organizations/${organizationId}/subscription` as const,
    subscriptionCancel: (organizationId: string) =>
      `/organizations/${organizationId}/subscription/cancel` as const,
    dashboard: {
      overview: (organizationId: string) =>
        `/organizations/${organizationId}/dashboard/overview` as const,
      trends: (organizationId: string) =>
        `/organizations/${organizationId}/dashboard/trends` as const,
      employeesPerformance: (organizationId: string) =>
        `/organizations/${organizationId}/dashboard/employees-performance` as const,
      storesPerformance: (organizationId: string) =>
        `/organizations/${organizationId}/dashboard/stores-performance` as const,
      experienceScore: (organizationId: string) =>
        `/organizations/${organizationId}/dashboard/experience-score` as const,
    },
  },
  stores: {
    byId: (id: string) => `/stores/${id}` as const,
    employees: (storeId: string) => `/stores/${storeId}/employees` as const,
    qrCodes: (storeId: string) => `/stores/${storeId}/qr-codes` as const,
    spots: (storeId: string) => `/stores/${storeId}/spots` as const,
    distributionRules: (storeId: string) =>
      `/stores/${storeId}/distribution-rules` as const,
    defaultDistributionRule: (storeId: string) =>
      `/stores/${storeId}/default-distribution-rule` as const,
    tips: (storeId: string) => `/stores/${storeId}/tips` as const,
    reviews: (storeId: string) => `/stores/${storeId}/reviews` as const,
    reviewCategories: (storeId: string) =>
      `/stores/${storeId}/review-categories` as const,
    reviewCategory: (storeId: string, id: string) =>
      `/stores/${storeId}/review-categories/${id}` as const,
    reviewTags: (storeId: string) => `/stores/${storeId}/review-tags` as const,
    reviewTag: (storeId: string, id: string) =>
      `/stores/${storeId}/review-tags/${id}` as const,
    feedbackQuestions: (storeId: string) =>
      `/stores/${storeId}/feedback-questions` as const,
    feedbackQuestion: (storeId: string, id: string) =>
      `/stores/${storeId}/feedback-questions/${id}` as const,
    refunds: (storeId: string) => `/stores/${storeId}/refunds` as const,
    payoutAccount: (storeId: string) =>
      `/stores/${storeId}/payout-account` as const,
    payoutAccountRefreshStatus: (storeId: string) =>
      `/stores/${storeId}/payout-account/refresh-status` as const,
    payouts: (storeId: string) => `/stores/${storeId}/payouts` as const,
    payoutsRun: (storeId: string) =>
      `/stores/${storeId}/payouts/run` as const,
    alerts: (storeId: string) => `/stores/${storeId}/alerts` as const,
    alertsReadAll: (storeId: string) =>
      `/stores/${storeId}/alerts/read-all` as const,
    alertPreferences: (storeId: string) =>
      `/stores/${storeId}/alert-preferences` as const,
    alertPreference: (storeId: string, alertType: string) =>
      `/stores/${storeId}/alert-preferences/${alertType}` as const,
    analyticsTips: (storeId: string) =>
      `/stores/${storeId}/analytics/tips` as const,
    insights: (storeId: string) => `/stores/${storeId}/insights` as const,
    insightsGenerate: (storeId: string) =>
      `/stores/${storeId}/insights/generate` as const,
  },
  employees: {
    byId: (id: string) => `/employees/${id}` as const,
    dashboard: (id: string) => `/employees/${id}/dashboard` as const,
    tips: (id: string) => `/employees/${id}/tips` as const,
    reviews: (id: string) => `/employees/${id}/reviews` as const,
    payouts: (id: string) => `/employees/${id}/payouts` as const,
    payoutAccount: (id: string) => `/employees/${id}/payout-account` as const,
    payoutAccountRefreshStatus: (id: string) =>
      `/employees/${id}/payout-account/refresh-status` as const,
  },
  qrCodes: {
    byId: (id: string) => `/qr-codes/${id}` as const,
    stats: (id: string) => `/qr-codes/${id}/stats` as const,
  },
  spots: {
    byId: (id: string) => `/spots/${id}` as const,
  },
  distributionRules: {
    byId: (id: string) => `/distribution-rules/${id}` as const,
  },
  tips: {
    byId: (id: string) => `/tips/${id}` as const,
  },
  reviews: {
    byId: (id: string) => `/reviews/${id}` as const,
  },
  refunds: {
    prefix: "/refunds",
    byId: (id: string) => `/refunds/${id}` as const,
  },
  alerts: {
    markRead: (id: string) => `/alerts/${id}/read` as const,
  },
  documents: {
    prefix: "/documents",
    me: "/documents/me",
    byId: (id: string) => `/documents/${id}` as const,
  },
  public: {
    qr: (code: string) => `/public/qr/${code}` as const,
    tips: "/public/tips",
    tipStatus: (id: string) => `/public/tips/${id}/status` as const,
    tipByOrderCode: (orderCode: string) =>
      `/public/tips/by-order-code/${orderCode}` as const,
    tipRefundRequest: (tipId: string) =>
      `/public/tips/${tipId}/refund-request` as const,
    store: (slug: string) => `/public/stores/${slug}` as const,
    storeReviewConfig: (slug: string) =>
      `/public/stores/${slug}/review-config` as const,
    reviews: "/public/reviews",
  },
  googleMaps: {
    timezone: "/google-maps/timezone",
  },
} as const;
