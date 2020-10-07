
TRUNCATE TABLE "notification_detail_setting", "notification_email", "notification_setting", "notification_type_setting";

-- ----------------------------
-- Drop primary key
-- ----------------------------
ALTER TABLE "notification_detail_setting" DROP CONSTRAINT notification_type_setting_copy1_pkey;

ALTER TABLE "notification_email" DROP CONSTRAINT notification_email_pkey;

ALTER TABLE "notification_setting" DROP CONSTRAINT notification_setting_pkey;

ALTER TABLE "notification_type_setting" DROP CONSTRAINT notification_type_setting_pkey;

-- ----------------------------
-- Sequence structure for notification_detail_setting_sequence_generator
-- ----------------------------
DROP SEQUENCE IF EXISTS "notification_detail_setting_sequence_generator";
CREATE SEQUENCE "notification_detail_setting_sequence_generator"
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for notification_email_sequence_generator
-- ----------------------------
DROP SEQUENCE IF EXISTS "notification_email_sequence_generator";
CREATE SEQUENCE "notification_email_sequence_generator"
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for notification_setting_sequence_generator
-- ----------------------------
DROP SEQUENCE IF EXISTS "notification_setting_sequence_generator";
CREATE SEQUENCE "notification_setting_sequence_generator"
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for notification_type_setting_sequence_generator
-- ----------------------------
DROP SEQUENCE IF EXISTS "notification_type_setting_sequence_generator";
CREATE SEQUENCE "notification_type_setting_sequence_generator"
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Add column id
-- ----------------------------
ALTER TABLE "notification_detail_setting" ADD COLUMN IF NOT EXISTS "notification_detail_setting_id" int8 NOT NULL;

ALTER TABLE "notification_email" ADD COLUMN IF NOT EXISTS "notification_email_id" int8 NOT NULL;

ALTER TABLE "notification_setting" ADD COLUMN IF NOT EXISTS "notification_setting_id" int8 NOT NULL;

ALTER TABLE "notification_type_setting" ADD COLUMN IF NOT EXISTS "notification_type_setting_id" int8 NOT NULL;

-- ----------------------------
-- Uniques structure for table notification_detail_setting
-- ----------------------------
ALTER TABLE "notification_detail_setting" ADD CONSTRAINT "uq_notification_detail" UNIQUE ("employee_id", "notification_type", "notification_subtype");

-- ----------------------------
-- Primary Key structure for table notification_detail_setting
-- ----------------------------
ALTER TABLE "notification_detail_setting" ADD CONSTRAINT "notification_detail_setting_pkey" PRIMARY KEY ("notification_detail_setting_id");

-- ----------------------------
-- Uniques structure for table notification_email
-- ----------------------------
ALTER TABLE "notification_email" ADD CONSTRAINT "uq_notification_email" UNIQUE ("employee_id");

-- ----------------------------
-- Primary Key structure for table notification_email
-- ----------------------------
ALTER TABLE "notification_email" ADD CONSTRAINT "notification_email_pkey" PRIMARY KEY ("notification_email_id");

-- ----------------------------
-- Uniques structure for table notification_setting
-- ----------------------------
ALTER TABLE "notification_setting" ADD CONSTRAINT "uq_notification_setting" UNIQUE ("employee_id");

-- ----------------------------
-- Primary Key structure for table notification_setting
-- ----------------------------
ALTER TABLE "notification_setting" ADD CONSTRAINT "notification_setting_pkey" PRIMARY KEY ("notification_setting_id");

-- ----------------------------
-- Uniques structure for table notification_type_setting
-- ----------------------------
ALTER TABLE "notification_type_setting" ADD CONSTRAINT "uq_notification_type_setting_copy" UNIQUE ("employee_id", "notification_type");

-- ----------------------------
-- Primary Key structure for table notification_type_setting
-- ----------------------------
ALTER TABLE "notification_type_setting" ADD CONSTRAINT "notification_type_setting_pkey" PRIMARY KEY ("notification_type_setting_id");
