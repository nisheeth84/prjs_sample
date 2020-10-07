-- ----------------------------
-- Add column is_pc
-- ----------------------------
ALTER TABLE "cognito_settings" ADD COLUMN IF NOT EXISTS "is_pc" bool DEFAULT false;

-- ----------------------------
-- Add column is_app
-- ----------------------------
ALTER TABLE "cognito_settings" ADD COLUMN IF NOT EXISTS "is_app" bool DEFAULT false;

-- ----------------------------
-- Add column provider_name
-- ----------------------------
ALTER TABLE "cognito_settings" ADD COLUMN IF NOT EXISTS "provider_name" varchar(50);