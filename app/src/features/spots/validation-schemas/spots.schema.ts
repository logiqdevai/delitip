import { z } from "zod";

export const spotFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
});

export type SpotFormData = z.infer<typeof spotFormSchema>;
