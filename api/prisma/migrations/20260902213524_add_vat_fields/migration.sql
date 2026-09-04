-- VAT support: Store.vat_rate_percentage, Organization.vat_number/legal_name,
-- and PaymentTransaction split into tip_amount (net) vs gross_amount
-- (VAT-inclusive, now the amount actually charged via Viva).

-- AlterTable
ALTER TABLE "stores" ADD COLUMN     "vat_rate_percentage" DECIMAL(5,2);

-- AlterTable
ALTER TABLE "organizations" ADD COLUMN     "vat_number" TEXT,
ADD COLUMN     "legal_name" TEXT;

-- AlterTable: rename the old gross_amount (net tip, pre-fee) to tip_amount,
-- preserving existing data — NOT a drop+recreate.
ALTER TABLE "payment_transactions" RENAME COLUMN "gross_amount" TO "tip_amount";

-- AlterTable: re-add gross_amount with its new meaning (tip_amount + vat_amount).
-- Backfill existing rows (VAT didn't exist yet) with gross_amount = tip_amount.
ALTER TABLE "payment_transactions" ADD COLUMN     "vat_rate_percentage" DECIMAL(5,2),
ADD COLUMN     "vat_amount" INTEGER,
ADD COLUMN     "gross_amount" INTEGER;

UPDATE "payment_transactions" SET "gross_amount" = "tip_amount" WHERE "gross_amount" IS NULL;

ALTER TABLE "payment_transactions" ALTER COLUMN "gross_amount" SET NOT NULL;
