import { z } from "zod";
import { vmsg } from "@/lib/validation-message";
import {
  DistributionPayoutModes,
  DistributionRecipientTypes,
} from "@/features/distribution/interfaces/distribution.interfaces";

const payoutModeValues = Object.values(DistributionPayoutModes) as [
  (typeof DistributionPayoutModes)[keyof typeof DistributionPayoutModes],
  ...(typeof DistributionPayoutModes)[keyof typeof DistributionPayoutModes][],
];

const recipientTypeValues = Object.values(DistributionRecipientTypes) as [
  (typeof DistributionRecipientTypes)[keyof typeof DistributionRecipientTypes],
  ...(typeof DistributionRecipientTypes)[keyof typeof DistributionRecipientTypes][],
];

const recipientSchema = z
  .object({
    recipient_type: z.enum(recipientTypeValues),
    employee_id: z.string().optional(),
    percentage: z.coerce.number().min(0, vmsg("minValue", { min: 0 })).max(100, vmsg("maxValue", { max: 100 })),
  })
  .superRefine((recipient, ctx) => {
    if (
      recipient.recipient_type === DistributionRecipientTypes.EMPLOYEE &&
      !recipient.employee_id
    ) {
      ctx.addIssue({
        code: "custom",
        message: vmsg("selectEmployee"),
        path: ["employee_id"],
      });
    }
  });

export const distributionRuleFormSchema = z
  .object({
    name: z.string().trim().min(1, vmsg("ruleNameRequired")),
    payout_mode: z.enum(payoutModeValues),
    recipients: z
      .array(recipientSchema)
      .min(1, vmsg("addRecipient")),
  })
  .superRefine((data, ctx) => {
    const sum = data.recipients.reduce(
      (total, recipient) => total + recipient.percentage,
      0,
    );
    if (Math.abs(sum - 100) > 0.01) {
      ctx.addIssue({
        code: "custom",
        message: vmsg("percentagesSum", { sum: sum.toFixed(1) }),
        path: ["recipients"],
      });
    }
  });

export type DistributionRuleFormData = z.infer<typeof distributionRuleFormSchema>;
