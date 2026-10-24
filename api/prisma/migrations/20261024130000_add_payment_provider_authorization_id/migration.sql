-- AlterTable
ALTER TABLE "payment_transactions" ADD COLUMN     "provider_authorization_id" TEXT;
ALTER TABLE "payment_transactions" ADD COLUMN     "processor_fee_fixed_used" INTEGER;
