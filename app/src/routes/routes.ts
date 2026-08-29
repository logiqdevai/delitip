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
  },
  dashboard: {
    root: "/dashboard",
    employees: "/dashboard/employees",
    tips: "/dashboard/tips",
    reviews: "/dashboard/reviews",
    distribution: "/dashboard/distribution",
    analytics: "/dashboard/analytics",
    access: "/dashboard/access",
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
