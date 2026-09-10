import type { HelpCategory } from "@/interfaces/help-center.interfaces";
import { Routes } from "@/routes/routes";

export const AnalyticsAndReportingHelpCategory: HelpCategory = {
  slug: "analytics-and-reporting",
  title: "Analytics & Reporting",
  description:
    "Track tip volume, employee performance, and generated insights across your store or stores.",
  icon: "BarChart3",
  articles: [
    {
      slug: "the-overview-dashboard",
      title: "The Overview dashboard",
      summary:
        "Your Dashboard home page: tips today, transactions, reviews, average rating, and a 7-day trend.",
      sections: [
        {
          paragraphs: [
            "Dashboard → Overview (the page you land on after signing in) shows today's tips, transactions, reviews, and average rating, plus a 7-day tip trend chart, a live feed of recent customer feedback, and your active team roster.",
            "Quick actions on this page jump straight to Add Employee or Manage Tip Distribution.",
          ],
          links: [{ label: "Dashboard → Overview", href: Routes.dashboard.root }],
        },
      ],
      related: [{ category: "analytics-and-reporting", article: "tips-analytics" }],
    },
    {
      slug: "tips-analytics",
      title: "Tips analytics",
      summary:
        "Break down tip volume by day, week, month, employee, or store from Dashboard → Analytics → Tips.",
      sections: [
        {
          paragraphs: [
            "The Tips tab under Analytics lets you view tip volume across different time groupings and slice it by employee or store, using the period selector at the top of the Analytics section.",
          ],
          links: [{ label: "Dashboard → Analytics → Tips", href: Routes.dashboard.analytics.tips }],
        },
      ],
      related: [{ category: "analytics-and-reporting", article: "employee-performance-stats" }],
    },
    {
      slug: "employee-performance-stats",
      title: "Employee performance stats",
      summary:
        "Informational per-employee stats - explicitly not a ranking or leaderboard.",
      sections: [
        {
          paragraphs: [
            "The Employees tab under Analytics shows informational performance stats for each team member. It's designed to help you understand trends, not to rank staff against each other.",
          ],
          links: [{ label: "Dashboard → Analytics → Employees", href: Routes.dashboard.analytics.employees }],
        },
      ],
      related: [{ category: "reviews-and-feedback", article: "viewing-customer-reviews" }],
    },
    {
      slug: "comparing-stores",
      title: "Comparing stores",
      summary:
        "For multi-location businesses, compare tip performance across stores from Dashboard → Analytics → Stores.",
      sections: [
        {
          paragraphs: [
            "The Stores tab under Analytics only appears for organizations with more than one location, and lets you compare tip performance across all of your stores side by side.",
          ],
          links: [{ label: "Dashboard → Analytics → Stores", href: Routes.dashboard.analytics.stores }],
        },
      ],
    },
    {
      slug: "generating-insights",
      title: "Generating insights",
      summary:
        "Rule-based text summaries of recent customer feedback - satisfaction change, top praise, and top complaints.",
      sections: [
        {
          paragraphs: [
            "The Insights tab under Analytics generates a rule-based (not AI-generated) text summary of recent feedback for the selected period, including a satisfaction percentage change and the top recurring praise and complaint themes.",
            "Use Generate Insight to produce a fresh summary whenever you want an updated read on recent feedback trends.",
          ],
          links: [{ label: "Dashboard → Analytics → Insights", href: Routes.dashboard.analytics.insights }],
        },
      ],
      related: [{ category: "reviews-and-feedback", article: "viewing-customer-reviews" }],
    },
  ],
};
