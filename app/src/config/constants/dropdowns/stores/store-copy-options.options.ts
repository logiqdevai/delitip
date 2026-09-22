import {
  StoreCopyOptions,
  type StoreCopyOption,
} from "@/features/stores/interfaces/stores.interfaces";

export const StoreCopyFormOptions: {
  id: StoreCopyOption;
  label: string;
  description: string;
}[] = [
  {
    id: StoreCopyOptions.BRANDING,
    label: "Branding",
    description: "Logo, cover image and colors",
  },
  {
    id: StoreCopyOptions.MESSAGES,
    label: "Customer messages",
    description: "Welcome and thank-you messages",
  },
  {
    id: StoreCopyOptions.LOCALIZATION,
    label: "Localization",
    description: "Languages, currency and timezone",
  },
  {
    id: StoreCopyOptions.TIPPING,
    label: "Tipping",
    description: "Suggested amounts, custom amounts and VAT",
  },
  {
    id: StoreCopyOptions.REVIEWS,
    label: "Reviews & feedback",
    description: "Categories, tags, questions and rating threshold",
  },
  {
    id: StoreCopyOptions.QR_DESIGNS,
    label: "QR designs",
    description: "Customized QR code templates",
  },
];
