import { type FC } from "react";
import { redirect } from "next/navigation";
import { Routes } from "@/routes/routes";

// The review redirect form now sits on the Reviews settings page — this route
// stays only so older links and bookmarks keep working.
const ReviewRedirectSettingsPage: FC = () => {
  redirect(Routes.dashboard.settings.reviewsFeedback);
};

export default ReviewRedirectSettingsPage;
