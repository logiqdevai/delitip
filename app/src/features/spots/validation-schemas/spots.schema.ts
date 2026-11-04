import { z } from "zod";
import { vmsg } from "@/lib/validation-message";

export const spotFormSchema = z.object({
  name: z.string().trim().min(1, vmsg("nameRequired")),
});

export type SpotFormData = z.infer<typeof spotFormSchema>;
