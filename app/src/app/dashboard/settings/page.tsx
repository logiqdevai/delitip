import { type FC } from "react";
import { DashboardPageHeader } from "../components/dashboard-shared";
import { BusinessProfileSettingsForm } from "./components/business-profile-settings-form";
import { BrandingSettingsForm } from "./components/branding-settings-form";
import { TippingConfigSettingsForm } from "./components/tipping-config-settings-form";
import { ReviewRedirectSettingsForm } from "./components/review-redirect-settings-form";
import { AlertPreferencesForm } from "./components/alert-preferences-form";
import { MembersSettingsPanel } from "./components/members-settings-panel";
import { ReviewsFeedbackSettingsPanel } from "./components/reviews-feedback-settings-panel";
import { BillingSettingsPanel } from "./components/billing-settings-panel";
import { LocalizationSettingsForm } from "./components/localization-settings-form";

const SettingsPage: FC = () => {
  return (
    <>
      <DashboardPageHeader
        title="Settings"
        description="Manage business profile, bank account connections, and preferences."
      />

      <BusinessProfileSettingsForm />
      <BrandingSettingsForm />
      <TippingConfigSettingsForm />
      <LocalizationSettingsForm />
      <ReviewRedirectSettingsForm />
      <ReviewsFeedbackSettingsPanel />
      <AlertPreferencesForm />
      <MembersSettingsPanel />
      <BillingSettingsPanel />
    </>
  );
};

export default SettingsPage;
