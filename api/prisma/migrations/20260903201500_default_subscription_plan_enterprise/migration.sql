-- AlterTable
ALTER TABLE "subscriptions" ALTER COLUMN "plan" SET DEFAULT 'ENTERPRISE';

-- Update existing subscriptions
UPDATE "subscriptions" SET "plan" = 'ENTERPRISE';
