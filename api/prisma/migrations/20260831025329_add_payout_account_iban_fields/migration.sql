-- CreateEnum
CREATE TYPE "PayoutMethod" AS ENUM ('IBAN', 'CONNECTED_ACCOUNT');

-- AlterTable
ALTER TABLE "payout_accounts" ADD COLUMN     "bank_account_id" TEXT,
ADD COLUMN     "beneficiary_name" TEXT,
ADD COLUMN     "iban_last4" TEXT,
ADD COLUMN     "payout_method" "PayoutMethod" NOT NULL DEFAULT 'IBAN';
