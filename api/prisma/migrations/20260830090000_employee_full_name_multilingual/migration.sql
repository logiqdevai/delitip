-- Employee.full_name becomes a multilingual JSON map (mirrors Store.welcome_message),
-- keyed by lowercase Language code. Existing plain-text names are seeded under
-- each employee's store's primary_language.
ALTER TABLE "employees" ADD COLUMN "full_name_new" JSONB;

UPDATE "employees" e
SET "full_name_new" = jsonb_build_object(lower(s."primary_language"::text), e."full_name")
FROM "stores" s
WHERE s.id = e."store_id";

ALTER TABLE "employees" DROP COLUMN "full_name";
ALTER TABLE "employees" RENAME COLUMN "full_name_new" TO "full_name";
ALTER TABLE "employees" ALTER COLUMN "full_name" SET NOT NULL;
