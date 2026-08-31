-- AlterTable
ALTER TABLE "refunds" ADD COLUMN     "provider_reference" TEXT,
ADD COLUMN     "provider_status" TEXT,
ADD COLUMN     "requires_manual_reconciliation" BOOLEAN NOT NULL DEFAULT false;
