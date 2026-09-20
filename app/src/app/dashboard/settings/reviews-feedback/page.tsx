import { type FC } from "react";
import { ReviewRedirectSettingsForm } from "./components/review-redirect-settings-form";
import { ReviewsFeedbackSettingsPanel } from "./components/reviews-feedback-settings-panel";

const ReviewsFeedbackSettingsPage: FC = () => {
  return (
    <div className="space-y-4">
      <ReviewsFeedbackSettingsPanel />
      <ReviewRedirectSettingsForm />
    </div>
  );
};

export default ReviewsFeedbackSettingsPage;
