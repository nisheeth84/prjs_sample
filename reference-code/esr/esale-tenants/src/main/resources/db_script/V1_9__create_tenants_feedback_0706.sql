/*
 Version : 11
*/


-- ----------------------------
-- Sequence structure for feedback_sequence_generator
-- ----------------------------
DROP SEQUENCE IF EXISTS "feedback_sequence_generator";
CREATE SEQUENCE "feedback_sequence_generator" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Table structure for feedback
-- ----------------------------
DROP TABLE IF EXISTS "feedback";
CREATE TABLE "feedback" (
  "feedback_id" int8 NOT NULL DEFAULT nextval('feedback_sequence_generator'::regclass),
  "tenant_name" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "company_name" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "employee_id" int8 NOT NULL,
  "feedback_type" char(1) COLLATE "pg_catalog"."default" NOT NULL,
  "feedback_content" text COLLATE "pg_catalog"."default",
  "display_type" char(1) COLLATE "pg_catalog"."default" NOT NULL,
  "terminal_type" varchar(1) COLLATE "pg_catalog"."default" NOT NULL,
  "content" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "created_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_user" int8 NOT NULL,
  "updated_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_user" int8 NOT NULL
)
;

-- ----------------------------
-- Table structure for feedback_status_open
-- ----------------------------
DROP TABLE IF EXISTS "feedback_status_open";
CREATE TABLE "feedback_status_open" (
  "employee_id" int8 NOT NULL,
  "created_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_user" int8 NOT NULL,
  "updated_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_user" int8 NOT NULL
)
;

-- ----------------------------
-- Primary Key structure for table feedback
-- ----------------------------
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_pkey" PRIMARY KEY ("feedback_id");

-- ----------------------------
-- Primary Key structure for table feedback_status_open
-- ----------------------------
ALTER TABLE "feedback_status_open" ADD CONSTRAINT "feedback_status_pkey" PRIMARY KEY ("employee_id");
