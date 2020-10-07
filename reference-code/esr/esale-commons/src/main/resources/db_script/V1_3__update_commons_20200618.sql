-- ----------------------------
-- Sequence structure for access_log_sequence_generator
-- ----------------------------
DROP TABLE IF EXISTS "access_log";
DROP SEQUENCE IF EXISTS "access_log_sequence_generator";
CREATE SEQUENCE "access_log_sequence_generator" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Table structure for access_log
-- ----------------------------
CREATE TABLE "access_log" (
  "access_log_id" int8 NOT NULL DEFAULT nextval('access_log_sequence_generator'::regclass),
  "content" jsonb NOT NULL
)
;
-- ----------------------------
-- Primary Key structure for table access_log
-- ----------------------------
ALTER TABLE "access_log" ADD CONSTRAINT "access_log_pkey" PRIMARY KEY ("access_log_id");

-- ----------------------------
-- Sequence structure for general_setting_sequence_generator
-- ----------------------------
DROP TABLE IF EXISTS "general_setting";
DROP SEQUENCE IF EXISTS "general_setting_sequence_generator";
CREATE SEQUENCE "general_setting_sequence_generator" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Table structure for general_setting
-- ----------------------------
CREATE TABLE "general_setting" (
  "general_setting_id" int8 NOT NULL DEFAULT nextval('general_setting_sequence_generator'::regclass),
  "setting_name" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "setting_value" jsonb,
  "created_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_user" int8 NOT NULL,
  "updated_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_user" int8 NOT NULL
)
;
-- ----------------------------
-- Primary Key structure for table general_setting
-- ----------------------------
ALTER TABLE "general_setting" ADD CONSTRAINT "general_setting_pkey" PRIMARY KEY ("general_setting_id");