import {
  getQrCodeEmployeeIds,
  getQrCodeSpotIds,
  QrCodeSelectionModes,
  type QrCode,
} from "@/features/qr-codes/interfaces/qr-codes.interfaces";
import {
  DEFAULT_PRIMARY_COLOR,
  DEFAULT_SECONDARY_COLOR,
} from "@/app/dashboard/settings/branding/components/branding-fields";
import type {
  Store,
  UpdateStorePayload,
} from "@/features/stores/interfaces/stores.interfaces";
import type {
  QrEditorFormValues,
  QrEditorStoreValues,
} from "@/app/dashboard/access/qr/validation-schemas/qr-editor.schema";

const DEFAULT_REVIEW_THRESHOLD = 4;

export function buildEditorDefaults(
  store: Store,
  qr: QrCode | null,
  defaultEmployeeIds: string[] = [],
): QrEditorFormValues {
  return {
    qr: qr
      ? {
          label: qr.label,
          selection_mode: qr.selection_mode,
          employee_ids: getQrCodeEmployeeIds(qr),
          spot_ids: getQrCodeSpotIds(qr),
          distribution_rule_id: qr.distribution_rule_id ?? "",
          is_active: qr.is_active,
        }
      : {
          label: "",
          selection_mode: QrCodeSelectionModes.CHOOSE_ONE,
          employee_ids: defaultEmployeeIds,
          spot_ids: [],
          distribution_rule_id: "",
          is_active: true,
        },
    store: {
      primary_color: store.primary_color?.trim() || DEFAULT_PRIMARY_COLOR,
      secondary_color: store.secondary_color?.trim() || DEFAULT_SECONDARY_COLOR,
      welcome_message: store.welcome_message ?? {},
      thank_you_message: store.thank_you_message ?? {},
      suggested_tip_amounts: store.suggested_tip_amounts.map((amount) =>
        String(amount / 100),
      ),
      allow_custom_tip_amount: store.allow_custom_tip_amount,
      default_distribution_rule_id: store.default_distribution_rule_id ?? "",
      primary_language: store.primary_language,
      supported_languages: store.supported_languages.length
        ? store.supported_languages
        : [store.primary_language],
      public_review_redirect_url: store.public_review_redirect_url ?? "",
      public_review_rating_threshold:
        store.public_review_rating_threshold ?? DEFAULT_REVIEW_THRESHOLD,
    },
  };
}

/** Parses the draft preset strings (major units) into valid minor-unit amounts. */
export function parseTipAmounts(values: string[]): number[] {
  return values
    .map((value) => Math.round(Number.parseFloat(value) * 100))
    .filter((value) => Number.isFinite(value) && value > 0);
}

export function buildStorePayload(
  values: QrEditorStoreValues,
): UpdateStorePayload {
  const supported = values.supported_languages.includes(values.primary_language)
    ? values.supported_languages
    : [...values.supported_languages, values.primary_language];

  return {
    primary_color: values.primary_color,
    secondary_color: values.secondary_color,
    welcome_message_translations: values.welcome_message,
    thank_you_message_translations: values.thank_you_message,
    suggested_tip_amounts: parseTipAmounts(values.suggested_tip_amounts),
    allow_custom_tip_amount: values.allow_custom_tip_amount,
    primary_language: values.primary_language,
    supported_languages: supported,
    public_review_redirect_url:
      values.public_review_redirect_url.trim() || undefined,
    public_review_rating_threshold: values.public_review_rating_threshold,
    ...(values.default_distribution_rule_id
      ? { default_distribution_rule_id: values.default_distribution_rule_id }
      : {}),
  };
}
