import { z } from "zod";

export const employeeFormSchema = z.object({
  full_name: z.string().trim().min(1, "Full name is required"),
  email: z.string().trim().email("Enter a valid email"),
  position: z.string().trim().optional(),
});

export type EmployeeFormData = z.infer<typeof employeeFormSchema>;
