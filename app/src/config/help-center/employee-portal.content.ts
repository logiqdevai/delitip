import type { HelpCategory } from "@/interfaces/help-center.interfaces";
import { Routes } from "@/routes/routes";

export const EmployeePortalHelpCategory: HelpCategory = {
  slug: "employee-portal",
  title: "Employee Portal",
  description:
    "What staff see when they sign in: their own earnings, reviews, and personal tip link.",
  icon: "UserCircle",
  articles: [
    {
      slug: "viewing-your-earnings-and-tips",
      title: "Viewing your earnings and tips",
      summary:
        "Your personal dashboard: pending balance, this month's tips, today's tips, and a 7-day earnings trend.",
      sections: [
        {
          paragraphs: [
            "Signing in with staff access takes you to your own Earnings & Tips page - a personal dashboard showing your pending cash-out balance, this month's tips, today's tip count and list, your average customer rating, a 7-day earnings trend chart, and recent feedback left for you.",
          ],
          links: [{ label: "Employee Portal", href: Routes.employee.root }],
        },
      ],
      related: [{ category: "employee-portal", article: "cashing-out-your-balance" }],
    },
    {
      slug: "cashing-out-your-balance",
      title: "Cashing out your balance",
      summary:
        "Connect a personal payout account to view and eventually withdraw your pending tips.",
      sections: [
        {
          paragraphs: [
            "From your Earnings & Tips page, open Cash Out to connect a personal payout account and see your pending balance. Instant transfer isn't available yet - payouts follow your store's regular payout schedule.",
          ],
          links: [{ label: "Employee Portal", href: Routes.employee.root }],
        },
      ],
      related: [{ category: "money-and-payouts", article: "employee-cash-out" }],
    },
    {
      slug: "your-reviews-and-badges",
      title: "Your reviews and badges",
      summary:
        "See your average rating, total review count, and recognition badges from customer comments.",
      sections: [
        {
          paragraphs: [
            "The Reviews & Badges page shows your average rating, total review count, and a recognition count (shown as \"Nx\") alongside a list of the customer comments and love notes left specifically for you.",
          ],
          links: [{ label: "Employee Portal → Reviews & Badges", href: Routes.employee.reviews }],
        },
      ],
    },
    {
      slug: "your-personal-qr-code-and-tip-link",
      title: "Your personal QR code and tip link",
      summary:
        "Preview your personal tip link - a manager still needs to create your actual QR code in Access.",
      sections: [
        {
          paragraphs: [
            "My QR & Link previews a personal tip QR code and lets you copy your tip link. This page is a preview only - your actual, live personal QR code has to be created by a manager from Dashboard → Access before it's usable at the point of service.",
          ],
          links: [
            { label: "Employee Portal → My QR & Link", href: Routes.employee.qr },
            { label: "Dashboard → Access", href: Routes.dashboard.access },
          ],
        },
      ],
      related: [{ category: "collecting-tips", article: "creating-and-managing-qr-codes" }],
    },
  ],
};
