-- ----------------------------
-- update theo TK ver 1.8
-- ----------------------------
ALTER TABLE "quicksight_settings" ADD COLUMN IF NOT EXISTS "group_arn" varchar(255) NOT NULL;