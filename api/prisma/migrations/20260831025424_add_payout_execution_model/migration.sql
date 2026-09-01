-- CreateEnum
CREATE TYPE "PayoutExecutionStatus" AS ENUM ('PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- AlterEnum
ALTER TYPE "PayoutStatus" ADD VALUE 'PROCESSING';

-- AlterTable
ALTER TABLE "tip_distributions" ADD COLUMN     "payout_id" TEXT;

-- CreateTable
CREATE TABLE "payouts" (
    "id" TEXT NOT NULL,
    "recipient_type" "DistributionRecipientType" NOT NULL,
    "store_id" TEXT,
    "employee_id" TEXT,
    "payout_account_id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" "Currency" NOT NULL,
    "provider" "PaymentProvider" NOT NULL DEFAULT 'VIVA',
    "provider_transfer_id" TEXT,
    "status" "PayoutExecutionStatus" NOT NULL DEFAULT 'PROCESSING',
    "failure_reason" TEXT,
    "executed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payouts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "payouts_status_idx" ON "payouts"("status");

-- CreateIndex
CREATE INDEX "payouts_store_id_idx" ON "payouts"("store_id");

-- CreateIndex
CREATE INDEX "payouts_employee_id_idx" ON "payouts"("employee_id");

-- CreateIndex
CREATE INDEX "tip_distributions_payout_id_idx" ON "tip_distributions"("payout_id");

-- AddForeignKey
ALTER TABLE "tip_distributions" ADD CONSTRAINT "tip_distributions_payout_id_fkey" FOREIGN KEY ("payout_id") REFERENCES "payouts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payouts" ADD CONSTRAINT "payouts_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payouts" ADD CONSTRAINT "payouts_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payouts" ADD CONSTRAINT "payouts_payout_account_id_fkey" FOREIGN KEY ("payout_account_id") REFERENCES "payout_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
