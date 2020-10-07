-- ----------------------------
-- Add column last_updated_date
-- ----------------------------
ALTER TABLE "employees_groups" ADD COLUMN IF NOT EXISTS "last_updated_date" timestamp(6);