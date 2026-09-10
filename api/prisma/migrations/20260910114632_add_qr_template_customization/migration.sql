-- CreateTable
CREATE TABLE "qr_template_customizations" (
    "id" TEXT NOT NULL,
    "store_id" TEXT NOT NULL,
    "template_id" TEXT NOT NULL,
    "canvas" JSONB NOT NULL,
    "elements" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "qr_template_customizations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "qr_template_customizations_store_id_idx" ON "qr_template_customizations"("store_id");

-- CreateIndex
CREATE UNIQUE INDEX "qr_template_customizations_store_id_template_id_key" ON "qr_template_customizations"("store_id", "template_id");

-- AddForeignKey
ALTER TABLE "qr_template_customizations" ADD CONSTRAINT "qr_template_customizations_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;
