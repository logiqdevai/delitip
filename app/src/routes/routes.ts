export const Routes = {
  home: "/",
  contact: "/contact",
  landing: {
    features: "/#how-it-works",
    howItWorks: "/#how-it-works",
    ecosystem: "/#ecosystem",
    calculator: "/#calculator",
    pricing: "/#pricing",
    demo: "/client",
    getStarted: "/auth/sign-up",
  },
  auth: {
    sign_in: "/auth/sign-in",
    sign_up: "/auth/sign-up",
    forgot_password: "/auth/forgot-password",
    reset_password: "/auth/reset-password",
  },
  onboarding: "/onboarding",
  tip: (storeSlug: string, code: string) =>
    `/${storeSlug}/q/${code}` as const,
  dashboard: {
    root: "/dashboard",
    employees: "/dashboard/employees",
    employeeDetail: (employeeId: string) =>
      `/dashboard/employees/${employeeId}` as const,
    tips: "/dashboard/tips",
    tipDetail: (tipId: string) => `/dashboard/tips/${tipId}` as const,
    reviews: "/dashboard/reviews",
    distribution: "/dashboard/distribution",
    analytics: "/dashboard/analytics",
    access: "/dashboard/access",
    alerts: "/dashboard/alerts",
    payments: "/dashboard/payments",
    settings: "/dashboard/settings",
  },
  employee: {
    root: "/employee",
    reviews: "/employee/reviews",
    qr: "/employee/qr",
  },
  client: {
    root: "/client",
  },
  legal: {
    terms: "/legal/terms",
    privacy: "/legal/privacy",
  },
} as const;
