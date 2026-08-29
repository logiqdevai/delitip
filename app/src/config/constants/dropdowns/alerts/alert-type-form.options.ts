import {
  AlertTypes,
  type AlertType,
} from "@/features/alerts/interfaces/alerts.interfaces";

export const AlertTypeFormOptions: { id: AlertType; label: string }[] = [
  { id: AlertTypes.POSITIVE_COMPLIMENTS, label: "Positive compliments" },
  { id: AlertTypes.NEGATIVE_SATISFACTION_DROP, label: "Satisfaction drop" },
  { id: AlertTypes.LOW_RATING_REVIEW, label: "Low rating review" },
  { id: AlertTypes.PERFORMANCE_CHANGE, label: "Performance change" },
];

export function getAlertTypeLabel(type: AlertType | string): string {
  return (
    AlertTypeFormOptions.find((option) => option.id === type)?.label ?? type
  );
}
