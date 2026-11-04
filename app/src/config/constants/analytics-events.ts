// Event names are snake_case "object_action". Keep this the single catalog —
// trackEvent() only accepts values from here.
export const AnalyticsEvents = {
  // Acquisition & auth
  signUpCompleted: "sign_up",
  loginCompleted: "login",
  logoutCompleted: "logout",
  passwordResetRequested: "password_reset_requested",
  passwordResetCompleted: "password_reset_completed",
  passwordChanged: "password_changed",
  inviteAccepted: "invite_accepted",
  onboardingCompleted: "onboarding_completed",
  contactFormSubmitted: "contact_form_submitted",
  ctaClicked: "cta_clicked",

  // Public tip flow
  tipPageViewed: "tip_page_viewed",
  tipAmountSelected: "tip_amount_selected",
  tipRecipientsSelected: "tip_recipients_selected",
  tipCheckoutStarted: "tip_checkout_started",
  tipCompleted: "tip_completed",
  tipFailed: "tip_failed",
  reviewSubmitted: "review_submitted",
  refundRequestSubmitted: "refund_request_submitted",

  // Account & organization
  profileUpdated: "profile_updated",
  accountDeleted: "account_deleted",
  organizationCreated: "organization_created",
  organizationUpdated: "organization_updated",
  memberAdded: "member_added",
  memberUpdated: "member_updated",
  memberRemoved: "member_removed",
  subscriptionPlanChanged: "subscription_plan_changed",
  subscriptionCancelled: "subscription_cancelled",
  documentUploaded: "document_uploaded",
  documentDeleted: "document_deleted",

  // Stores, staff & QR
  storeCreated: "store_created",
  storeUpdated: "store_updated",
  storeDeleted: "store_deleted",
  employeeCreated: "employee_created",
  employeeUpdated: "employee_updated",
  employeeInviteResent: "employee_invite_resent",
  employeeDeleted: "employee_deleted",
  spotCreated: "spot_created",
  spotUpdated: "spot_updated",
  spotDeleted: "spot_deleted",
  qrCodeCreated: "qr_code_created",
  qrCodeUpdated: "qr_code_updated",
  qrCodeDeleted: "qr_code_deleted",
  qrTemplateSaved: "qr_template_saved",
  qrTemplateReset: "qr_template_reset",

  // Tip distribution & money movement
  distributionRuleCreated: "distribution_rule_created",
  distributionRuleUpdated: "distribution_rule_updated",
  distributionRuleDeleted: "distribution_rule_deleted",
  distributionRuleSetDefault: "distribution_rule_set_default",
  payoutAccountCreated: "payout_account_created",
  payoutAccountStatusRefreshed: "payout_account_status_refreshed",
  payoutRequestCreated: "payout_request_created",
  payoutRequestCancelled: "payout_request_cancelled",
  payoutsRun: "payouts_run",
  settlementCreated: "settlement_created",
  settlementReversed: "settlement_reversed",
  settlementConfirmed: "settlement_confirmed",
  refundCreated: "refund_created",
  refundUpdated: "refund_updated",
  tipsExported: "tips_exported",
  settlementsExported: "settlements_exported",

  // Reviews, feedback & alerts
  reviewUpdated: "review_updated",
  reviewDeleted: "review_deleted",
  reviewConfigChanged: "review_config_changed",
  alertRead: "alert_read",
  alertsAllRead: "alerts_all_read",
  alertPreferenceUpdated: "alert_preference_updated",
  insightGenerated: "insight_generated",

  // Platform admin
  appConfigUpdated: "app_config_updated",
  adminPayoutRequestApproved: "admin_payout_request_approved",
  adminPayoutRequestRejected: "admin_payout_request_rejected",
  adminPayoutRequestRechecked: "admin_payout_request_rechecked",
  adminManualPayoutsRun: "admin_manual_payouts_run",
  adminPaymentsReconciled: "admin_payments_reconciled",
  adminPayoutAccountsReconciled: "admin_payout_accounts_reconciled",
} as const;

export type AnalyticsEvent =
  (typeof AnalyticsEvents)[keyof typeof AnalyticsEvents];
