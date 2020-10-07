-- ----------------------------
-- ADD column statistics_item_flag
-- ----------------------------
ALTER TABLE "field_info" ADD COLUMN IF NOT EXISTS "statistics_item_flag" int NOT NULL DEFAULT 1;

-- ----------------------------
-- ADD column statistics_condition_flag
-- ----------------------------
ALTER TABLE "field_info" ADD COLUMN IF NOT EXISTS "statistics_condition_flag" int NOT NULL DEFAULT 1;

-- Update data master
UPDATE "field_info" SET "statistics_item_flag" = 0,  "statistics_condition_flag" = 0 WHERE "field_id" IN (13, 23, 65, 71, 100, 110, 111, 115, 116, 118, 129, 130, 131, 138, 139, 142, 145, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 187, 190, 191, 192, 196, 197, 198, 199, 200, 201, 202, 203, 204);