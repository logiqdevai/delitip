-- Organization billing/invoicing fields: profession, Greek tax office (ΔΟΥ),
-- and a registered billing address independent of any Store's own address.

-- AlterTable
ALTER TABLE "organizations" ADD COLUMN     "profession" TEXT,
ADD COLUMN     "doy" TEXT,
ADD COLUMN     "address_line" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "postal_code" TEXT,
ADD COLUMN     "full_address" JSONB;
