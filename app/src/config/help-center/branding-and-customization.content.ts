import type { HelpCategory } from "@/interfaces/help-center.interfaces";
import { Routes } from "@/routes/routes";

export const BrandingAndCustomizationHelpCategory: HelpCategory = {
  slug: "branding-and-customization",
  title: "Branding & Customization",
  description:
    "Make the tip page look like your store, in every language your guests speak.",
  icon: "Palette",
  articles: [
    {
      slug: "uploading-your-logo-and-cover-image",
      title: "Uploading your logo and cover image",
      summary:
        "Set the logo and cover image shown to customers on your public tip page.",
      sections: [
        {
          paragraphs: [
            "Settings → Branding is where you upload a logo and a cover image. Both appear on the public tip page whenever a customer scans one of your QR codes, so they immediately recognize your store.",
          ],
          links: [{ label: "Settings → Branding", href: Routes.dashboard.settings.branding }],
        },
      ],
      related: [{ category: "branding-and-customization", article: "setting-brand-colors" }],
    },
    {
      slug: "setting-brand-colors",
      title: "Setting brand colors",
      summary:
        "Choose primary and secondary colors that theme the customer-facing tip page.",
      sections: [
        {
          paragraphs: [
            "From Settings → Branding, choose a primary and secondary color. These colors theme the buttons, accents, and highlights customers see throughout the tip flow.",
          ],
          links: [{ label: "Settings → Branding", href: Routes.dashboard.settings.branding }],
        },
      ],
    },
    {
      slug: "writing-welcome-and-thank-you-messages",
      title: "Writing welcome and thank-you messages",
      summary:
        "Multilingual messages shown at the start and end of the customer tip flow.",
      sections: [
        {
          paragraphs: [
            "Settings → Branding also holds your welcome message (shown at the start of the tip flow) and thank-you message (shown after a customer tips). Both support multilingual input, so you can write the same message in every language your store supports.",
          ],
          links: [{ label: "Settings → Branding", href: Routes.dashboard.settings.branding }],
        },
      ],
      related: [
        { category: "collecting-tips", article: "the-customer-tip-page-walkthrough" },
        { category: "branding-and-customization", article: "supported-languages-and-localization" },
      ],
    },
    {
      slug: "business-profile-basics",
      title: "Business profile basics",
      summary:
        "Core details about your business — name, industry, and address — shown to customers and your team.",
      sections: [
        {
          paragraphs: [
            "Settings → Business Profile holds your business name, industry, and address (with address autocomplete, plus city, country, and postal code). These are the core details shown to both customers and your team, and were first set during onboarding.",
          ],
          links: [{ label: "Settings → Business Profile", href: Routes.dashboard.settings.profile }],
        },
      ],
    },
    {
      slug: "supported-languages-and-localization",
      title: "Supported languages and localization",
      summary:
        "Choose your primary editing language and which languages guests can view your tip page in.",
      sections: [
        {
          paragraphs: [
            "Settings → Localization has two settings: your primary language (the language you type branding text in by default) and your supported guest-facing languages (the languages customers can choose to view the tip page in).",
            "Any field marked as multilingual — like your welcome message or an employee's name — can hold a separate translation for each supported language.",
          ],
          links: [{ label: "Settings → Localization", href: Routes.dashboard.settings.localization }],
        },
      ],
      related: [{ category: "branding-and-customization", article: "writing-welcome-and-thank-you-messages" }],
    },
  ],
};
