-- CreateTable
CREATE TABLE "app_config" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "tip_platform_commission_percentage" DECIMAL(5,2) NOT NULL DEFAULT 5,
    "tip_processor_fee_estimate_percentage" DECIMAL(5,2) NOT NULL DEFAULT 2.4,
    "tip_processor_fee_estimate_fixed_amount" INTEGER NOT NULL DEFAULT 24,
    "payout_hold_window_hours" INTEGER NOT NULL DEFAULT 48,
    "updated_by_user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "app_config_pkey" PRIMARY KEY ("id")
);

-- Seed the singleton row with the previous env defaults
INSERT INTO "app_config" ("id", "updated_at") VALUES ('default', CURRENT_TIMESTAMP);
