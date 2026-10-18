"use client";

import { type FC } from "react";
import { Controller } from "react-hook-form";
import { SectionCard } from "@/app/dashboard/access/qr/components/sections/section-card";
import { useQrEditor } from "@/app/dashboard/access/qr/hooks/use-qr-editor";
import { ReviewRedirectFields } from "@/app/dashboard/settings/reviews-feedback/components/review-redirect-fields";
import { ReviewsFeedbackSettingsPanel } from "@/app/dashboard/settings/reviews-feedback/components/reviews-feedback-settings-panel";
import { QrEditorSections } from "@/config/constants/dropdowns/qr-codes/qr-editor-section.options";

export const ReviewsSection: FC = () => {
  const { form } = useQrEditor();
  const {
    control,
    formState: { errors },
  } = form;

  return (
    <div className="space-y-4">
      {/* Categories, questions and tags save on their own, as in Settings. */}
      <ReviewsFeedbackSettingsPanel />
      <SectionCard section={QrEditorSections.REVIEWS}>
        <p className="text-xs text-zinc-500">
          Customers who rate you at or above this threshold are prompted to
          share feedback on an external site such as Google.
        </p>

        <Controller
          control={control}
          name="store.public_review_rating_threshold"
          render={({ field: threshold }) => (
            <Controller
              control={control}
              name="store.public_review_redirect_url"
              render={({ field: redirectUrl }) => (
                <ReviewRedirectFields
                  threshold={threshold.value}
                  onThresholdChange={threshold.onChange}
                  redirectUrl={redirectUrl.value}
                  onRedirectUrlChange={redirectUrl.onChange}
                  urlError={errors.store?.public_review_redirect_url?.message}
                />
              )}
            />
          )}
        />
      </SectionCard>
    </div>
  );
};
