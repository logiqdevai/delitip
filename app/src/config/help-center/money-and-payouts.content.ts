import type { HelpCategory } from "@/interfaces/help-center.interfaces";
import { Routes } from "@/routes/routes";

export const MoneyAndPayoutsHelpCategory: HelpCategory = {
  slug: "money-and-payouts",
  title: "Money & Payouts",
  description:
    "Track every tip, connect a payout account, pay staff yourself, manage refunds, and understand your subscription.",
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
            "Dashboard → Tips → Payments shows your store's payout account card and its connection status. Connecting an account is required before your store's share of distributed tips can be paid out.",
          ],
          links: [
            {
              label: "Dashboard → Tips → Payments",
              href: Routes.dashboard.tipsPayments,
            },
          ],
        },
      ],
      related: [{ category: "money-and-payouts", article: "pending-distributions-explained" }],
    },
    {
      slug: "pending-distributions-explained",
      title: "Pending distributions explained",
      summary:
        "Distributed tip amounts that haven't been paid out yet, listed on Dashboard → Tips → Payments.",
      sections: [
        {
          paragraphs: [
            "The Pending Distributions panel on Dashboard → Tips → Payments shows amounts from completed tips that have been split according to a distribution rule but not yet paid out - for the store, for individual employees, or both.",
            "A share earned under a rule set to \"Send everything to the business\" is paid out to your business account rather than to the employee, so one transfer can cover your own share plus what you're holding for staff. The payout preview and your payout history both break out which part is which.",
          ],
          links: [
            {
              label: "Dashboard → Tips → Payments",
              href: Routes.dashboard.tipsPayments,
            },
          ],
        },
      ],
      related: [{ category: "money-and-payouts", article: "connecting-your-store-payout-account" }],
    },
    {
      slug: "paying-your-staff-yourself",
      title: "Paying your staff yourself",
      summary:
        "Collect every tip into your business account and hand staff their share directly, with Delitip keeping the record of what's owed.",
      sections: [
        {
          paragraphs: [
            "If you'd rather pay your team yourself - cash at the end of a shift, a bank transfer, or through payroll - set a distribution rule to \"Send everything to the business\". Every tip under that rule is paid out to your business account in a single transfer, including the part each employee earned.",
            "Nothing about the split changes. The rule's percentages still decide what each employee earned; that amount simply becomes what you owe them instead of a transfer we send on your behalf. Employees don't need their own payout account for this, which is useful for seasonal or newly hired staff.",
          ],
          links: [
            {
              label: "Dashboard → QR Codes → Tip distribution",
              href: Routes.dashboard.accessDistribution,
            },
          ],
        },
        {
          heading: "Seeing what you owe",
          paragraphs: [
            "The Staff balances tab on Dashboard → Tips → Payments lists each employee with what they earned, what you've already handed over, and what's still owed. People who are square drop off the list unless you switch them back on.",
            "When you pay someone, click Record payment and tick the tips it covers. The amount is worked out from the tips themselves rather than typed in, so every cent traces back to a specific tip. Add a date, and a note or reference if you want one on the record.",
            "You can record a payment for tips that haven't reached your account yet - handy if you pay cash the same night and our transfer lands days later. Those tips are marked so you know you're fronting them.",
          ],
          links: [
            {
              label: "Dashboard → Tips → Payments",
              href: Routes.dashboard.tipsPayments,
            },
          ],
        },
        {
          heading: "Proof for both sides",
          paragraphs: [
            "The employee sees the same numbers in their own portal and can tap to confirm they received each payment, which gives you a record neither side has to take on trust. Recorded a payment by mistake? Reverse it - the shares go back to being owed and the entry stays, marked as reversed.",
            "Export CSV gives your accountant a line per tip, and Statement produces a printable PDF for one employee showing what they earned, what they've been paid, and what's outstanding.",
          ],
        },
        {
          heading: "What this means for you",
          paragraphs: [
            "Collecting tips into your own account makes paying your staff your responsibility, not ours - Delitip records what's owed but never holds or transfers that money. It can also change how those tips are treated for tax, payroll, and social contributions compared with tips paid straight to an employee, so it's worth checking with your accountant before you switch a rule over.",
          ],
        },
      ],
      related: [
        { category: "collecting-tips", article: "setting-up-distribution-rules" },
        { category: "money-and-payouts", article: "pending-distributions-explained" },
      ],
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
            "The Refunds on Dashboard → Tips → Payments lists every request, filterable by status: Pending, Approved, Rejected, or Completed. Refund history for a specific tip is always visible on that tip's detail page.",
          ],
          links: [
            {
              label: "Dashboard → Tips → Payments",
              href: Routes.dashboard.tipsPayments,
            },
          ],
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
            "Tips earned under a rule that sends everything to the business are shown separately, as a balance the business pays directly rather than one we transfer. The same employee can have both, since the route is set per rule.",
          ],
          links: [{ label: "Employee Portal", href: Routes.employee.root }],
        },
      ],
      related: [{ category: "money-and-payouts", article: "paying-your-staff-yourself" }],
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
