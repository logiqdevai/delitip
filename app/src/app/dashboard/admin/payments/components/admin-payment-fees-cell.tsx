import { type FC } from "react";
import type { PaymentTransaction } from "@/features/tips/interfaces/tips.interfaces";
import type { Currency } from "@/features/stores/interfaces/stores.interfaces";
import { formatMoney, formatPercent } from "@/lib/money";

interface AdminPaymentFeesCellProps {
  paymentTransaction?: PaymentTransaction | null;
  currency: Currency;
}

// Prefers the confirmed processor fee once Viva reconciles it; falls back to
// the estimate stamped at checkout, same precedence as the admin overview
// totals (admin-analytics.service.ts).
const resolvePaymentFee = (paymentTransaction: PaymentTransaction) =>
  paymentTransaction.processor_fee_confirmed
    ? (paymentTransaction.processor_fee_confirmed_amount ?? 0)
    : (paymentTransaction.processor_fee_estimated ?? 0);

export const AdminPaymentFeesCell: FC<AdminPaymentFeesCellProps> = ({
  paymentTransaction,
  currency,
}) => {
  if (!paymentTransaction) {
    return <span className="text-zinc-300">-</span>;
  }

  const platformFee = paymentTransaction.commission_amount;
  const paymentFee = resolvePaymentFee(paymentTransaction);
  const totalFee = paymentTransaction.total_fee_amount ?? platformFee + paymentFee;
  const totalFeePercentage =
    paymentTransaction.total_fee_percentage ??
    (paymentTransaction.gross_amount > 0
      ? Math.round((totalFee / paymentTransaction.gross_amount) * 10000) / 100
      : 0);

  return (
    <div className="flex flex-col gap-0.5 text-[11px] leading-tight text-zinc-400">
      <span>
        Platform {formatMoney(platformFee, currency)} (
        {formatPercent(paymentTransaction.platform_fee_percentage)})
      </span>
      <span>
        Payment {formatMoney(paymentFee, currency)}
        {paymentTransaction.payment_fee_percentage != null
          ? ` (${formatPercent(paymentTransaction.payment_fee_percentage)})`
          : ""}
      </span>
      <span className="font-bold text-ink-charcoal">
        Total {formatMoney(totalFee, currency)} ({formatPercent(totalFeePercentage)})
      </span>
    </div>
  );
};
