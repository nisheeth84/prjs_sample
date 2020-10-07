-- ----------------------------
-- Add column icon_path
-- ----------------------------
ALTER TABLE "services_info" ADD COLUMN IF NOT EXISTS "icon_path" varchar(255) COLLATE "pg_catalog"."default";

-- ----------------------------
-- Add column service_path
-- ----------------------------
ALTER TABLE "services_info" ADD COLUMN IF NOT EXISTS "service_path" varchar(255) COLLATE "pg_catalog"."default";

-- ----------------------------
-- Remove column url_encode
-- ----------------------------
ALTER TABLE "field_info" DROP IF EXISTS "url_encode";

-- ----------------------------
-- Add column iframe_height
-- ----------------------------
ALTER TABLE "field_info" ADD COLUMN IF NOT EXISTS "iframe_height" int;

-- ----------------------------
-- Add column difference_setting
-- ----------------------------
ALTER TABLE "field_info" ADD COLUMN IF NOT EXISTS "difference_setting" jsonb;

-- ----------------------------
-- Add column selected_target_type
-- ----------------------------
ALTER TABLE "field_info_personal" ADD COLUMN IF NOT EXISTS "selected_target_type" int;

-- ----------------------------
-- Add column selected_target_id
-- ----------------------------
ALTER TABLE "field_info_personal" ADD COLUMN IF NOT EXISTS "selected_target_id" int8;

-- ----------------------------
-- Remove column display_order
-- ----------------------------
ALTER TABLE "suggestions_choice" DROP IF EXISTS "display_order";