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
        "Ratings and comments customers leave after tipping, filterable by rating, employee and date.",
      sections: [
        {
          paragraphs: [
            "Dashboard → Reviews lists every customer rating and comment, each tied to the employee it was left for. Filter by minimum rating or employee, or use the From and To date pickers to narrow the list to a specific window - the To date includes the whole day it names.",
            "Open a review's detail sheet to see the full comment along with any categories the customer rated.",
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
            "Settings → Reviews lets you set a star-rating threshold - for example, 4 stars and up. Customers who rate at or above that threshold are prompted to share feedback via an external link (such as your Google Business Profile).",
            "Ratings below the threshold stay in your Dashboard only - no external redirect is offered.",
          ],
          links: [
            {
              label: "Settings → Reviews",
              href: Routes.dashboard.settings.reviewsFeedback,
            },
          ],
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
            "Rating categories - sub-ratings you can reorder by dragging, show or hide, and edit the wording of",
            "Feedback questions - Rating-type or Text-type questions, also reorderable, toggleable and editable",
          ],
          links: [{ label: "Settings → Reviews & Feedback", href: Routes.dashboard.settings.reviewsFeedback }],
        },
      ],
      related: [{ category: "reviews-and-feedback", article: "viewing-customer-reviews" }],
    },
  ],
};
