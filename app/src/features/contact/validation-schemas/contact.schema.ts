import { z } from "zod";
import { ContactTopics } from "@/features/contact/interfaces/contact.interfaces";

export const contactSchema = z.object({
  topic: z.enum([
    ContactTopics.SALES,
    ContactTopics.SUPPORT,
    ContactTopics.BILLING,
    ContactTopics.PARTNERSHIPS,
  ]),
  name: z.string().trim().min(1, "Full name is required"),
  email: z.string().trim().email("Enter a valid work email"),
  company: z.string().trim().optional(),
  message: z.string().trim().min(1, "Tell us how we can help"),
});

export type ContactFormData = z.infer<typeof contactSchema>;
