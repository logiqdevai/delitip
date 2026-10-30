import {
  ContactTopics,
  type ContactTopic,
} from "@/features/contact/interfaces/contact.interfaces";

export const ContactTopicFormOptions: { id: ContactTopic; label: string }[] = [
  { id: ContactTopics.SALES, label: "Sales & Demos" },
  { id: ContactTopics.SUPPORT, label: "Account Support" },
  { id: ContactTopics.BILLING, label: "Billing & Payments" },
  { id: ContactTopics.PARTNERSHIPS, label: "Partnerships" },
];

export function getContactTopicLabel(topic: ContactTopic | string): string {
  return (
    ContactTopicFormOptions.find((option) => option.id === topic)?.label ??
    topic
  );
}
