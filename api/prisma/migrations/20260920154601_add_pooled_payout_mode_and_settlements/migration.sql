-- CreateEnum
CREATE TYPE "DistributionPayoutMode" AS ENUM ('DIRECT', 'VIA_STORE');

-- CreateEnum
CREATE TYPE "SettlementStatus" AS ENUM ('NOT_REQUIRED', 'OWED', 'SETTLED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "SettlementAdjustmentStatus" AS ENUM ('PROPOSED', 'APPLIED', 'DISMISSED');

-- AlterTable
ALTER TABLE "distribution_rules" ADD COLUMN     "payout_mode" "DistributionPayoutMode" NOT NULL DEFAULT 'DIRECT';

-- AlterTable
ALTER TABLE "tip_distributions" ADD COLUMN     "payout_mode" "DistributionPayoutMode" NOT NULL DEFAULT 'DIRECT',
ADD COLUMN     "settled_at" TIMESTAMP(3),
ADD COLUMN     "settlement_id" TEXT,
ADD COLUMN     "settlement_status" "SettlementStatus" NOT NULL DEFAULT 'NOT_REQUIRED';

-- CreateTable
CREATE TABLE "settlements" (
    "id" TEXT NOT NULL,
    "store_id" TEXT NOT NULL,
    "employee_id" TEXT,
    "employee_name_snapshot" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" "Currency" NOT NULL,
    "settled_at" TIMESTAMP(3) NOT NULL,
    "note" TEXT,
    "reference" TEXT,
    "recorded_by_user_id" TEXT,
    "confirmed_by_employee_at" TIMESTAMP(3),
    "reversed_at" TIMESTAMP(3),
    "reversed_by_user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "settlements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settlement_adjustments" (
    "id" TEXT NOT NULL,
    "store_id" TEXT NOT NULL,
    "employee_id" TEXT,
    "amount" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "refund_id" TEXT,
    "status" "SettlementAdjustmentStatus" NOT NULL DEFAULT 'PROPOSED',
    "settlement_id" TEXT,
    "created_by_user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "settlement_adjustments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "settlements_store_id_idx" ON "settlements"("store_id");

-- CreateIndex
CREATE INDEX "settlements_employee_id_idx" ON "settlements"("employee_id");

-- CreateIndex
CREATE INDEX "settlements_settled_at_idx" ON "settlements"("settled_at");

-- CreateIndex
CREATE INDEX "settlement_adjustments_store_id_idx" ON "settlement_adjustments"("store_id");

-- CreateIndex
CREATE INDEX "settlement_adjustments_employee_id_idx" ON "settlement_adjustments"("employee_id");

-- CreateIndex
CREATE INDEX "settlement_adjustments_status_idx" ON "settlement_adjustments"("status");

-- CreateIndex
CREATE INDEX "settlement_adjustments_settlement_id_idx" ON "settlement_adjustments"("settlement_id");

-- CreateIndex
CREATE INDEX "tip_distributions_settlement_id_idx" ON "tip_distributions"("settlement_id");

-- CreateIndex
CREATE INDEX "tip_distributions_employee_id_settlement_status_idx" ON "tip_distributions"("employee_id", "settlement_status");

-- AddForeignKey
ALTER TABLE "tip_distributions" ADD CONSTRAINT "tip_distributions_settlement_id_fkey" FOREIGN KEY ("settlement_id") REFERENCES "settlements"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "settlements" ADD CONSTRAINT "settlements_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "settlements" ADD CONSTRAINT "settlements_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "settlements" ADD CONSTRAINT "settlements_recorded_by_user_id_fkey" FOREIGN KEY ("recorded_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "settlements" ADD CONSTRAINT "settlements_reversed_by_user_id_fkey" FOREIGN KEY ("reversed_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "settlement_adjustments" ADD CONSTRAINT "settlement_adjustments_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "settlement_adjustments" ADD CONSTRAINT "settlement_adjustments_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "settlement_adjustments" ADD CONSTRAINT "settlement_adjustments_refund_id_fkey" FOREIGN KEY ("refund_id") REFERENCES "refunds"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "settlement_adjustments" ADD CONSTRAINT "settlement_adjustments_settlement_id_fkey" FOREIGN KEY ("settlement_id") REFERENCES "settlements"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "settlement_adjustments" ADD CONSTRAINT "settlement_adjustments_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
