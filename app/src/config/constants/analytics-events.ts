export const AnalyticsEvents = {
  signUpCompleted: "sign_up",
  loginCompleted: "login",
  logoutCompleted: "logout",
  passwordResetRequested: "password_reset_requested",
  onboardingCompleted: "onboarding_completed",
  contactFormSubmitted: "contact_form_submitted",
  ctaClicked: "cta_clicked",
  tipPageViewed: "tip_page_viewed",
  tipAmountSelected: "tip_amount_selected",
  tipRecipientsSelected: "tip_recipients_selected",
  tipCheckoutStarted: "tip_checkout_started",
  tipCompleted: "tip_completed",
  tipFailed: "tip_failed",
  reviewSubmitted: "review_submitted",
} as const;

export type AnalyticsEvent =
  (typeof AnalyticsEvents)[keyof typeof AnalyticsEvents];
