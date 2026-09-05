import type { HelpCategory } from "@/interfaces/help-center.interfaces";
import { Routes } from "@/routes/routes";

export const TeamManagementHelpCategory: HelpCategory = {
  slug: "team-management",
  title: "Team Management",
  description:
    "Add employees, manage who has dashboard access, and control what each role can do.",
  icon: "Users",
  articles: [
    {
      slug: "adding-and-editing-employees",
      title: "Adding and editing employees",
      summary:
        "Create employee profiles with a name, position, and photo so customers can tip and rate them by name.",
      sections: [
        {
          paragraphs: [
            "From Dashboard → Employees, use Add Employee to create a profile: full name (with translation support for multilingual stores), email, position, and an optional photo.",
            "Editing an employee updates their profile everywhere it's shown - on their Dashboard detail page, in QR code assignment lists, and on the public tip page when customers choose who to tip.",
          ],
          links: [{ label: "Dashboard → Employees", href: Routes.dashboard.employees }],
        },
      ],
      related: [
        { category: "collecting-tips", article: "creating-and-managing-qr-codes" },
      ],
    },
    {
      slug: "deactivating-vs-deleting-an-employee",
      title: "Deactivating vs. deleting an employee",
      summary:
        "Deactivating hides an employee from active lists without losing their history; deleting removes them permanently and requires Admin/Super Admin.",
      sections: [
        {
          paragraphs: [
            "Deactivating an employee is the safer, reversible option - it hides them from active employee lists and new QR code assignments, but keeps their historical tips, reviews, and analytics intact.",
            "Deleting an employee is permanent and is restricted to Admin or Super Admin roles. Use deactivation for anyone who might return, and reserve deletion for profiles created by mistake.",
          ],
          links: [{ label: "Dashboard → Employees", href: Routes.dashboard.employees }],
        },
      ],
      related: [
        { category: "getting-started", article: "understanding-roles-and-permissions" },
      ],
    },
    {
      slug: "inviting-members-and-assigning-roles",
      title: "Inviting members and assigning roles",
      summary:
        "Owners invite teammates to the Dashboard from Settings → Members & Access, scoped to the whole organization or a single store.",
      sections: [
        {
          paragraphs: [
            "Settings → Members & Access lets an Owner invite teammates by email, choose whether their access is organization-wide or limited to a specific store, and assign a role such as Owner.",
            "Members can also be removed from this same screen. Inviting, editing, and removing members are Owner-only actions - someone without the Owner role won't see these controls.",
          ],
          list: [
            "Invite by email with organization-wide or store-scoped access",
            "Assign a role that determines what the member can manage",
            "Remove a member to immediately revoke their Dashboard access",
          ],
          links: [{ label: "Settings → Members & Access", href: Routes.dashboard.settings.members }],
        },
      ],
      related: [
        { category: "getting-started", article: "understanding-roles-and-permissions" },
        { category: "money-and-payouts", article: "managing-your-subscription" },
      ],
    },
  ],
};
