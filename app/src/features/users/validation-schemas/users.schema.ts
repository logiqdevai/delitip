import { z } from "zod";
import { vmsg } from "@/lib/validation-message";

export const userProfileFormSchema = z.object({
  first_name: z.string().trim().min(1, vmsg("firstNameRequired")),
  last_name: z.string().trim().min(1, vmsg("lastNameRequired")),
  phone: z.string().trim().optional(),
});

export type UserProfileFormData = z.infer<typeof userProfileFormSchema>;
