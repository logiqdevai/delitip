import type { HelpCategory } from "@/interfaces/help-center.interfaces";
import { Routes } from "@/routes/routes";

export const ReviewsAndFeedbackHelpCategory: HelpCategory = {
  slug: "reviews-and-feedback",
  title: "Reviews & Feedback",
  description:
    "See what customers are saying, and customize what you ask them after a tip.",
  icon: "Star",
  articles: [
    {
      slug: "viewing-customer-reviews",
      title: "Viewing customer reviews",
      summary:
        "Ratings and comments customers leave after tipping, filterable by rating and employee.",
      sections: [
        {
          paragraphs: [
            "Dashboard → Reviews lists every customer rating and comment, each tied to the employee it was left for. Filter by minimum rating or employee.",
            "Open a review's detail sheet to see the full comment along with any tags or categories the customer selected.",
          ],
          links: [{ label: "Dashboard → Reviews", href: Routes.dashboard.reviews }],
        },
      ],
      related: [{ category: "reviews-and-feedback", article: "customizing-rating-categories-and-questions" }],
    },
    {
      slug: "setting-the-review-redirect-threshold",
      title: "Setting the review redirect threshold",
      summary:
        "Choose a star rating above which happy customers are prompted to post on an external site like Google.",
      sections: [
        {
          paragraphs: [
            "Settings → Review Redirect lets you set a star-rating threshold — for example, 4 stars and up. Customers who rate at or above that threshold are prompted to share feedback via an external link (such as your Google Business Profile).",
            "Ratings below the threshold stay in your Dashboard only — no external redirect is offered.",
          ],
          links: [{ label: "Settings → Review Redirect", href: Routes.dashboard.settings.reviewRedirect }],
        },
      ],
      related: [{ category: "collecting-tips", article: "the-customer-tip-page-walkthrough" }],
    },
    {
      slug: "customizing-rating-categories-and-questions",
      title: "Customizing rating categories and feedback questions",
      summary:
        "Control which sub-ratings and follow-up questions appear on the customer review step.",
      sections: [
        {
          paragraphs: [
            "Settings → Reviews & Feedback controls what customers see after they rate an employee:",
          ],
          list: [
            "Rating categories — sub-ratings you can reorder by dragging, and show or hide",
            "Feedback questions — Rating-type or Text-type questions, also reorderable and toggleable",
            "Compliment/feedback tags — quick-select tags marked Positive, Neutral, or Negative sentiment, managed by Admin/Super Admin",
          ],
          links: [{ label: "Settings → Reviews & Feedback", href: Routes.dashboard.settings.reviewsFeedback }],
        },
      ],
      related: [{ category: "reviews-and-feedback", article: "using-feedback-tags" }],
    },
    {
      slug: "using-feedback-tags",
      title: "Using feedback tags",
      summary:
        "Positive, neutral, and negative sentiment tags customers can quickly select instead of typing a comment.",
      sections: [
        {
          paragraphs: [
            "Feedback tags are short, pre-written labels (like \"Friendly service\" or \"Slow to respond\") that a customer can tap instead of writing a full comment. Each tag carries a sentiment — Positive, Neutral, or Negative.",
            "Managing the tag list itself is restricted to Admin or Super Admin roles, from Settings → Reviews & Feedback.",
          ],
          links: [{ label: "Settings → Reviews & Feedback", href: Routes.dashboard.settings.reviewsFeedback }],
        },
      ],
      related: [{ category: "getting-started", article: "understanding-roles-and-permissions" }],
    },
  ],
};
