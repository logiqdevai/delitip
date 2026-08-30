import type { HelpCategory } from "@/interfaces/help-center.interfaces";
import { Routes } from "@/routes/routes";

export const CollectingTipsHelpCategory: HelpCategory = {
  slug: "collecting-tips",
  title: "Collecting Tips",
  description:
    "Set up QR codes, spots, and distribution rules that control how customers tip and how it's split.",
  icon: "QrCode",
  articles: [
    {
      slug: "creating-and-managing-qr-codes",
      title: "Creating and managing QR codes",
      summary:
        "Each QR code produces a tip link and controls who a customer can tip and how the amount is split.",
      sections: [
        {
          paragraphs: [
            "Go to Dashboard → Access to create a QR code. Give it a label, toggle it active or inactive, choose a selection mode, and assign the employees it covers.",
            "A QR code can optionally be attached to a Spot (a table, room, or counter) and can override the store's default Distribution Rule with a rule of its own. Every QR code resolves to a printable/copyable tip link in the form /{store-slug}/q/{code}.",
          ],
          links: [{ label: "Dashboard → Access", href: Routes.dashboard.access }],
        },
      ],
      related: [
        { category: "collecting-tips", article: "choosing-a-selection-mode" },
        { category: "collecting-tips", article: "setting-up-distribution-rules" },
        { category: "collecting-tips", article: "using-spots" },
      ],
    },
    {
      slug: "choosing-a-selection-mode",
      title: "Choosing a selection mode",
      summary:
        "Selection mode decides whether a customer tips one employee, several, or the whole team via a QR code.",
      sections: [
        {
          paragraphs: [
            "Every QR code has a selection mode that controls the first step of the customer tip flow:",
          ],
          list: [
            "Choose One — the customer picks a single employee to tip",
            "Choose Many — the customer can select several employees to split a tip between",
            "Team — the tip goes to the whole team assigned to that QR code, no individual selection needed",
          ],
        },
        {
          paragraphs: [
            "If a QR code is assigned to only one employee, or is a store-only QR with no employees, the selection step is skipped entirely and the customer goes straight to entering an amount.",
          ],
        },
      ],
      related: [{ category: "collecting-tips", article: "the-customer-tip-page-walkthrough" }],
    },
    {
      slug: "using-spots",
      title: "Using spots",
      summary:
        "Spots represent physical locations — tables, rooms, or counters — that can be attached to QR codes.",
      sections: [
        {
          paragraphs: [
            "Spots let you label where a QR code is placed, such as \"Table 4\" or \"Front Counter.\" Manage them from the Spots panel inside Dashboard → Access.",
            "A spot can be renamed, toggled active or inactive without deleting it, or deleted outright. Deactivating a spot is useful when a table or area is temporarily out of service but you don't want to lose its history or QR assignment.",
          ],
          links: [{ label: "Dashboard → Access", href: Routes.dashboard.access }],
        },
      ],
      related: [{ category: "collecting-tips", article: "creating-and-managing-qr-codes" }],
    },
    {
      slug: "setting-up-distribution-rules",
      title: "Setting up distribution rules",
      summary:
        "Distribution rules define named percentage splits between employees and the business — they must always total 100%.",
      sections: [
        {
          paragraphs: [
            "From Dashboard → Distribution, create a named rule with one or more recipients — each recipient is either a specific employee or the business/house account — and a percentage for each. The percentages across a rule must add up to 100%.",
            "One rule can be marked as the store's default, used by any QR code that doesn't specify its own override. A rule that's currently the default, in use by a QR code, or already referenced by past tips can't be deleted.",
            "Changing a distribution rule only affects future tips — it never retroactively changes how an already-completed tip was split.",
          ],
          links: [{ label: "Dashboard → Distribution", href: Routes.dashboard.distribution }],
        },
      ],
      related: [
        { category: "money-and-payouts", article: "understanding-a-tips-distribution-breakdown" },
      ],
    },
    {
      slug: "tipping-presets-and-custom-amounts",
      title: "Tipping presets and custom amounts",
      summary:
        "Configure up to six suggested tip amounts and choose whether customers can also enter their own amount.",
      sections: [
        {
          paragraphs: [
            "Settings → Tipping lets you define up to six preset amounts customers see as quick-tap buttons on the tip page, and a toggle for whether a custom amount field is also shown.",
            "This same page is where you pick the store's default Distribution Rule — a shortcut into the Distribution feature rather than a separate setting.",
          ],
          links: [{ label: "Settings → Tipping", href: Routes.dashboard.settings.tipping }],
        },
      ],
      related: [{ category: "collecting-tips", article: "setting-up-distribution-rules" }],
    },
    {
      slug: "the-customer-tip-page-walkthrough",
      title: "The customer tip page, step by step",
      summary:
        "What a guest sees after scanning a QR code — no login required, from choosing a recipient to leaving a review.",
      sections: [
        {
          paragraphs: [
            "Scanning a QR code opens a public tip page at /{store-slug}/q/{code}. No customer account or login is required at any step.",
          ],
          list: [
            "Select recipient — shown only when the QR's selection mode requires a choice; store branding (logo, colors, welcome message) is shown throughout",
            "Amount — tap a preset or enter a custom amount, if allowed",
            "Payment — confirm and pay, with an optional email for a receipt",
            "Thank you — your store's custom thank-you message",
            "Review — an optional 1–5 star rating with a comment",
            "Done — final confirmation, with an option to leave a public review (if the rating met your review-redirect threshold), request a refund, or leave another tip",
          ],
        },
      ],
      related: [
        { category: "branding-and-customization", article: "writing-welcome-and-thank-you-messages" },
        { category: "reviews-and-feedback", article: "setting-the-review-redirect-threshold" },
        { category: "money-and-payouts", article: "handling-refund-requests" },
      ],
    },
  ],
};
