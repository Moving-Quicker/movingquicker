-- AlterTable
ALTER TABLE "leads" ADD COLUMN "utm_source" VARCHAR(100);
ALTER TABLE "leads" ADD COLUMN "utm_medium" VARCHAR(100);
ALTER TABLE "leads" ADD COLUMN "utm_campaign" VARCHAR(200);
ALTER TABLE "leads" ADD COLUMN "landing_page" VARCHAR(500);
