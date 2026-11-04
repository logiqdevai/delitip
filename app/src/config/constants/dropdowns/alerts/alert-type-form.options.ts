import {
  AlertTypes,
  type AlertType,
} from "@/features/alerts/interfaces/alerts.interfaces";

export const AlertTypeFormOptions: { id: AlertType; labelKey: string }[] = [
  {
    id: AlertTypes.POSITIVE_COMPLIMENTS,
    labelKey: "dashboard.enums.alertType.POSITIVE_COMPLIMENTS",
  },
  {
    id: AlertTypes.NEGATIVE_SATISFACTION_DROP,
    labelKey: "dashboard.enums.alertType.NEGATIVE_SATISFACTION_DROP",
  },
  {
    id: AlertTypes.LOW_RATING_REVIEW,
    labelKey: "dashboard.enums.alertType.LOW_RATING_REVIEW",
  },
  {
    id: AlertTypes.PERFORMANCE_CHANGE,
    labelKey: "dashboard.enums.alertType.PERFORMANCE_CHANGE",
  },
  {
    id: AlertTypes.PAYOUT_REQUEST_APPROVED,
    labelKey: "dashboard.enums.alertType.PAYOUT_REQUEST_APPROVED",
  },
  {
    id: AlertTypes.PAYOUT_REQUEST_REJECTED,
    labelKey: "dashboard.enums.alertType.PAYOUT_REQUEST_REJECTED",
  },
];
