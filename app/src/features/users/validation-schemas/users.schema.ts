import { z } from "zod";

export const userProfileFormSchema = z.object({
  first_name: z.string().trim().min(1, "First name is required"),
  last_name: z.string().trim().min(1, "Last name is required"),
  phone: z.string().trim().optional(),
});

export type UserProfileFormData = z.infer<typeof userProfileFormSchema>;
