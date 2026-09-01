import {
  ContactTopics,
  type ContactTopic,
} from "@/features/contact/interfaces/contact.interfaces";

export const ContactTopicFormOptions: { id: ContactTopic; label: string }[] = [
  { id: ContactTopics.SALES, label: "Sales & demos" },
  { id: ContactTopics.SUPPORT, label: "Account support" },
  { id: ContactTopics.BILLING, label: "Billing" },
  { id: ContactTopics.PARTNERSHIPS, label: "Partnerships" },
];

export function getContactTopicLabel(topic: ContactTopic | string): string {
  return (
    ContactTopicFormOptions.find((option) => option.id === topic)?.label ??
    topic
  );
}
