-- AlterTable
ALTER TABLE "payment_transactions" ADD COLUMN     "payment_fee_percentage" DECIMAL(5,2),
ADD COLUMN     "platform_fee_percentage" DECIMAL(5,2),
ADD COLUMN     "total_fee_amount" INTEGER,
ADD COLUMN     "total_fee_percentage" DECIMAL(5,2);

-- Backfill platform_fee_percentage for existing rows from already-stored
-- commission_amount/gross_amount before enforcing NOT NULL below.
UPDATE "payment_transactions"
SET "platform_fee_percentage" = ROUND((("commission_amount"::decimal / "gross_amount") * 100), 2)
WHERE "gross_amount" > 0;

ALTER TABLE "payment_transactions" ALTER COLUMN "platform_fee_percentage" SET NOT NULL;
