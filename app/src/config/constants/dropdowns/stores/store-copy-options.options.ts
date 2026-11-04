import {
  StoreCopyOptions,
  type StoreCopyOption,
} from "@/features/stores/interfaces/stores.interfaces";

export const StoreCopyFormOptions: {
  id: StoreCopyOption;
  labelKey: string;
  descriptionKey: string;
}[] = [
  {
    id: StoreCopyOptions.BRANDING,
    labelKey: "dashboard.enums.storeCopyOption.BRANDING",
    descriptionKey: "dashboard.enums.storeCopyOptionDescription.BRANDING",
  },
  {
    id: StoreCopyOptions.MESSAGES,
    labelKey: "dashboard.enums.storeCopyOption.MESSAGES",
    descriptionKey: "dashboard.enums.storeCopyOptionDescription.MESSAGES",
  },
  {
    id: StoreCopyOptions.LOCALIZATION,
    labelKey: "dashboard.enums.storeCopyOption.LOCALIZATION",
    descriptionKey: "dashboard.enums.storeCopyOptionDescription.LOCALIZATION",
  },
  {
    id: StoreCopyOptions.TIPPING,
    labelKey: "dashboard.enums.storeCopyOption.TIPPING",
    descriptionKey: "dashboard.enums.storeCopyOptionDescription.TIPPING",
  },
  {
    id: StoreCopyOptions.REVIEWS,
    labelKey: "dashboard.enums.storeCopyOption.REVIEWS",
    descriptionKey: "dashboard.enums.storeCopyOptionDescription.REVIEWS",
  },
  {
    id: StoreCopyOptions.QR_DESIGNS,
    labelKey: "dashboard.enums.storeCopyOption.QR_DESIGNS",
    descriptionKey: "dashboard.enums.storeCopyOptionDescription.QR_DESIGNS",
  },
];
