-- ----------------------------
-- Drop table data_change
-- ----------------------------
DROP TABLE IF EXISTS "data_change";

-- ----------------------------
-- Set default for column selected_target_id
-- ----------------------------
ALTER TABLE "field_info_personal" ALTER COLUMN "selected_target_type" SET DEFAULT 0;

-- ----------------------------
-- Set default for column selected_target_id
-- ----------------------------
ALTER TABLE "field_info_personal" ALTER COLUMN "selected_target_id" SET DEFAULT 0;
