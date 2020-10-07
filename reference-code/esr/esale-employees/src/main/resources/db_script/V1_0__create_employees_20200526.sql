-- ----------------------------
-- Sequence structure for departments_sequence_generator
-- ----------------------------
DROP SEQUENCE IF EXISTS "departments_sequence_generator";
CREATE SEQUENCE "departments_sequence_generator" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for emp_detail_sequence_generator
-- ----------------------------
DROP SEQUENCE IF EXISTS "emp_detail_sequence_generator";
CREATE SEQUENCE "emp_detail_sequence_generator" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for employees_departments_sequence_generator
-- ----------------------------
DROP SEQUENCE IF EXISTS "employees_departments_sequence_generator";
CREATE SEQUENCE "employees_departments_sequence_generator" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for employees_group_members_sequence_generator
-- ----------------------------
DROP SEQUENCE IF EXISTS "employees_group_members_sequence_generator";
CREATE SEQUENCE "employees_group_members_sequence_generator" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for employees_group_participants_sequence_generator
-- ----------------------------
DROP SEQUENCE IF EXISTS "employees_group_participants_sequence_generator";
CREATE SEQUENCE "employees_group_participants_sequence_generator" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for employees_group_search_conditions_sequence_generator
-- ----------------------------
DROP SEQUENCE IF EXISTS "employees_group_search_conditions_sequence_generator";
CREATE SEQUENCE "employees_group_search_conditions_sequence_generator" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for employees_groups_sequence_generator
-- ----------------------------
DROP SEQUENCE IF EXISTS "employees_groups_sequence_generator";
CREATE SEQUENCE "employees_groups_sequence_generator" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for employees_histories_sequence_generator
-- ----------------------------
DROP SEQUENCE IF EXISTS "employees_histories_sequence_generator";
CREATE SEQUENCE "employees_histories_sequence_generator" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for employees_packages_sequence_generator
-- ----------------------------
DROP SEQUENCE IF EXISTS "employees_packages_sequence_generator";
CREATE SEQUENCE "employees_packages_sequence_generator" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for employees_sequence_generator
-- ----------------------------
DROP SEQUENCE IF EXISTS "employees_sequence_generator";
CREATE SEQUENCE "employees_sequence_generator" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Table structure for departments
-- ----------------------------
DROP TABLE IF EXISTS "departments";
CREATE TABLE "departments" (
  "department_id" int8 NOT NULL,
  "created_date" timestamp(6) NOT NULL,
  "created_user" int8 NOT NULL,
  "updated_date" timestamp(6) NOT NULL,
  "updated_user" int8 NOT NULL,
  "department_name" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "manager_id" int8,
  "parent_id" int8,
  "department_order" int4
)
;

-- ----------------------------
-- Table structure for emp_detail
-- ----------------------------
DROP TABLE IF EXISTS "emp_detail";
CREATE TABLE "emp_detail" (
  "employee_id" int8 NOT NULL,
  "created_date" timestamp(6),
  "created_user" int8 NOT NULL,
  "updated_date" timestamp(6),
  "updated_user" int8 NOT NULL,
  "email" varchar(255) COLLATE "pg_catalog"."default",
  "employee_code" varchar(255) COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Table structure for employees
-- ----------------------------
DROP TABLE IF EXISTS "employees";
CREATE TABLE "employees" (
  "employee_id" int8 NOT NULL,
  "created_date" timestamp(6) NOT NULL,
  "created_user" int8 NOT NULL,
  "updated_date" timestamp(6) NOT NULL,
  "updated_user" int8 NOT NULL,
  "cellphone_number" varchar(20) COLLATE "pg_catalog"."default",
  "email" varchar(50) COLLATE "pg_catalog"."default",
  "employee_data" jsonb,
  "employee_name" varchar(100) COLLATE "pg_catalog"."default",
  "employee_name_kana" varchar(100) COLLATE "pg_catalog"."default",
  "employee_status" int4 DEFAULT 0,
  "employee_surname" varchar(100) COLLATE "pg_catalog"."default",
  "employee_surname_kana" varchar(100) COLLATE "pg_catalog"."default",
  "language_id" int8,
  "password" varchar(40) COLLATE "pg_catalog"."default",
  "photo_file_name" varchar(255) COLLATE "pg_catalog"."default",
  "photo_file_path" varchar(255) COLLATE "pg_catalog"."default",
  "telephone_number" varchar(20) COLLATE "pg_catalog"."default",
  "timezone_id" int8,
  "user_id" varchar(50) COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Table structure for employees_departments
-- ----------------------------
DROP TABLE IF EXISTS "employees_departments";
CREATE TABLE "employees_departments" (
  "employees_departments_id" int8 NOT NULL,
  "created_date" timestamp(6) NOT NULL,
  "created_user" int8 NOT NULL,
  "updated_date" timestamp(6) NOT NULL,
  "updated_user" int8 NOT NULL,
  "department_id" int8 NOT NULL,
  "employee_id" int8 NOT NULL,
  "position_id" int4,
  "manager_id" int8
)
;

-- ----------------------------
-- Table structure for employees_group_members
-- ----------------------------
DROP TABLE IF EXISTS "employees_group_members";
CREATE TABLE "employees_group_members" (
  "group_member_id" int8 NOT NULL,
  "created_date" timestamp(6) NOT NULL,
  "created_user" int8 NOT NULL,
  "updated_date" timestamp(6) NOT NULL,
  "updated_user" int8 NOT NULL,
  "employee_id" int8 NOT NULL,
  "group_id" int8 NOT NULL
)
;

-- ----------------------------
-- Table structure for employees_group_participants
-- ----------------------------
DROP TABLE IF EXISTS "employees_group_participants";
CREATE TABLE "employees_group_participants" (
  "employee_group_participant_id" int8 NOT NULL,
  "created_date" timestamp(6) NOT NULL,
  "created_user" int8 NOT NULL,
  "updated_date" timestamp(6) NOT NULL,
  "updated_user" int8 NOT NULL,
  "department_id" int8,
  "employee_id" int8,
  "group_id" int8 NOT NULL,
  "participant_group_id" int8,
  "participant_type" int4
)
;

-- ----------------------------
-- Table structure for employees_group_search_conditions
-- ----------------------------
DROP TABLE IF EXISTS "employees_group_search_conditions";
CREATE TABLE "employees_group_search_conditions" (
  "search_content_id" int8 NOT NULL,
  "created_date" timestamp(6) NOT NULL,
  "created_user" int8 NOT NULL,
  "updated_date" timestamp(6) NOT NULL,
  "updated_user" int8 NOT NULL,
  "field_id" int8 NOT NULL,
  "group_id" int8 NOT NULL,
  "search_option" int8,
  "search_type" int8,
  "search_value" varchar(200) COLLATE "pg_catalog"."default",
  "field_order" int4
)
;

-- ----------------------------
-- Table structure for employees_groups
-- ----------------------------
DROP TABLE IF EXISTS "employees_groups";
CREATE TABLE "employees_groups" (
  "group_id" int8 NOT NULL,
  "created_date" timestamp(6) NOT NULL,
  "created_user" int8 NOT NULL,
  "updated_date" timestamp(6) NOT NULL,
  "updated_user" int8 NOT NULL,
  "display_order" int4,
  "group_name" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "group_type" int4,
  "is_auto_group" bool,
  "is_over_write" bool
)
;

-- ----------------------------
-- Table structure for employees_histories
-- ----------------------------
DROP TABLE IF EXISTS "employees_histories";
CREATE TABLE "employees_histories" (
  "employee_history_id" int8 NOT NULL,
  "created_date" timestamp(6) NOT NULL,
  "created_user" int8 NOT NULL,
  "updated_date" timestamp(6) NOT NULL,
  "updated_user" int8 NOT NULL,
  "cellphone_number" varchar(20) COLLATE "pg_catalog"."default",
  "content_change" jsonb,
  "email" varchar(50) COLLATE "pg_catalog"."default",
  "employee_data" jsonb,
  "employee_id" int8 NOT NULL,
  "employee_name" varchar(100) COLLATE "pg_catalog"."default",
  "employee_name_kana" varchar(100) COLLATE "pg_catalog"."default",
  "employee_status" int4,
  "employee_surname" varchar(100) COLLATE "pg_catalog"."default",
  "employee_surname_kana" varchar(100) COLLATE "pg_catalog"."default",
  "is_admin" bool,
  "language_id" int4,
  "manager_id" int8,
  "photo_file_name" varchar(255) COLLATE "pg_catalog"."default",
  "photo_file_path" varchar(255) COLLATE "pg_catalog"."default",
  "reason_edit" varchar(500) COLLATE "pg_catalog"."default",
  "telephone_number" varchar(20) COLLATE "pg_catalog"."default",
  "timezone_id" int4,
  "user_id" varchar(50) COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Table structure for employees_packages
-- ----------------------------
DROP TABLE IF EXISTS "employees_packages";
CREATE TABLE "employees_packages" (
  "employee_package_id" int8 NOT NULL DEFAULT nextval('employees_packages_sequence_generator'::regclass),
  "created_date" timestamp(6) NOT NULL,
  "created_user" int8 NOT NULL,
  "updated_date" timestamp(6) NOT NULL,
  "updated_user" int8 NOT NULL,
  "employee_id" int8 NOT NULL,
  "package_id" int8 NOT NULL
)
;

-- ----------------------------
-- Table structure for positions
-- ----------------------------
DROP TABLE IF EXISTS "positions";
CREATE TABLE "positions" (
  "position_id" int8 NOT NULL,
  "created_date" timestamp(6) NOT NULL,
  "created_user" int8 NOT NULL,
  "updated_date" timestamp(6) NOT NULL,
  "updated_user" int8 NOT NULL,
  "position_name" jsonb NOT NULL,
  "position_order" int4,
  "is_available" bool
)
;

-- ----------------------------
-- Function structure for updated_date
-- ----------------------------
DROP FUNCTION IF EXISTS "updated_date"();
CREATE OR REPLACE FUNCTION "updated_date"()
  RETURNS "pg_catalog"."trigger" AS $BODY$
            BEGIN
                NEW.updated_date := NOW();
                RETURN NEW;
            END;
            $BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;

-- ----------------------------
-- Primary Key structure for table departments
-- ----------------------------
ALTER TABLE "departments" ADD CONSTRAINT "departments_pkey" PRIMARY KEY ("department_id");

-- ----------------------------
-- Primary Key structure for table employees
-- ----------------------------
ALTER TABLE "employees" ADD CONSTRAINT "employees_pkey" PRIMARY KEY ("employee_id");

-- ----------------------------
-- Primary Key structure for table employees_departments
-- ----------------------------
ALTER TABLE "employees_departments" ADD CONSTRAINT "employees_departments_pkey" PRIMARY KEY ("employees_departments_id");

-- ----------------------------
-- Primary Key structure for table employees_group_members
-- ----------------------------
ALTER TABLE "employees_group_members" ADD CONSTRAINT "employees_group_members_pkey" PRIMARY KEY ("group_member_id");

-- ----------------------------
-- Primary Key structure for table employees_group_participants
-- ----------------------------
ALTER TABLE "employees_group_participants" ADD CONSTRAINT "employees_group_participants_pkey" PRIMARY KEY ("employee_group_participant_id");

-- ----------------------------
-- Primary Key structure for table employees_group_search_conditions
-- ----------------------------
ALTER TABLE "employees_group_search_conditions" ADD CONSTRAINT "employees_group_search_conditions_pkey" PRIMARY KEY ("search_content_id");

-- ----------------------------
-- Primary Key structure for table employees_groups
-- ----------------------------
ALTER TABLE "employees_groups" ADD CONSTRAINT "employees_groups_pkey" PRIMARY KEY ("group_id");

-- ----------------------------
-- Primary Key structure for table employees_histories
-- ----------------------------
ALTER TABLE "employees_histories" ADD CONSTRAINT "employees_histories_pkey" PRIMARY KEY ("employee_history_id");

-- ----------------------------
-- Primary Key structure for table employees_packages
-- ----------------------------
ALTER TABLE "employees_packages" ADD CONSTRAINT "employees_packages_pkey" PRIMARY KEY ("employee_package_id");

-- ----------------------------
-- Primary Key structure for table positions
-- ----------------------------
ALTER TABLE "positions" ADD CONSTRAINT "positions_pkey" PRIMARY KEY ("position_id");

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
SELECT setval('"employees_sequence_generator"', 10001, true);

/**
-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
SELECT setval('"departments_sequence_generator"', 41, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
SELECT setval('"emp_detail_sequence_generator"', 9, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
SELECT setval('"employees_departments_sequence_generator"', 428, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
SELECT setval('"employees_group_members_sequence_generator"', 401, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
SELECT setval('"employees_group_participants_sequence_generator"', 254, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
SELECT setval('"employees_group_search_conditions_sequence_generator"', 123, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
SELECT setval('"employees_groups_sequence_generator"', 195, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
SELECT setval('"employees_histories_sequence_generator"', 1076, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
SELECT setval('"employees_options_sequence_generator"', 81, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
SELECT setval('"employees_subscriptions_sequence_generator"', 39, true);
*/