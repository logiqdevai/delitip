import type { HelpCategory } from "@/interfaces/help-center.interfaces";
import { Routes } from "@/routes/routes";

export const NotificationsHelpCategory: HelpCategory = {
  slug: "notifications",
  title: "Notifications",
  description:
    "Stay on top of performance changes and customer feedback without checking every page.",
  icon: "Bell",
  articles: [
    {
      slug: "understanding-the-alerts-inbox",
      title: "Understanding the Alerts inbox",
      summary:
        "An in-app feed of performance changes and feedback events, filterable and markable as read.",
      sections: [
        {
          paragraphs: [
            "Dashboard → Alerts is an in-app notification feed covering performance changes and customer feedback events. Filter by type or by read/unread status, and mark alerts as read individually or all at once.",
          ],
          links: [{ label: "Dashboard → Alerts", href: Routes.dashboard.alerts }],
        },
      ],
      related: [{ category: "notifications", article: "configuring-alert-preferences" }],
    },
    {
      slug: "configuring-alert-preferences",
      title: "Configuring alert preferences",
      summary:
        "Choose which automatic alert types are allowed to populate your Alerts inbox.",
      sections: [
        {
          paragraphs: [
            "Settings → Alert Preferences lets you choose which automatic alert types are generated at all. Turning a type off here means it will no longer appear in the Alerts inbox.",
          ],
          links: [{ label: "Settings → Alert Preferences", href: Routes.dashboard.settings.alerts }],
        },
      ],
      related: [{ category: "notifications", article: "understanding-the-alerts-inbox" }],
    },
  ],
};
