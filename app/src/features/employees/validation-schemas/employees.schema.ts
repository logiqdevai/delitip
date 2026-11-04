import { z } from "zod";
import { vmsg } from "@/lib/validation-message";

export const employeeFormSchema = z.object({
  email: z.string().trim().email(vmsg("invalidEmail")),
  position: z.string().trim().optional(),
});

export type EmployeeFormData = z.infer<typeof employeeFormSchema>;
