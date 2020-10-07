-- ----------------------------
-- Sequence structure for authentication_saml_sequence_generator
-- ----------------------------
DROP TABLE IF EXISTS "authentication_saml";
DROP SEQUENCE IF EXISTS "authentication_saml_sequence_generator";
CREATE SEQUENCE "authentication_saml_sequence_generator" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Table structure for authentication_saml
-- ----------------------------
CREATE TABLE "authentication_saml" (
  "saml_id" int8 NOT NULL DEFAULT nextval('authentication_saml_sequence_generator'::regclass),
  "tenant_id" int8 NOT NULL,
  "is_pc" bool,
  "is_app" bool,
  "reference_field_id" int8,
  "reference_type" int4,
  "reference_value" varchar(255) COLLATE "pg_catalog"."default",
  "issuer" varchar(255) COLLATE "pg_catalog"."default",
  "certificate_path" varchar(255) COLLATE "pg_catalog"."default",
  "certificate_name" varchar(255) COLLATE "pg_catalog"."default",
  "url_login" varchar(255) COLLATE "pg_catalog"."default",
  "ur_logout" varchar(255) COLLATE "pg_catalog"."default",
  "created_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_user" int8 NOT NULL,
  "updated_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_user" int8 NOT NULL
)
;

-- ----------------------------
-- Primary Key structure for table authentication_saml
-- ----------------------------
ALTER TABLE "authentication_saml" ADD CONSTRAINT "authentication_saml_pkey" PRIMARY KEY ("saml_id");

-- ----------------------------
-- Sequence structure for ip_address
-- ----------------------------
DROP TABLE IF EXISTS "ip_address";
DROP SEQUENCE IF EXISTS "ip_address_sequence_generator";
CREATE SEQUENCE "ip_address_sequence_generator" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Table structure for ip_address
-- ----------------------------
CREATE TABLE "ip_address" (
  "ip_address_id" int8 NOT NULL DEFAULT nextval('ip_address_sequence_generator'::regclass),
  "tenant_id" int8 NOT NULL,
  "ip_address" varchar(255) COLLATE "pg_catalog"."default",
  "created_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_user" int8 NOT NULL,
  "updated_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_user" int8 NOT NULL
)
;

-- ----------------------------
-- Primary Key structure for table ip_address
-- ----------------------------
ALTER TABLE "ip_address" ADD CONSTRAINT "ip_address_pkey" PRIMARY KEY ("ip_address_id");

-- ----------------------------
-- Sequence structure for cognito_settings
-- ----------------------------
DROP TABLE IF EXISTS "cognito_settings";
DROP SEQUENCE IF EXISTS "cognito_settings_sequence_generator";
CREATE SEQUENCE "cognito_settings_sequence_generator" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Table structure for cognito_settings
-- ----------------------------
CREATE TABLE "cognito_settings" (
  "cognito_settings_id" int8 NOT NULL DEFAULT nextval('cognito_settings_sequence_generator'::regclass),
  "tenant_id" int8 NOT NULL,
  "client_id" varchar(255) NOT NULL,
  "user_pool_id" varchar(255) NOT NULL,
  "created_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_user" int8 NOT NULL,
  "updated_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_user" int8 NOT NULL
)
;

-- ----------------------------
-- Primary Key structure for table cognito_settings
-- ----------------------------
ALTER TABLE "cognito_settings" ADD CONSTRAINT "cognito_settings_pkey" PRIMARY KEY ("cognito_settings_id");