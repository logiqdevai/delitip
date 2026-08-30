-- AlterTable: suggested tip presets are minor currency units (cents), matching Tip.amount
ALTER TABLE "stores" ALTER COLUMN "suggested_tip_amounts" SET DEFAULT ARRAY[200, 1000, 2000, 5000]::INTEGER[];

-- Fix stores still on the old major-unit default (€2/€10/€20/€50 stored as 2/10/20/50)
UPDATE "stores"
SET "suggested_tip_amounts" = ARRAY[200, 1000, 2000, 5000]::INTEGER[]
WHERE "suggested_tip_amounts" = ARRAY[2, 10, 20, 50]::INTEGER[];
