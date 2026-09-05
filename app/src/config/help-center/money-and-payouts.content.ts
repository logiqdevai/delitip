import type { HelpCategory } from "@/interfaces/help-center.interfaces";
import { Routes } from "@/routes/routes";

export const MoneyAndPayoutsHelpCategory: HelpCategory = {
  slug: "money-and-payouts",
  title: "Money & Payouts",
  description:
    "Track every tip, connect a payout account, manage refunds, and understand your subscription.",
  icon: "Wallet",
  articles: [
    {
      slug: "reading-the-tips-ledger",
      title: "Reading the tips ledger",
      summary:
        "A real-time list of every customer tip, filterable by status and date, on Dashboard → Tips.",
      sections: [
        {
          paragraphs: [
            "Dashboard → Tips shows every tip your store has received, with the time, employee, QR code used, amount, payment provider, and status (Pending, Completed, Failed, or Refunded).",
            "Filter by status or date range to narrow the list. Use Export CSV to download the filtered ledger.",
          ],
          links: [{ label: "Dashboard → Tips", href: Routes.dashboard.tips }],
        },
      ],
      related: [{ category: "money-and-payouts", article: "understanding-a-tips-distribution-breakdown" }],
    },
    {
      slug: "understanding-a-tips-distribution-breakdown",
      title: "Understanding a tip's distribution breakdown",
      summary:
        "Open any tip to see exactly how it was split between recipients and each recipient's payout status.",
      sections: [
        {
          paragraphs: [
            "Click into any tip from the ledger to see its full record: amount, status, timestamps, the QR code and distribution rule used, payment provider reference, and the customer's name/email if they provided one.",
            "The distribution breakdown lists each recipient with their percentage, the resulting amount, and whether that portion has been paid out. If the customer left a review with the tip, it's linked here too.",
          ],
          links: [{ label: "Dashboard → Tips", href: Routes.dashboard.tips }],
        },
      ],
      related: [{ category: "collecting-tips", article: "setting-up-distribution-rules" }],
    },
    {
      slug: "connecting-your-store-payout-account",
      title: "Connecting your store payout account",
      summary:
        "Link a payout account so your store's share of tips can be paid out.",
      sections: [
        {
          paragraphs: [
            "Dashboard → Payments shows your store's payout account card and its connection status. Connecting an account is required before your store's share of distributed tips can be paid out.",
          ],
          links: [{ label: "Dashboard → Payments", href: Routes.dashboard.payments }],
        },
      ],
      related: [{ category: "money-and-payouts", article: "pending-distributions-explained" }],
    },
    {
      slug: "pending-distributions-explained",
      title: "Pending distributions explained",
      summary:
        "Distributed tip amounts that haven't been paid out yet, listed on Dashboard → Payments.",
      sections: [
        {
          paragraphs: [
            "The Pending Distributions panel on Dashboard → Payments shows amounts from completed tips that have been split according to a distribution rule but not yet paid out - for the store, for individual employees, or both.",
          ],
          links: [{ label: "Dashboard → Payments", href: Routes.dashboard.payments }],
        },
      ],
      related: [{ category: "money-and-payouts", article: "connecting-your-store-payout-account" }],
    },
    {
      slug: "handling-refund-requests",
      title: "Handling refund requests",
      summary:
        "Customers can request a refund from the tip page; managers approve, reject, or complete requests from the Refunds.",
      sections: [
        {
          paragraphs: [
            "A customer can request a refund directly from the Done step of the tip flow, with an optional reason. From a Dashboard tip's detail page, a manager can also request a refund on a completed tip that doesn't already have an active refund in progress.",
            "The Refunds on Dashboard → Payments lists every request, filterable by status: Pending, Approved, Rejected, or Completed. Refund history for a specific tip is always visible on that tip's detail page.",
          ],
          links: [{ label: "Dashboard → Payments", href: Routes.dashboard.payments }],
        },
      ],
      related: [{ category: "money-and-payouts", article: "reading-the-tips-ledger" }],
    },
    {
      slug: "employee-cash-out",
      title: "Employee cash out",
      summary:
        "Employees connect their own payout account from the Employee Portal to view and cash out their pending balance.",
      sections: [
        {
          paragraphs: [
            "From the Employee Portal, an employee can open Cash Out to connect a personal payout account and see their pending balance. Instant transfer isn't live yet - payouts follow the store's regular payout schedule.",
          ],
          links: [{ label: "Employee Portal", href: Routes.employee.root }],
        },
      ],
      related: [{ category: "employee-portal", article: "cashing-out-your-balance" }],
    },
    {
      slug: "managing-your-subscription",
      title: "Managing your subscription",
      summary:
        "View or change your plan, or cancel your subscription, from Settings → Billing (Owner only).",
      sections: [
        {
          paragraphs: [
            "Settings → Billing shows your current plan and lets an Owner change plans or cancel the subscription. No real payment provider is connected yet, so plan changes take effect immediately at no charge.",
            "Billing is Owner-only - managers and staff without the Owner role won't see this page's controls.",
          ],
          links: [{ label: "Settings → Billing", href: Routes.dashboard.settings.billing }],
        },
      ],
      related: [{ category: "team-management", article: "inviting-members-and-assigning-roles" }],
    },
  ],
};
