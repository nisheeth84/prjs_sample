-- ----------------------------
-- Allow null for "icon_path"
-- ----------------------------
ALTER TABLE "masters_motivations" ALTER COLUMN "icon_path" DROP NOT NULL;

-- ----------------------------
-- Allow null for "icon_name"
-- ----------------------------
ALTER TABLE "masters_motivations" ALTER COLUMN "icon_name" DROP NOT NULL;