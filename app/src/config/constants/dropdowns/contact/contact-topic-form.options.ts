import {
  ContactTopics,
  type ContactTopic,
} from "@/features/contact/interfaces/contact.interfaces";

export const ContactTopicFormOptions: { id: ContactTopic; labelKey: string }[] =
  [
    { id: ContactTopics.SALES, labelKey: "dashboard.enums.contactTopic.SALES" },
    {
      id: ContactTopics.SUPPORT,
      labelKey: "dashboard.enums.contactTopic.SUPPORT",
    },
    {
      id: ContactTopics.BILLING,
      labelKey: "dashboard.enums.contactTopic.BILLING",
    },
    {
      id: ContactTopics.PARTNERSHIPS,
      labelKey: "dashboard.enums.contactTopic.PARTNERSHIPS",
    },
  ];
