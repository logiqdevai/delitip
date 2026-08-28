export const Routes = {
  home: "/",
  contact: "/contact",
  landing: {
    features: "/#how-it-works",
    howItWorks: "/#how-it-works",
    ecosystem: "/#ecosystem",
    calculator: "/#calculator",
    pricing: "/#pricing",
    demo: "/#demo",
    getStarted: "/auth/sign-up",
  },
  auth: {
    sign_in: "/auth/sign-in",
    sign_up: "/auth/sign-up",
    forgot_password: "/auth/forgot-password",
  },
  legal: {
    terms: "/legal/terms",
    privacy: "/legal/privacy",
  },
} as const;
