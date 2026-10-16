-- CreateEnum
CREATE TYPE "PayoutRequestStatus" AS ENUM ('PENDING_REVIEW', 'APPROVED', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "InvoiceCheckStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'SKIPPED');

-- CreateEnum
CREATE TYPE "InvoiceCheckVerdict" AS ENUM ('MATCH', 'MISMATCH', 'UNREADABLE');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "AlertType" ADD VALUE 'PAYOUT_REQUEST_APPROVED';
ALTER TYPE "AlertType" ADD VALUE 'PAYOUT_REQUEST_REJECTED';

-- AlterEnum
ALTER TYPE "DocumentType" ADD VALUE 'INVOICE';

-- AlterTable
ALTER TABLE "app_config" ADD COLUMN     "payout_invoice_ai_check_enabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "payout_invoice_instructions" TEXT,
ADD COLUMN     "payout_invoice_required" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "platform_address" TEXT,
ADD COLUMN     "platform_legal_name" TEXT,
ADD COLUMN     "platform_tax_office" TEXT,
ADD COLUMN     "platform_vat_number" TEXT;

-- AlterTable
ALTER TABLE "tip_distributions" ADD COLUMN     "payout_request_id" TEXT;

-- CreateTable
CREATE TABLE "payout_requests" (
    "id" TEXT NOT NULL,
    "store_id" TEXT NOT NULL,
    "requested_by_user_id" TEXT,
    "status" "PayoutRequestStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "amount" INTEGER NOT NULL,
    "own_share_amount" INTEGER NOT NULL,
    "held_for_staff_amount" INTEGER NOT NULL,
    "currency" "Currency" NOT NULL,
    "distribution_count" INTEGER NOT NULL,
    "period_from" TIMESTAMP(3) NOT NULL,
    "period_to" TIMESTAMP(3) NOT NULL,
    "hold_cutoff_at" TIMESTAMP(3) NOT NULL,
    "invoice_document_id" TEXT NOT NULL,
    "invoice_number" TEXT,
    "store_note" TEXT,
    "failure_reason" TEXT,
    "check_status" "InvoiceCheckStatus" NOT NULL DEFAULT 'PENDING',
    "check_verdict" "InvoiceCheckVerdict",
    "check_issues" JSONB,
    "check_extracted" JSONB,
    "check_model" TEXT,
    "check_cost_usd" DECIMAL(10,6),
    "checked_at" TIMESTAMP(3),
    "reviewed_by_user_id" TEXT,
    "reviewed_at" TIMESTAMP(3),
    "admin_note" TEXT,
    "payout_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payout_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payout_requests_invoice_document_id_key" ON "payout_requests"("invoice_document_id");

-- CreateIndex
CREATE UNIQUE INDEX "payout_requests_payout_id_key" ON "payout_requests"("payout_id");

-- CreateIndex
CREATE INDEX "payout_requests_store_id_status_idx" ON "payout_requests"("store_id", "status");

-- CreateIndex
CREATE INDEX "payout_requests_status_created_at_idx" ON "payout_requests"("status", "created_at");

-- CreateIndex
CREATE INDEX "tip_distributions_payout_request_id_idx" ON "tip_distributions"("payout_request_id");

-- AddForeignKey
ALTER TABLE "tip_distributions" ADD CONSTRAINT "tip_distributions_payout_request_id_fkey" FOREIGN KEY ("payout_request_id") REFERENCES "payout_requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payout_requests" ADD CONSTRAINT "payout_requests_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payout_requests" ADD CONSTRAINT "payout_requests_requested_by_user_id_fkey" FOREIGN KEY ("requested_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payout_requests" ADD CONSTRAINT "payout_requests_reviewed_by_user_id_fkey" FOREIGN KEY ("reviewed_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payout_requests" ADD CONSTRAINT "payout_requests_invoice_document_id_fkey" FOREIGN KEY ("invoice_document_id") REFERENCES "documents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payout_requests" ADD CONSTRAINT "payout_requests_payout_id_fkey" FOREIGN KEY ("payout_id") REFERENCES "payouts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
