import { z } from "zod";

export const employeeFormSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  position: z.string().trim().optional(),
});

export type EmployeeFormData = z.infer<typeof employeeFormSchema>;
