-- ------------------------------
-- Drop data of table feedback_status_open before alter table
-- ------------------------------
DELETE FROM "feedback_status_open";

-- ------------------------------
-- Alter table feedback_status_open add column tenant_name if not exists
-- ------------------------------
ALTER TABLE "feedback_status_open" ADD COLUMN IF NOT EXISTS "tenant_name" varchar(255) NOT NULL;

-- ----------------------------
-- Primary Key structure for table payments_management
-- ----------------------------
ALTER TABLE "feedback_status_open" DROP CONSTRAINT IF EXISTS "feedback_status_pkey";
ALTER TABLE "feedback_status_open" ADD CONSTRAINT  "feedback_status_open_pkey" PRIMARY KEY ("employee_id", "tenant_name");