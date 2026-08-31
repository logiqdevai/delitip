-- CreateEnum
CREATE TYPE "PaymentTransactionStatus" AS ENUM ('CREATED', 'PROCESSING', 'SUCCEEDED', 'FAILED', 'CANCELLED', 'EXPIRED');

-- AlterTable
ALTER TABLE "tips" ALTER COLUMN "status" SET DEFAULT 'CREATED';

-- CreateTable
CREATE TABLE "payment_transactions" (
    "id" TEXT NOT NULL,
    "tip_id" TEXT NOT NULL,
    "provider" "PaymentProvider" NOT NULL DEFAULT 'VIVA',
    "client_request_id" TEXT,
    "viva_order_code" TEXT,
    "viva_transaction_id" TEXT,
    "gross_amount" INTEGER NOT NULL,
    "currency" "Currency" NOT NULL,
    "commission_percentage_used" DECIMAL(5,2) NOT NULL,
    "commission_amount" INTEGER NOT NULL,
    "processor_fee_estimated" INTEGER,
    "processor_fee_confirmed_amount" INTEGER,
    "processor_fee_confirmed" BOOLEAN NOT NULL DEFAULT false,
    "net_distributable_amount" INTEGER,
    "payment_method" TEXT,
    "status" "PaymentTransactionStatus" NOT NULL DEFAULT 'CREATED',
    "failure_reason" TEXT,
    "confirmed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "webhook_events" (
    "id" TEXT NOT NULL,
    "provider" "PaymentProvider" NOT NULL DEFAULT 'VIVA',
    "message_id" TEXT NOT NULL,
    "event_type_id" INTEGER NOT NULL,
    "payload" JSONB NOT NULL,
    "processed_at" TIMESTAMP(3),
    "processing_error" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "webhook_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payment_transactions_tip_id_key" ON "payment_transactions"("tip_id");

-- CreateIndex
CREATE UNIQUE INDEX "payment_transactions_client_request_id_key" ON "payment_transactions"("client_request_id");

-- CreateIndex
CREATE UNIQUE INDEX "payment_transactions_viva_order_code_key" ON "payment_transactions"("viva_order_code");

-- CreateIndex
CREATE UNIQUE INDEX "payment_transactions_viva_transaction_id_key" ON "payment_transactions"("viva_transaction_id");

-- CreateIndex
CREATE INDEX "payment_transactions_status_idx" ON "payment_transactions"("status");

-- CreateIndex
CREATE INDEX "payment_transactions_provider_idx" ON "payment_transactions"("provider");

-- CreateIndex
CREATE UNIQUE INDEX "webhook_events_message_id_key" ON "webhook_events"("message_id");

-- CreateIndex
CREATE INDEX "webhook_events_event_type_id_idx" ON "webhook_events"("event_type_id");

-- CreateIndex
CREATE INDEX "tips_status_created_at_idx" ON "tips"("status", "created_at");

-- AddForeignKey
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_tip_id_fkey" FOREIGN KEY ("tip_id") REFERENCES "tips"("id") ON DELETE CASCADE ON UPDATE CASCADE;
