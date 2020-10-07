-- ----------------------------
-- DROP table  authentication_saml
-- ----------------------------
DROP TABLE IF EXISTS "authentication_saml";

-- ----------------------------
-- DROP authentication_saml_sequence_generator
-- ----------------------------
DROP SEQUENCE IF EXISTS "authentication_saml_sequence_generator";

-- ----------------------------
-- Add column reference_value
-- ----------------------------
ALTER TABLE "cognito_settings" ADD COLUMN IF NOT EXISTS "reference_value" varchar(255);

-- ----------------------------
-- Add column meta_data_path
-- ----------------------------
ALTER TABLE "cognito_settings" ADD COLUMN IF NOT EXISTS "meta_data_path" varchar(255);

-- ----------------------------
-- Add column meta_data_name
-- ----------------------------
ALTER TABLE "cognito_settings" ADD COLUMN IF NOT EXISTS "meta_data_name" varchar(255);

-- ----------------------------
-- Add column m_templates.micro_service_name
-- ----------------------------
ALTER TABLE "m_templates" ADD COLUMN IF NOT EXISTS "micro_service_name" varchar(255) NOT NULL;

-- ----------------------------
-- REMOVE column m_templates.m_service_id
-- ----------------------------
ALTER TABLE "m_templates" DROP IF EXISTS "m_service_id";

-- ----------------------------
-- Add column storages_management.micro_service_name
-- ----------------------------
ALTER TABLE "storages_management" ADD COLUMN IF NOT EXISTS "micro_service_name" varchar(255) NOT NULL;

-- ----------------------------
-- REMOVE column storages_management.m_service_id
-- ----------------------------
ALTER TABLE "storages_management" DROP IF EXISTS "m_service_id";