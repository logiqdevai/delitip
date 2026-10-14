-- AlterTable
ALTER TABLE "app_config" ADD COLUMN     "vat_rate_percentage" DECIMAL(5,2) NOT NULL DEFAULT 0;

-- The VAT rate used to be set per store. Carry the most common existing
-- store rate over as the platform-wide rate so checkout behaviour is unchanged.
UPDATE "app_config"
SET "vat_rate_percentage" = COALESCE(
  (SELECT "vat_rate_percentage" FROM "stores"
   WHERE "vat_rate_percentage" IS NOT NULL
   GROUP BY "vat_rate_percentage"
   ORDER BY COUNT(*) DESC, "vat_rate_percentage" DESC
   LIMIT 1),
  0
)
WHERE "id" = 'default';
