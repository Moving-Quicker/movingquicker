-- AlterTable: add email (required) and make whatsapp optional
ALTER TABLE "leads" ADD COLUMN "email" TEXT NOT NULL DEFAULT '';
ALTER TABLE "leads" ALTER COLUMN "whatsapp" DROP NOT NULL;
ALTER TABLE "leads" ALTER COLUMN "email" DROP DEFAULT;
