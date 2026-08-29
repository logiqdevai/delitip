-- CreateEnum
CREATE TYPE "OrganizationRole" AS ENUM ('OWNER', 'STORE_MANAGER', 'ACCOUNTANT');

-- CreateEnum
CREATE TYPE "StoreIndustry" AS ENUM ('RESTAURANT', 'CAFE', 'BAR', 'HOTEL', 'SALON', 'SPA', 'RETAIL', 'OTHER');

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('EN', 'EL', 'ES', 'FR', 'DE', 'IT', 'PT', 'TR', 'RU', 'AR', 'ZH');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('EUR', 'USD', 'GBP', 'TRY', 'RUB', 'AED', 'CNY');

-- CreateEnum
CREATE TYPE "QrCodeSelectionMode" AS ENUM ('CHOOSE_ONE', 'CHOOSE_MANY', 'TEAM');

-- CreateEnum
CREATE TYPE "DistributionRecipientType" AS ENUM ('STORE', 'EMPLOYEE');

-- CreateEnum
CREATE TYPE "TipStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PayoutStatus" AS ENUM ('PENDING', 'PAID', 'FAILED');

-- CreateEnum
CREATE TYPE "PayoutAccountStatus" AS ENUM ('PENDING', 'ACTIVE', 'RESTRICTED', 'DISABLED');

-- CreateEnum
CREATE TYPE "PayoutAccountOwnerType" AS ENUM ('STORE', 'USER');

-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('VIVA', 'STRIPE', 'PAYPAL');

-- CreateEnum
CREATE TYPE "ReviewVisibility" AS ENUM ('PRIVATE', 'PUBLIC');

-- CreateEnum
CREATE TYPE "ReviewSentiment" AS ENUM ('POSITIVE', 'NEUTRAL', 'NEGATIVE');

-- CreateEnum
CREATE TYPE "FeedbackQuestionType" AS ENUM ('RATING', 'TEXT');

-- CreateEnum
CREATE TYPE "RefundStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "AlertType" AS ENUM ('POSITIVE_COMPLIMENTS', 'NEGATIVE_SATISFACTION_DROP', 'LOW_RATING_REVIEW', 'PERFORMANCE_CHANGE');

-- CreateEnum
CREATE TYPE "SubscriptionPlan" AS ENUM ('STARTER', 'PROFESSIONAL', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('TRIALING', 'ACTIVE', 'PAST_DUE', 'CANCELED');

-- DropIndex
DROP INDEX "documents_id_idx";

-- DropIndex
DROP INDEX "users_id_idx";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "first_name" TEXT,
ADD COLUMN     "is_archived" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "is_email_verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_phone_verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "last_name" TEXT,
ADD COLUMN     "registered_at" TIMESTAMP(3),
ALTER COLUMN "password" DROP NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'USER';

-- CreateTable
CREATE TABLE "organizations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "logo_document_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization_members" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "role" "OrganizationRole" NOT NULL,
    "store_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organization_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "plan" "SubscriptionPlan" NOT NULL DEFAULT 'STARTER',
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'TRIALING',
    "billing_provider_customer_id" TEXT,
    "billing_provider_subscription_id" TEXT,
    "current_period_start" TIMESTAMP(3),
    "current_period_end" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stores" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "industry" "StoreIndustry" NOT NULL DEFAULT 'OTHER',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "logo_document_id" TEXT,
    "cover_document_id" TEXT,
    "primary_color" TEXT,
    "secondary_color" TEXT,
    "welcome_message" JSONB,
    "thank_you_message" JSONB,
    "full_address" JSONB,
    "address_line" TEXT,
    "city" TEXT,
    "country" TEXT,
    "postal_code" TEXT,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "primary_language" "Language" NOT NULL DEFAULT 'EN',
    "supported_languages" "Language"[] DEFAULT ARRAY['EN']::"Language"[],
    "currency" "Currency" NOT NULL DEFAULT 'EUR',
    "suggested_tip_amounts" INTEGER[] DEFAULT ARRAY[2, 10, 20, 50]::INTEGER[],
    "allow_custom_tip_amount" BOOLEAN NOT NULL DEFAULT true,
    "public_review_redirect_url" TEXT,
    "public_review_rating_threshold" INTEGER DEFAULT 4,
    "default_distribution_rule_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employees" (
    "id" TEXT NOT NULL,
    "store_id" TEXT NOT NULL,
    "user_id" TEXT,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "photo_document_id" TEXT,
    "position" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spots" (
    "id" TEXT NOT NULL,
    "store_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "spots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "qr_codes" (
    "id" TEXT NOT NULL,
    "store_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "selection_mode" "QrCodeSelectionMode" NOT NULL DEFAULT 'CHOOSE_ONE',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "distribution_rule_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "qr_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "qr_code_spots" (
    "id" TEXT NOT NULL,
    "qr_code_id" TEXT NOT NULL,
    "spot_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "qr_code_spots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "qr_code_employees" (
    "id" TEXT NOT NULL,
    "qr_code_id" TEXT NOT NULL,
    "employee_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "qr_code_employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "distribution_rules" (
    "id" TEXT NOT NULL,
    "store_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "distribution_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "distribution_rule_recipients" (
    "id" TEXT NOT NULL,
    "distribution_rule_id" TEXT NOT NULL,
    "recipient_type" "DistributionRecipientType" NOT NULL,
    "employee_id" TEXT,
    "percentage" DECIMAL(5,2) NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "distribution_rule_recipients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payout_accounts" (
    "id" TEXT NOT NULL,
    "owner_type" "PayoutAccountOwnerType" NOT NULL,
    "store_id" TEXT,
    "user_id" TEXT,
    "provider" "PaymentProvider" NOT NULL DEFAULT 'VIVA',
    "provider_account_id" TEXT NOT NULL,
    "status" "PayoutAccountStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payout_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tips" (
    "id" TEXT NOT NULL,
    "store_id" TEXT NOT NULL,
    "qr_code_id" TEXT NOT NULL,
    "employee_id" TEXT,
    "distribution_rule_id" TEXT,
    "customer_user_id" TEXT,
    "customer_email" TEXT,
    "customer_name" TEXT,
    "amount" INTEGER NOT NULL,
    "currency" "Currency" NOT NULL DEFAULT 'EUR',
    "status" "TipStatus" NOT NULL DEFAULT 'PENDING',
    "payment_provider" "PaymentProvider" DEFAULT 'VIVA',
    "payment_reference" TEXT,
    "paid_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tip_distributions" (
    "id" TEXT NOT NULL,
    "tip_id" TEXT NOT NULL,
    "recipient_type" "DistributionRecipientType" NOT NULL,
    "employee_id" TEXT,
    "amount" INTEGER NOT NULL,
    "percentage" DECIMAL(5,2) NOT NULL,
    "payout_status" "PayoutStatus" NOT NULL DEFAULT 'PENDING',
    "paid_out_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tip_distributions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refunds" (
    "id" TEXT NOT NULL,
    "tip_id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "reason" TEXT,
    "status" "RefundStatus" NOT NULL DEFAULT 'PENDING',
    "requested_by_user_id" TEXT,
    "processed_by_user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "refunds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "store_id" TEXT NOT NULL,
    "tip_id" TEXT,
    "employee_id" TEXT,
    "customer_user_id" TEXT,
    "customer_email" TEXT,
    "customer_name" TEXT,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "visibility" "ReviewVisibility" NOT NULL DEFAULT 'PRIVATE',
    "sentiment" "ReviewSentiment",
    "redirected_to_public_platform" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review_categories" (
    "id" TEXT NOT NULL,
    "store_id" TEXT NOT NULL,
    "name" JSONB NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "review_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review_category_ratings" (
    "id" TEXT NOT NULL,
    "review_id" TEXT NOT NULL,
    "review_category_id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "review_category_ratings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review_tags" (
    "id" TEXT NOT NULL,
    "store_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sentiment" "ReviewSentiment",
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "review_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review_tag_assignments" (
    "id" TEXT NOT NULL,
    "review_id" TEXT NOT NULL,
    "review_tag_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "review_tag_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedback_questions" (
    "id" TEXT NOT NULL,
    "store_id" TEXT NOT NULL,
    "question" JSONB NOT NULL,
    "type" "FeedbackQuestionType" NOT NULL DEFAULT 'RATING',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feedback_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedback_responses" (
    "id" TEXT NOT NULL,
    "feedback_question_id" TEXT NOT NULL,
    "review_id" TEXT NOT NULL,
    "rating_value" INTEGER,
    "text_value" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feedback_responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alert_preferences" (
    "id" TEXT NOT NULL,
    "store_id" TEXT NOT NULL,
    "alert_type" "AlertType" NOT NULL,
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "alert_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alerts" (
    "id" TEXT NOT NULL,
    "store_id" TEXT NOT NULL,
    "type" "AlertType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "employee_id" TEXT,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "insight_summaries" (
    "id" TEXT NOT NULL,
    "store_id" TEXT NOT NULL,
    "period_start" TIMESTAMP(3) NOT NULL,
    "period_end" TIMESTAMP(3) NOT NULL,
    "summary" TEXT NOT NULL,
    "satisfaction_change_percent" DECIMAL(5,2),
    "top_praise" TEXT,
    "top_complaint" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "insight_summaries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "organizations_slug_key" ON "organizations"("slug");

-- CreateIndex
CREATE INDEX "organizations_slug_idx" ON "organizations"("slug");

-- CreateIndex
CREATE INDEX "organization_members_organization_id_idx" ON "organization_members"("organization_id");

-- CreateIndex
CREATE INDEX "organization_members_user_id_idx" ON "organization_members"("user_id");

-- CreateIndex
CREATE INDEX "organization_members_store_id_idx" ON "organization_members"("store_id");

-- CreateIndex
CREATE UNIQUE INDEX "organization_members_organization_id_user_id_store_id_role_key" ON "organization_members"("organization_id", "user_id", "store_id", "role");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_organization_id_key" ON "subscriptions"("organization_id");

-- CreateIndex
CREATE UNIQUE INDEX "stores_slug_key" ON "stores"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "stores_default_distribution_rule_id_key" ON "stores"("default_distribution_rule_id");

-- CreateIndex
CREATE INDEX "stores_organization_id_idx" ON "stores"("organization_id");

-- CreateIndex
CREATE INDEX "stores_slug_idx" ON "stores"("slug");

-- CreateIndex
CREATE INDEX "employees_store_id_idx" ON "employees"("store_id");

-- CreateIndex
CREATE INDEX "employees_user_id_idx" ON "employees"("user_id");

-- CreateIndex
CREATE INDEX "employees_email_idx" ON "employees"("email");

-- CreateIndex
CREATE INDEX "spots_store_id_idx" ON "spots"("store_id");

-- CreateIndex
CREATE UNIQUE INDEX "qr_codes_code_key" ON "qr_codes"("code");

-- CreateIndex
CREATE INDEX "qr_codes_store_id_idx" ON "qr_codes"("store_id");

-- CreateIndex
CREATE INDEX "qr_codes_code_idx" ON "qr_codes"("code");

-- CreateIndex
CREATE INDEX "qr_codes_distribution_rule_id_idx" ON "qr_codes"("distribution_rule_id");

-- CreateIndex
CREATE INDEX "qr_code_spots_qr_code_id_idx" ON "qr_code_spots"("qr_code_id");

-- CreateIndex
CREATE INDEX "qr_code_spots_spot_id_idx" ON "qr_code_spots"("spot_id");

-- CreateIndex
CREATE UNIQUE INDEX "qr_code_spots_qr_code_id_spot_id_key" ON "qr_code_spots"("qr_code_id", "spot_id");

-- CreateIndex
CREATE INDEX "qr_code_employees_qr_code_id_idx" ON "qr_code_employees"("qr_code_id");

-- CreateIndex
CREATE INDEX "qr_code_employees_employee_id_idx" ON "qr_code_employees"("employee_id");

-- CreateIndex
CREATE UNIQUE INDEX "qr_code_employees_qr_code_id_employee_id_key" ON "qr_code_employees"("qr_code_id", "employee_id");

-- CreateIndex
CREATE INDEX "distribution_rules_store_id_idx" ON "distribution_rules"("store_id");

-- CreateIndex
CREATE UNIQUE INDEX "distribution_rules_store_id_name_key" ON "distribution_rules"("store_id", "name");

-- CreateIndex
CREATE INDEX "distribution_rule_recipients_distribution_rule_id_idx" ON "distribution_rule_recipients"("distribution_rule_id");

-- CreateIndex
CREATE INDEX "distribution_rule_recipients_employee_id_idx" ON "distribution_rule_recipients"("employee_id");

-- CreateIndex
CREATE UNIQUE INDEX "payout_accounts_store_id_key" ON "payout_accounts"("store_id");

-- CreateIndex
CREATE UNIQUE INDEX "payout_accounts_user_id_key" ON "payout_accounts"("user_id");

-- CreateIndex
CREATE INDEX "tips_store_id_idx" ON "tips"("store_id");

-- CreateIndex
CREATE INDEX "tips_qr_code_id_idx" ON "tips"("qr_code_id");

-- CreateIndex
CREATE INDEX "tips_employee_id_idx" ON "tips"("employee_id");

-- CreateIndex
CREATE INDEX "tips_customer_user_id_idx" ON "tips"("customer_user_id");

-- CreateIndex
CREATE INDEX "tips_status_idx" ON "tips"("status");

-- CreateIndex
CREATE INDEX "tips_created_at_idx" ON "tips"("created_at");

-- CreateIndex
CREATE INDEX "tip_distributions_tip_id_idx" ON "tip_distributions"("tip_id");

-- CreateIndex
CREATE INDEX "tip_distributions_employee_id_idx" ON "tip_distributions"("employee_id");

-- CreateIndex
CREATE INDEX "tip_distributions_payout_status_idx" ON "tip_distributions"("payout_status");

-- CreateIndex
CREATE INDEX "refunds_tip_id_idx" ON "refunds"("tip_id");

-- CreateIndex
CREATE INDEX "refunds_status_idx" ON "refunds"("status");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_tip_id_key" ON "reviews"("tip_id");

-- CreateIndex
CREATE INDEX "reviews_store_id_idx" ON "reviews"("store_id");

-- CreateIndex
CREATE INDEX "reviews_employee_id_idx" ON "reviews"("employee_id");

-- CreateIndex
CREATE INDEX "reviews_customer_user_id_idx" ON "reviews"("customer_user_id");

-- CreateIndex
CREATE INDEX "reviews_rating_idx" ON "reviews"("rating");

-- CreateIndex
CREATE INDEX "reviews_created_at_idx" ON "reviews"("created_at");

-- CreateIndex
CREATE INDEX "review_categories_store_id_idx" ON "review_categories"("store_id");

-- CreateIndex
CREATE INDEX "review_category_ratings_review_id_idx" ON "review_category_ratings"("review_id");

-- CreateIndex
CREATE INDEX "review_category_ratings_review_category_id_idx" ON "review_category_ratings"("review_category_id");

-- CreateIndex
CREATE UNIQUE INDEX "review_category_ratings_review_id_review_category_id_key" ON "review_category_ratings"("review_id", "review_category_id");

-- CreateIndex
CREATE INDEX "review_tags_store_id_idx" ON "review_tags"("store_id");

-- CreateIndex
CREATE UNIQUE INDEX "review_tags_store_id_name_key" ON "review_tags"("store_id", "name");

-- CreateIndex
CREATE INDEX "review_tag_assignments_review_id_idx" ON "review_tag_assignments"("review_id");

-- CreateIndex
CREATE INDEX "review_tag_assignments_review_tag_id_idx" ON "review_tag_assignments"("review_tag_id");

-- CreateIndex
CREATE UNIQUE INDEX "review_tag_assignments_review_id_review_tag_id_key" ON "review_tag_assignments"("review_id", "review_tag_id");

-- CreateIndex
CREATE INDEX "feedback_questions_store_id_idx" ON "feedback_questions"("store_id");

-- CreateIndex
CREATE INDEX "feedback_responses_feedback_question_id_idx" ON "feedback_responses"("feedback_question_id");

-- CreateIndex
CREATE INDEX "feedback_responses_review_id_idx" ON "feedback_responses"("review_id");

-- CreateIndex
CREATE INDEX "alert_preferences_store_id_idx" ON "alert_preferences"("store_id");

-- CreateIndex
CREATE UNIQUE INDEX "alert_preferences_store_id_alert_type_key" ON "alert_preferences"("store_id", "alert_type");

-- CreateIndex
CREATE INDEX "alerts_store_id_idx" ON "alerts"("store_id");

-- CreateIndex
CREATE INDEX "alerts_employee_id_idx" ON "alerts"("employee_id");

-- CreateIndex
CREATE INDEX "insight_summaries_store_id_idx" ON "insight_summaries"("store_id");

-- CreateIndex
CREATE INDEX "insight_summaries_period_start_period_end_idx" ON "insight_summaries"("period_start", "period_end");

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_logo_document_id_fkey" FOREIGN KEY ("logo_document_id") REFERENCES "documents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_members" ADD CONSTRAINT "organization_members_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_members" ADD CONSTRAINT "organization_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_members" ADD CONSTRAINT "organization_members_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stores" ADD CONSTRAINT "stores_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stores" ADD CONSTRAINT "stores_logo_document_id_fkey" FOREIGN KEY ("logo_document_id") REFERENCES "documents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stores" ADD CONSTRAINT "stores_cover_document_id_fkey" FOREIGN KEY ("cover_document_id") REFERENCES "documents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stores" ADD CONSTRAINT "stores_default_distribution_rule_id_fkey" FOREIGN KEY ("default_distribution_rule_id") REFERENCES "distribution_rules"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_photo_document_id_fkey" FOREIGN KEY ("photo_document_id") REFERENCES "documents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spots" ADD CONSTRAINT "spots_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qr_codes" ADD CONSTRAINT "qr_codes_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qr_codes" ADD CONSTRAINT "qr_codes_distribution_rule_id_fkey" FOREIGN KEY ("distribution_rule_id") REFERENCES "distribution_rules"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qr_code_spots" ADD CONSTRAINT "qr_code_spots_qr_code_id_fkey" FOREIGN KEY ("qr_code_id") REFERENCES "qr_codes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qr_code_spots" ADD CONSTRAINT "qr_code_spots_spot_id_fkey" FOREIGN KEY ("spot_id") REFERENCES "spots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qr_code_employees" ADD CONSTRAINT "qr_code_employees_qr_code_id_fkey" FOREIGN KEY ("qr_code_id") REFERENCES "qr_codes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qr_code_employees" ADD CONSTRAINT "qr_code_employees_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "distribution_rules" ADD CONSTRAINT "distribution_rules_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "distribution_rule_recipients" ADD CONSTRAINT "distribution_rule_recipients_distribution_rule_id_fkey" FOREIGN KEY ("distribution_rule_id") REFERENCES "distribution_rules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "distribution_rule_recipients" ADD CONSTRAINT "distribution_rule_recipients_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payout_accounts" ADD CONSTRAINT "payout_accounts_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payout_accounts" ADD CONSTRAINT "payout_accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tips" ADD CONSTRAINT "tips_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tips" ADD CONSTRAINT "tips_qr_code_id_fkey" FOREIGN KEY ("qr_code_id") REFERENCES "qr_codes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tips" ADD CONSTRAINT "tips_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tips" ADD CONSTRAINT "tips_distribution_rule_id_fkey" FOREIGN KEY ("distribution_rule_id") REFERENCES "distribution_rules"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tips" ADD CONSTRAINT "tips_customer_user_id_fkey" FOREIGN KEY ("customer_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tip_distributions" ADD CONSTRAINT "tip_distributions_tip_id_fkey" FOREIGN KEY ("tip_id") REFERENCES "tips"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tip_distributions" ADD CONSTRAINT "tip_distributions_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refunds" ADD CONSTRAINT "refunds_tip_id_fkey" FOREIGN KEY ("tip_id") REFERENCES "tips"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refunds" ADD CONSTRAINT "refunds_requested_by_user_id_fkey" FOREIGN KEY ("requested_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refunds" ADD CONSTRAINT "refunds_processed_by_user_id_fkey" FOREIGN KEY ("processed_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_tip_id_fkey" FOREIGN KEY ("tip_id") REFERENCES "tips"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_customer_user_id_fkey" FOREIGN KEY ("customer_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_categories" ADD CONSTRAINT "review_categories_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_category_ratings" ADD CONSTRAINT "review_category_ratings_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_category_ratings" ADD CONSTRAINT "review_category_ratings_review_category_id_fkey" FOREIGN KEY ("review_category_id") REFERENCES "review_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_tags" ADD CONSTRAINT "review_tags_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_tag_assignments" ADD CONSTRAINT "review_tag_assignments_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_tag_assignments" ADD CONSTRAINT "review_tag_assignments_review_tag_id_fkey" FOREIGN KEY ("review_tag_id") REFERENCES "review_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback_questions" ADD CONSTRAINT "feedback_questions_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback_responses" ADD CONSTRAINT "feedback_responses_feedback_question_id_fkey" FOREIGN KEY ("feedback_question_id") REFERENCES "feedback_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback_responses" ADD CONSTRAINT "feedback_responses_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alert_preferences" ADD CONSTRAINT "alert_preferences_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "insight_summaries" ADD CONSTRAINT "insight_summaries_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;
