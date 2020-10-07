/*
 Version: 1.1
*/


-- ----------------------------
-- Sequence structure for notification_information_sequence_generator
-- ----------------------------
DROP SEQUENCE IF EXISTS "notification_information_sequence_generator";
CREATE SEQUENCE "notification_information_sequence_generator" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Table structure for menu_favorite
-- ----------------------------
DROP TABLE IF EXISTS "menu_favorite";
CREATE TABLE "menu_favorite" (
  "service_id" int8 NOT NULL,
  "employee_id" int8 NOT NULL,
  "service_name" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "created_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_user" int8 NOT NULL,
  "updated_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_user" int8 NOT NULL
)
;

-- ----------------------------
-- Table structure for menu_service_order
-- ----------------------------
DROP TABLE IF EXISTS "menu_service_order";
CREATE TABLE "menu_service_order" (
  "service_id" int8 NOT NULL,
  "employee_id" int8 NOT NULL,
  "service_name" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "service_order" int4 NOT NULL,
  "created_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_user" int8 NOT NULL,
  "updated_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_user" int8 NOT NULL
)
;

-- ----------------------------
-- Table structure for notification_addess
-- ----------------------------
DROP TABLE IF EXISTS "notification_addess";
CREATE TABLE "notification_addess" (
  "employee_id" int8 NOT NULL,
  "notification_id" int8 NOT NULL,
  "created_notification_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "confirm_notification_date" timestamp(6),
  "created_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_user" int8 NOT NULL,
  "updated_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_user" int8 NOT NULL
)
;

-- ----------------------------
-- Table structure for notification_detail_setting
-- ----------------------------
DROP TABLE IF EXISTS "notification_detail_setting";
CREATE TABLE "notification_detail_setting" (
  "employee_id" int8 NOT NULL,
  "notification_type" int8 NOT NULL,
  "notification_subtype" int8 NOT NULL,
  "notification_subtype_name" varchar(255) COLLATE "pg_catalog"."default",
  "is_notification" bool NOT NULL,
  "setting_notification_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_user" int8 NOT NULL,
  "updated_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_user" int8 NOT NULL
)
;

-- ----------------------------
-- Table structure for notification_email
-- ----------------------------
DROP TABLE IF EXISTS "notification_email";
CREATE TABLE "notification_email" (
  "employee_id" int8 NOT NULL,
  "email" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "created_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_user" int8 NOT NULL,
  "updated_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_user" int8 NOT NULL
)
;

-- ----------------------------
-- Table structure for notification_information
-- ----------------------------
DROP TABLE IF EXISTS "notification_information";
CREATE TABLE "notification_information" (
  "notification_id" int8 NOT NULL DEFAULT nextval('notification_information_sequence_generator'::regclass),
  "notification_type" int8 NOT NULL,
  "notification_subtype" int8 NOT NULL,
  "timeline_id" int8,
  "activity_id" int8,
  "custumer_id" int8,
  "business_card_id" int8,
  "schedule_id" int8,
  "task_id" int8,
  "milestone_id" int8,
  "import_id" int8,
  "message" jsonb NOT NULL,
  "icon" varchar(255) COLLATE "pg_catalog"."default",
  "notification_sender" varchar(255) COLLATE "pg_catalog"."default",
  "created_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_user" int8 NOT NULL,
  "updated_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_user" int8 NOT NULL
)
;

-- ----------------------------
-- Table structure for notification_setting
-- ----------------------------
DROP TABLE IF EXISTS "notification_setting";
CREATE TABLE "notification_setting" (
  "employee_id" int8 NOT NULL,
  "display_notification_setting" int8 NOT NULL,
  "save_notification_setting" int8 NOT NULL,
  "is_notification_mail" bool NOT NULL,
  "notification_time" int8 NOT NULL,
  "created_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_user" int8 NOT NULL,
  "updated_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_user" int8 NOT NULL
)
;

-- ----------------------------
-- Table structure for notification_type_setting
-- ----------------------------
DROP TABLE IF EXISTS "notification_type_setting";
CREATE TABLE "notification_type_setting" (
  "employee_id" int8 NOT NULL,
  "notification_type" int8 NOT NULL,
  "notification_type_name" varchar(255) COLLATE "pg_catalog"."default",
  "created_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_user" int8 NOT NULL,
  "updated_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_user" int8 NOT NULL
)
;

-- ----------------------------
-- Primary Key structure for table menu_favorite
-- ----------------------------
ALTER TABLE "menu_favorite" ADD CONSTRAINT "menu_favorite_pkey" PRIMARY KEY ("service_id");

-- ----------------------------
-- Primary Key structure for table menu_service_order
-- ----------------------------
ALTER TABLE "menu_service_order" ADD CONSTRAINT "menu_order_pkey" PRIMARY KEY ("service_id");

-- ----------------------------
-- Primary Key structure for table notification_addess
-- ----------------------------
ALTER TABLE "notification_addess" ADD CONSTRAINT "notification_addess_pkey" PRIMARY KEY ("employee_id");

-- ----------------------------
-- Primary Key structure for table notification_detail_setting
-- ----------------------------
ALTER TABLE "notification_detail_setting" ADD CONSTRAINT "notification_type_setting_copy1_pkey" PRIMARY KEY ("employee_id", "notification_type", "notification_subtype");

-- ----------------------------
-- Primary Key structure for table notification_email
-- ----------------------------
ALTER TABLE "notification_email" ADD CONSTRAINT "notification_email_pkey" PRIMARY KEY ("employee_id");

-- ----------------------------
-- Primary Key structure for table notification_information
-- ----------------------------
ALTER TABLE "notification_information" ADD CONSTRAINT "notification_information_pkey" PRIMARY KEY ("notification_id");

-- ----------------------------
-- Primary Key structure for table notification_setting
-- ----------------------------
ALTER TABLE "notification_setting" ADD CONSTRAINT "notification_setting_pkey" PRIMARY KEY ("employee_id");

-- ----------------------------
-- Primary Key structure for table notification_type_setting
-- ----------------------------
ALTER TABLE "notification_type_setting" ADD CONSTRAINT "notification_type_setting_pkey" PRIMARY KEY ("employee_id", "notification_type");
