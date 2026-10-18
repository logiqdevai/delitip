"use client";

import { type FC } from "react";
import { Controller } from "react-hook-form";
import { SectionCard } from "@/app/dashboard/access/qr/components/sections/section-card";
import { useQrEditor } from "@/app/dashboard/access/qr/hooks/use-qr-editor";
import {
  BrandingColorFields,
  BrandingMessageFields,
} from "@/app/dashboard/settings/branding/components/branding-fields";
import { BrandingImagePickers } from "@/app/dashboard/settings/branding/components/branding-image-pickers";
import { QrEditorSections } from "@/config/constants/dropdowns/qr-codes/qr-editor-section.options";

export const AppearanceSection: FC = () => {
  const { form, store } = useQrEditor();
  const {
    control,
    watch,
    formState: { errors },
  } = form;

  const primaryLanguage = watch("store.primary_language");
  const supportedLanguages = watch("store.supported_languages");
  const fieldLanguages = supportedLanguages.length
    ? supportedLanguages
    : [primaryLanguage];

  return (
    <SectionCard section={QrEditorSections.APPEARANCE}>
      <div className="space-y-2">
        <BrandingImagePickers store={store} />
        <p className="text-[11px] text-zinc-400">
          Logo and cover are saved as soon as you upload them.
        </p>
      </div>

      <Controller
        control={control}
        name="store.primary_color"
        render={({ field: primary }) => (
          <Controller
            control={control}
            name="store.secondary_color"
            render={({ field: secondary }) => (
              <BrandingColorFields
                primary={primary.value}
                secondary={secondary.value}
                onPrimaryChange={primary.onChange}
                onSecondaryChange={secondary.onChange}
                primaryError={errors.store?.primary_color?.message}
                secondaryError={errors.store?.secondary_color?.message}
              />
            )}
          />
        )}
      />

      <Controller
        control={control}
        name="store.welcome_message"
        render={({ field: welcome }) => (
          <Controller
            control={control}
            name="store.thank_you_message"
            render={({ field: thankYou }) => (
              <BrandingMessageFields
                storeId={store.id}
                storeName={store.name}
                languages={fieldLanguages}
                primaryLanguage={primaryLanguage}
                welcome={welcome.value}
                thankYou={thankYou.value}
                onWelcomeChange={welcome.onChange}
                onThankYouChange={thankYou.onChange}
              />
            )}
          />
        )}
      />
    </SectionCard>
  );
};
