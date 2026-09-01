export const ContactTopics = {
  SALES: "sales",
  SUPPORT: "support",
  BILLING: "billing",
  PARTNERSHIPS: "partnerships",
} as const;

export type ContactTopic = (typeof ContactTopics)[keyof typeof ContactTopics];

export interface ContactPayload {
  topic: ContactTopic;
  name: string;
  email: string;
  company?: string;
  message: string;
}

export interface ContactResponse {
  message: string;
  code: string;
}
