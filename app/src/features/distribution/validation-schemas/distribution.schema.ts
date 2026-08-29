import { z } from "zod";
import { DistributionRecipientTypes } from "@/features/distribution/interfaces/distribution.interfaces";

const recipientTypeValues = Object.values(DistributionRecipientTypes) as [
  (typeof DistributionRecipientTypes)[keyof typeof DistributionRecipientTypes],
  ...(typeof DistributionRecipientTypes)[keyof typeof DistributionRecipientTypes][],
];

const recipientSchema = z
  .object({
    recipient_type: z.enum(recipientTypeValues),
    employee_id: z.string().optional(),
    percentage: z.coerce.number().min(0, "Min 0%").max(100, "Max 100%"),
  })
  .superRefine((recipient, ctx) => {
    if (
      recipient.recipient_type === DistributionRecipientTypes.EMPLOYEE &&
      !recipient.employee_id
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Select an employee",
        path: ["employee_id"],
      });
    }
  });

export const distributionRuleFormSchema = z
  .object({
    name: z.string().trim().min(1, "Rule name is required"),
    recipients: z
      .array(recipientSchema)
      .min(1, "Add at least one recipient"),
  })
  .superRefine((data, ctx) => {
    const sum = data.recipients.reduce(
      (total, recipient) => total + recipient.percentage,
      0,
    );
    if (Math.abs(sum - 100) > 0.01) {
      ctx.addIssue({
        code: "custom",
        message: `Percentages must sum to 100% (currently ${sum.toFixed(1)}%)`,
        path: ["recipients"],
      });
    }
  });

export type DistributionRuleFormData = z.infer<typeof distributionRuleFormSchema>;
