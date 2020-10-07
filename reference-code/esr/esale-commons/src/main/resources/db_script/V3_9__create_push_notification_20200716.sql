-- ----------------------------
-- Sequence structure for push_notification_sequence_generator
-- ----------------------------
DROP SEQUENCE IF EXISTS "push_notification_sequence_generator";
CREATE SEQUENCE "push_notification_sequence_generator" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Table structure for push_notification
-- ----------------------------
DROP TABLE IF EXISTS "push_notification";
CREATE TABLE "push_notification" (
  "employee_id" int8,
  "device_unique_id" varchar(255) COLLATE "pg_catalog"."default",
  "device_token" varchar(255) COLLATE "pg_catalog"."default",
  "endpoint" varchar(255) COLLATE "pg_catalog"."default",
  "is_logged" bool,
  "push_notification_id" int8 NOT NULL,
  "created_date" date,
  "created_user" int8,
  "updated_date" date,
  "updated_user" int8,
  "tenant_id" varchar(255) COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Primary Key structure for table push_notification
-- ----------------------------
ALTER TABLE "push_notification" ADD CONSTRAINT "push_notification_pkey" PRIMARY KEY ("push_notification_id");
