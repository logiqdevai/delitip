import type {
  DistributionRule,
  DistributionRuleRecipient,
} from "@/features/distribution/interfaces/distribution.interfaces";
import { recipientPercentage } from "@/features/distribution/interfaces/distribution.interfaces";
import { DistributionRecipientTypes } from "@/features/distribution/interfaces/distribution.interfaces";
import { tr } from "@/lib/i18n-runtime";

type SummaryKey = "noRecipients" | "business" | "employee";

/**
 * Pass `t` from `useTranslations("dashboard.team.distribution.summary")` when
 * calling from a component; without it the runtime translator (`tr`) is used.
 */
const defaultTranslate = (key: SummaryKey): string =>
  tr(`dashboard.team.distribution.summary.${key}`);

export function formatRecipientSummary(
  recipients: DistributionRuleRecipient[],
  t: (key: SummaryKey) => string = defaultTranslate,
): string {
  if (recipients.length === 0) {
    return t("noRecipients");
  }

  const ordered = [...recipients].sort(
    (a, b) => a.sort_order - b.sort_order,
  );

  return ordered
    .map((recipient) => {
      const pct = recipientPercentage(recipient.percentage);
      const label =
        recipient.recipient_type === DistributionRecipientTypes.STORE
          ? t("business")
          : (recipient.employee?.full_name ?? t("employee"));
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
