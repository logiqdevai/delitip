-- Rename Viva-specific column names on payment_transactions to
-- provider-generic names, since PaymentTransaction.provider already
-- supports processors other than Viva (e.g. Stripe).
ALTER TABLE "payment_transactions" RENAME COLUMN "viva_order_code" TO "provider_order_code";
ALTER TABLE "payment_transactions" RENAME COLUMN "viva_transaction_id" TO "provider_transaction_id";

ALTER INDEX "payment_transactions_viva_order_code_key" RENAME TO "payment_transactions_provider_order_code_key";
ALTER INDEX "payment_transactions_viva_transaction_id_key" RENAME TO "payment_transactions_provider_transaction_id_key";
