-- DropForeignKey
ALTER TABLE "leads" DROP CONSTRAINT IF EXISTS "leads_visitor_id_fkey";

-- DropIndex
DROP INDEX IF EXISTS "leads_visitor_id_idx";

-- AlterTable: remove visitor_id from leads
ALTER TABLE "leads" DROP COLUMN IF EXISTS "visitor_id";

-- DropTable
DROP TABLE IF EXISTS "events";

-- DropTable
DROP TABLE IF EXISTS "visitors";
