import { z } from "zod";
import { vmsg } from "@/lib/validation-message";
import { ContactTopics } from "@/features/contact/interfaces/contact.interfaces";

export const contactSchema = z.object({
  topic: z.enum([
    ContactTopics.SALES,
    ContactTopics.SUPPORT,
    ContactTopics.BILLING,
    ContactTopics.PARTNERSHIPS,
  ]),
  name: z.string().trim().min(1, vmsg("fullNameRequired")),
  email: z.string().trim().email(vmsg("workEmailInvalid")),
  company: z.string().trim().optional(),
  message: z.string().trim().min(1, vmsg("messageRequired")),
});

export type ContactFormData = z.infer<typeof contactSchema>;
