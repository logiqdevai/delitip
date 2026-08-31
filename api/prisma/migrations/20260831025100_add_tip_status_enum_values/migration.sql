-- AlterEnum
-- New enum values must be committed before they can be used by a later
-- migration (e.g. as a column default) — see the follow-up migration.
ALTER TYPE "TipStatus" ADD VALUE 'CREATED';
ALTER TYPE "TipStatus" ADD VALUE 'PROCESSING';
ALTER TYPE "TipStatus" ADD VALUE 'CANCELLED';
