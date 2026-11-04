"use client";

import { type FC } from "react";
import { useTranslations } from "next-intl";
import { ColorPicker } from "@/components/ui/color-picker";
import { Label } from "@/components/ui/label";
import { MultilingualTextarea } from "@/components/ui/multilingual-textarea";
import type { Language } from "@/features/stores/interfaces/stores.interfaces";

export const DEFAULT_PRIMARY_COLOR = "#84cc16";
export const DEFAULT_SECONDARY_COLOR = "#18181b";

interface BrandingColorFieldsProps {
  primary: string;
  secondary: string;
  onPrimaryChange: (value: string) => void;
  onSecondaryChange: (value: string) => void;
  primaryError?: string;
  secondaryError?: string;
}

export const BrandingColorFields: FC<BrandingColorFieldsProps> = ({
  primary,
  secondary,
  onPrimaryChange,
  onSecondaryChange,
  primaryError,
  secondaryError,
}) => {
  const t = useTranslations("dashboard.settings.branding");

  return (
    <div className="grid grid-cols-1 gap-4 @md:grid-cols-2">
      <ColorPicker
        id="primary-color"
        label={t("primaryColor")}
        value={primary}
        defaultValue={DEFAULT_PRIMARY_COLOR}
        placeholder={DEFAULT_PRIMARY_COLOR}
        onChange={onPrimaryChange}
        error={primaryError}
      />
      <ColorPicker
        id="secondary-color"
        label={t("secondaryColor")}
        value={secondary}
        defaultValue={DEFAULT_SECONDARY_COLOR}
        placeholder={DEFAULT_SECONDARY_COLOR}
        onChange={onSecondaryChange}
        error={secondaryError}
      />
    </div>
  );
};

interface BrandingMessageFieldsProps {
  storeId: string;
  storeName: string;
  languages: Language[];
  primaryLanguage: Language;
  welcome: Record<string, string>;
  thankYou: Record<string, string>;
  onWelcomeChange: (value: Record<string, string>) => void;
  onThankYouChange: (value: Record<string, string>) => void;
}

export const BrandingMessageFields: FC<BrandingMessageFieldsProps> = ({
  storeId,
  storeName,
  languages,
  primaryLanguage,
  welcome,
  thankYou,
  onWelcomeChange,
  onThankYouChange,
}) => {
  const t = useTranslations("dashboard.settings.branding");

  return (
    <>
      <div className="space-y-1.5">
        <Label htmlFor="welcome-message">{t("welcomeMessage")}</Label>
        <MultilingualTextarea
          id="welcome-message"
          storeId={storeId}
          rows={2}
          languages={languages}
          primaryLanguage={primaryLanguage}
          value={welcome}
          onValueChange={onWelcomeChange}
          placeholder={t("welcomePlaceholder", { storeName })}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="thank-you-message">{t("thankYouMessage")}</Label>
        <MultilingualTextarea
          id="thank-you-message"
          storeId={storeId}
          rows={2}
          languages={languages}
          primaryLanguage={primaryLanguage}
          value={thankYou}
          onValueChange={onThankYouChange}
          placeholder={t("thankYouPlaceholder")}
        />
      </div>
    </>
  );
};
