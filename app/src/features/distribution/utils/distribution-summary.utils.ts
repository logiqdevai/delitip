import type {
  DistributionRule,
  DistributionRuleRecipient,
} from "@/features/distribution/interfaces/distribution.interfaces";
import { recipientPercentage } from "@/features/distribution/interfaces/distribution.interfaces";
import { DistributionRecipientTypes } from "@/features/distribution/interfaces/distribution.interfaces";

export function formatRecipientSummary(
  recipients: DistributionRuleRecipient[],
): string {
  if (recipients.length === 0) {
    return "No recipients";
  }

  const ordered = [...recipients].sort(
    (a, b) => a.sort_order - b.sort_order,
  );

  return ordered
    .map((recipient) => {
      const pct = recipientPercentage(recipient.percentage);
      const label =
        recipient.recipient_type === DistributionRecipientTypes.STORE
          ? "Business"
          : (recipient.employee?.full_name ?? "Employee");
      return `${label} ${pct}%`;
    })
    .join(" · ");
}

export function getDefaultRule(
  rules: DistributionRule[],
  defaultRuleId?: string | null,
): DistributionRule | null {
  if (!defaultRuleId) return null;
  return rules.find((rule) => rule.id === defaultRuleId) ?? null;
}
