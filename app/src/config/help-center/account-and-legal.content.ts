import type { HelpCategory } from "@/interfaces/help-center.interfaces";
import { Routes } from "@/routes/routes";

export const AccountAndLegalHelpCategory: HelpCategory = {
  slug: "account-and-legal",
  title: "Account & Legal",
  description:
    "Your personal login details, plus where to find our Terms of Service and Privacy Policy.",
  icon: "ShieldCheck",
  articles: [
    {
      slug: "managing-your-account-details",
      title: "Managing your account details",
      summary:
        "Update your personal name and phone number from Dashboard → Account. Email is read-only.",
      sections: [
        {
          paragraphs: [
            "Dashboard → Account holds your personal login profile: first name, last name, and phone number. Your email address is read-only here — contact support if you need it changed.",
          ],
          links: [{ label: "Dashboard → Account", href: Routes.dashboard.account }],
        },
      ],
    },
    {
      slug: "terms-of-service-and-privacy-policy",
      title: "Terms of Service and Privacy Policy",
      summary:
        "Where to find Delitip's legal documents, and how to reach us with questions.",
      sections: [
        {
          paragraphs: [
            "Our Terms of Service and Privacy Policy are always available from the site footer, or directly at /legal/terms and /legal/privacy. If you have questions about either, our Contact page is the fastest way to reach us.",
          ],
          links: [
            { label: "Terms of Service", href: Routes.legal.terms },
            { label: "Privacy Policy", href: Routes.legal.privacy },
            { label: "Contact us", href: Routes.contact },
          ],
        },
      ],
    },
  ],
};
