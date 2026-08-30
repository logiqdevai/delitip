import type { HelpCategory } from "@/interfaces/help-center.interfaces";
import { Routes } from "@/routes/routes";

export const GettingStartedHelpCategory: HelpCategory = {
  slug: "getting-started",
  title: "Getting Started",
  description:
    "Create your account, set up your first store, and get your team collecting tips.",
  icon: "Rocket",
  articles: [
    {
      slug: "creating-a-business-account",
      title: "Creating a business account",
      summary:
        "Sign up as a business owner, not a staff member, to create and manage a store on Delitip.",
      sections: [
        {
          heading: "Business account vs. staff access",
          paragraphs: [
            "Delitip's sign-up screen lets you choose between a Business Account and Staff/Employee Access. Choose Business Account if you are setting up a store for the first time — this is the account that owns billing, branding, and team management.",
            "To create a business account you'll provide your venue name, business type, an estimate of your team size, your own name, email, and a password.",
          ],
        },
        {
          heading: "What happens next",
          paragraphs: [
            "After signing up, you're taken directly into onboarding to create your first store. You don't need to verify anything else before continuing — onboarding is where you set up the details customers and staff will see.",
          ],
        },
      ],
      related: [{ category: "getting-started", article: "completing-onboarding" }],
    },
    {
      slug: "completing-onboarding",
      title: "Completing onboarding: creating your first store",
      summary:
        "A short wizard that creates your first store — name, industry, timezone, currency, and address.",
      sections: [
        {
          paragraphs: [
            "Onboarding is a single-step wizard that runs right after you sign up as a business. It collects your store's name, industry or business type, timezone, currency, and address (with address autocomplete).",
            "Once you submit it, your store is created and you're redirected straight into the Dashboard. From there you can add employees, create QR codes, and customize branding.",
          ],
          links: [{ label: "Onboarding", href: Routes.onboarding }],
        },
      ],
      related: [
        { category: "getting-started", article: "your-first-qr-code-and-employee" },
        { category: "branding-and-customization", article: "business-profile-basics" },
      ],
    },
    {
      slug: "signing-in-as-staff",
      title: "Signing in as staff",
      summary:
        "Employees and managers use a separate Staff/Employee Access sign-in from business owners.",
      sections: [
        {
          paragraphs: [
            "Staff sign in through a dedicated employee sign-in form, separate from the business owner flow. This is the same role switcher shown on the sign-up and sign-in screens — pick Staff/Employee Access rather than Business Account.",
            "Staff members can only sign in once they've been invited or added as an employee/member by a business owner or admin. See Team Management for how invitations work.",
          ],
          links: [{ label: "Sign in", href: Routes.auth.sign_in }],
        },
      ],
      related: [
        { category: "team-management", article: "inviting-members-and-assigning-roles" },
      ],
    },
    {
      slug: "your-first-qr-code-and-employee",
      title: "Your first QR code and employee",
      summary:
        "The two things every new store needs before it can collect a tip: at least one employee and one QR code.",
      sections: [
        {
          heading: "Add your first employee",
          paragraphs: [
            "Go to Dashboard → Employees and add a team member with their name, position, and optionally a photo. This creates the profile customers will tip and rate.",
          ],
          links: [{ label: "Dashboard → Employees", href: Routes.dashboard.employees }],
        },
        {
          heading: "Create your first QR code",
          paragraphs: [
            "Go to Dashboard → Access and create a QR code. Give it a label, choose a selection mode (how customers pick who to tip), and assign it to one or more employees. The QR code produces a tip link in the form /{your-store-slug}/q/{code} that you can print or display at the point of service.",
          ],
          links: [{ label: "Dashboard → Access", href: Routes.dashboard.access }],
        },
      ],
      related: [
        { category: "collecting-tips", article: "creating-and-managing-qr-codes" },
        { category: "team-management", article: "adding-and-editing-employees" },
      ],
    },
    {
      slug: "understanding-roles-and-permissions",
      title: "Understanding roles and permissions",
      summary:
        "Owner, Admin/Super Admin, and Employee roles control who can manage team members, billing, and sensitive settings.",
      sections: [
        {
          paragraphs: [
            "Delitip has organization-level roles (like Owner) that gate access to Members & Access and Billing — only an Owner can invite/remove members or change the subscription plan.",
            "It also has platform-level admin roles (Admin/Super Admin) that gate destructive or sensitive actions, such as deleting an employee profile or managing feedback tags. Everyday managers and staff without these roles can still view and use most of the Dashboard, just without those specific controls.",
          ],
          links: [
            { label: "Settings → Members & Access", href: Routes.dashboard.settings.members },
            { label: "Settings → Billing", href: Routes.dashboard.settings.billing },
          ],
        },
      ],
      related: [
        { category: "team-management", article: "inviting-members-and-assigning-roles" },
      ],
    },
  ],
};
