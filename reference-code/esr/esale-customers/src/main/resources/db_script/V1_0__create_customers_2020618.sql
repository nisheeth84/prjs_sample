/*
 VersionL 0.7
*/


-- ----------------------------
-- Sequence structure for customers_business_sequence_generator
-- ----------------------------
DROP SEQUENCE IF EXISTS "customers_business_sequence_generator";
CREATE SEQUENCE "customers_business_sequence_generator" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for customers_histories_sequence_generator
-- ----------------------------
DROP SEQUENCE IF EXISTS "customers_histories_sequence_generator";
CREATE SEQUENCE "customers_histories_sequence_generator" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for customers_list_favourites_sequence_generator
-- ----------------------------
DROP SEQUENCE IF EXISTS "customers_list_favourites_sequence_generator";
CREATE SEQUENCE "customers_list_favourites_sequence_generator" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for customers_list_members_sequence_generator
-- ----------------------------
DROP SEQUENCE IF EXISTS "customers_list_members_sequence_generator";
CREATE SEQUENCE "customers_list_members_sequence_generator" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for customers_list_participants_sequence_generator
-- ----------------------------
DROP SEQUENCE IF EXISTS "customers_list_participants_sequence_generator";
CREATE SEQUENCE "customers_list_participants_sequence_generator" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for customers_list_search_conditions_sequence_generator
-- ----------------------------
DROP SEQUENCE IF EXISTS "customers_list_search_conditions_sequence_generator";
CREATE SEQUENCE "customers_list_search_conditions_sequence_generator" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for customers_list_sequence_generator
-- ----------------------------
DROP SEQUENCE IF EXISTS "customers_list_sequence_generator";
CREATE SEQUENCE "customers_list_sequence_generator" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for customers_sequence_generator
-- ----------------------------
DROP SEQUENCE IF EXISTS "customers_sequence_generator";
CREATE SEQUENCE "customers_sequence_generator" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for masters_motivations_sequence_generator
-- ----------------------------
DROP SEQUENCE IF EXISTS "masters_motivations_sequence_generator";
CREATE SEQUENCE "masters_motivations_sequence_generator" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for masters_scenarios_details_sequence_generator
-- ----------------------------
DROP SEQUENCE IF EXISTS "masters_scenarios_details_sequence_generator";
CREATE SEQUENCE "masters_scenarios_details_sequence_generator" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for masters_scenarios_sequence_generator
-- ----------------------------
DROP SEQUENCE IF EXISTS "masters_scenarios_sequence_generator";
CREATE SEQUENCE "masters_scenarios_sequence_generator" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for masters_stands_sequence_generator
-- ----------------------------
DROP SEQUENCE IF EXISTS "masters_stands_sequence_generator";
CREATE SEQUENCE "masters_stands_sequence_generator" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for network_stands_sequence_generator
-- ----------------------------
DROP SEQUENCE IF EXISTS "network_stands_sequence_generator";
CREATE SEQUENCE "network_stands_sequence_generator" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Table structure for customers
-- ----------------------------
DROP TABLE IF EXISTS "customers";
CREATE TABLE "customers" (
  "customer_id" int8 NOT NULL DEFAULT nextval('customers_sequence_generator'::regclass),
  "photo_file_name" varchar(255) COLLATE "pg_catalog"."default",
  "photo_file_path" varchar(255) COLLATE "pg_catalog"."default",
  "parent_id" int8,
  "customer_name" varchar(100) COLLATE "pg_catalog"."default",
  "customer_alias_name" varchar(100) COLLATE "pg_catalog"."default",
  "phone_number" varchar(20) COLLATE "pg_catalog"."default",
  "zip_code" varchar(16) COLLATE "pg_catalog"."default",
  "building" varchar(255) COLLATE "pg_catalog"."default",
  "address" varchar(255) COLLATE "pg_catalog"."default",
  "business_main_id" int4,
  "business_sub_id" int4,
  "url" text COLLATE "pg_catalog"."default",
  "employee_id" int8,
  "department_id" int8,
  "group_id" int8,
  "scenario_id" int8,
  "memo" text COLLATE "pg_catalog"."default",
  "longitude" numeric(13),
  "latitude" numeric(13),
  "customer_data" jsonb,
  "parent_tree" int8[],
  "created_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_user" int8 NOT NULL,
  "updated_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_user" int8 NOT NULL
)
;

-- ----------------------------
-- Table structure for customers_business
-- ----------------------------
DROP TABLE IF EXISTS "customers_business";
CREATE TABLE "customers_business" (
  "customer_business_id" int8 NOT NULL DEFAULT nextval('customers_business_sequence_generator'::regclass),
  "customer_business_name" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "customer_business_parent" int8 NOT NULL,
  "created_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_user" int8 NOT NULL,
  "updated_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_user" int8 NOT NULL
)
;

-- ----------------------------
-- Table structure for customers_histories
-- ----------------------------
DROP TABLE IF EXISTS "customers_histories";
CREATE TABLE "customers_histories" (
  "customer_history_id" int8 NOT NULL DEFAULT nextval('customers_histories_sequence_generator'::regclass),
  "customer_id" int8 NOT NULL,
  "content_change" jsonb,
  "created_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_user" int8 NOT NULL,
  "updated_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_user" int8 NOT NULL
)
;

-- ----------------------------
-- Table structure for customers_list
-- ----------------------------
DROP TABLE IF EXISTS "customers_list";
CREATE TABLE "customers_list" (
  "customer_list_id" int8 NOT NULL DEFAULT nextval('customers_list_sequence_generator'::regclass),
  "customer_list_name" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "customer_list_type" int4,
  "is_auto_list" bool,
  "updated_inprogress" bool,
  "last_updated_date" timestamp(6),
  "is_over_write" bool,
  "created_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_user" int8 NOT NULL,
  "updated_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_user" int8 NOT NULL
)
;

-- ----------------------------
-- Table structure for customers_list_favourites
-- ----------------------------
DROP TABLE IF EXISTS "customers_list_favourites";
CREATE TABLE "customers_list_favourites" (
  "customer_list_favourite_id" int8 NOT NULL DEFAULT nextval('customers_list_favourites_sequence_generator'::regclass),
  "customer_list_id" int8 NOT NULL,
  "employee_id" int8 NOT NULL,
  "created_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_user" int8 NOT NULL,
  "updated_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_user" int8 NOT NULL
)
;

-- ----------------------------
-- Table structure for customers_list_members
-- ----------------------------
DROP TABLE IF EXISTS "customers_list_members";
CREATE TABLE "customers_list_members" (
  "customer_list_member_id" int8 NOT NULL DEFAULT nextval('customers_list_members_sequence_generator'::regclass),
  "customer_list_id" int8 NOT NULL,
  "customer_id" int8 NOT NULL,
  "created_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_user" int8 NOT NULL,
  "updated_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_user" int8 NOT NULL
)
;

-- ----------------------------
-- Table structure for customers_list_participants
-- ----------------------------
DROP TABLE IF EXISTS "customers_list_participants";
CREATE TABLE "customers_list_participants" (
  "customer_list_participant_id" int8 NOT NULL DEFAULT nextval('customers_list_participants_sequence_generator'::regclass),
  "customer_list_id" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "employee_id" int8,
  "department_id" int8,
  "group_id" int8,
  "participant_type" int4 DEFAULT 1,
  "created_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_user" int8 NOT NULL,
  "updated_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_user" int8 NOT NULL
)
;

-- ----------------------------
-- Table structure for customers_list_search_conditions
-- ----------------------------
DROP TABLE IF EXISTS "customers_list_search_conditions";
CREATE TABLE "customers_list_search_conditions" (
  "customer_list_search_condition_id" int8 NOT NULL DEFAULT nextval('customers_list_search_conditions_sequence_generator'::regclass),
  "customer_list_id" int8 NOT NULL,
  "field_id" int8 NOT NULL,
  "search_type" int4,
  "search_option" int4,
  "search_value" varchar(200) COLLATE "pg_catalog"."default",
  "created_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_user" int8 NOT NULL,
  "updated_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_user" int8 NOT NULL
)
;

-- ----------------------------
-- Table structure for masters_motivations
-- ----------------------------
DROP TABLE IF EXISTS "masters_motivations";
CREATE TABLE "masters_motivations" (
  "master_motivation_id" int8 NOT NULL DEFAULT nextval('masters_motivations_sequence_generator'::regclass),
  "master_motivation_name" jsonb NOT NULL,
  "icon_type" int4 NOT NULL,
  "icon_path" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "icon_name" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "background_color" int4 NOT NULL,
  "is_available" bool NOT NULL DEFAULT true,
  "display_order" int4,
  "created_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_user" int8 NOT NULL,
  "updated_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_user" int8 NOT NULL
)
;

-- ----------------------------
-- Table structure for masters_scenarios
-- ----------------------------
DROP TABLE IF EXISTS "masters_scenarios";
CREATE TABLE "masters_scenarios" (
  "scenario_id" int8 NOT NULL DEFAULT nextval('masters_scenarios_sequence_generator'::regclass),
  "scenario_name" jsonb NOT NULL,
  "created_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_user" int8 NOT NULL,
  "updated_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_user" int8 NOT NULL
)
;

-- ----------------------------
-- Table structure for masters_scenarios_details
-- ----------------------------
DROP TABLE IF EXISTS "masters_scenarios_details";
CREATE TABLE "masters_scenarios_details" (
  "scenario_detail_id" int8 NOT NULL DEFAULT nextval('masters_scenarios_details_sequence_generator'::regclass),
  "scenario_id" int8 NOT NULL,
  "milestone_name" varchar(255) COLLATE "pg_catalog"."default",
  "created_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_user" int8 NOT NULL,
  "updated_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_user" int8 NOT NULL,
  "display_order" int4
)
;

-- ----------------------------
-- Table structure for masters_stands
-- ----------------------------
DROP TABLE IF EXISTS "masters_stands";
CREATE TABLE "masters_stands" (
  "master_stand_id" int8 NOT NULL DEFAULT nextval('masters_stands_sequence_generator'::regclass),
  "master_stand_name" jsonb NOT NULL,
  "is_available" bool NOT NULL,
  "display_order" int4,
  "created_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_user" int8 NOT NULL,
  "updated_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_user" int8 NOT NULL
)
;

-- ----------------------------
-- Table structure for network_stands
-- ----------------------------
DROP TABLE IF EXISTS "network_stands";
CREATE TABLE "network_stands" (
  "network_stand_id" int8 NOT NULL DEFAULT nextval('network_stands_sequence_generator'::regclass),
  "business_card_company_id" int8 NOT NULL,
  "business_card_department_id" int8 NOT NULL,
  "business_card_id" int8 NOT NULL,
  "stand_id" int8,
  "motivation_id" int8,
  "product_trading_id" int8,
  "comment" text COLLATE "pg_catalog"."default",
  "created_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_user" int8 NOT NULL,
  "updated_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_user" int8 NOT NULL
)
;

-- ----------------------------
-- Primary Key structure for table customers
-- ----------------------------
ALTER TABLE "customers" ADD CONSTRAINT "customers_pkey" PRIMARY KEY ("customer_id");

-- ----------------------------
-- Primary Key structure for table customers_business
-- ----------------------------
ALTER TABLE "customers_business" ADD CONSTRAINT "customers_business_pkey" PRIMARY KEY ("customer_business_id");

-- ----------------------------
-- Primary Key structure for table customers_histories
-- ----------------------------
ALTER TABLE "customers_histories" ADD CONSTRAINT "customers_histories_pkey" PRIMARY KEY ("customer_history_id");

-- ----------------------------
-- Primary Key structure for table customers_list
-- ----------------------------
ALTER TABLE "customers_list" ADD CONSTRAINT "customers_list_pkey" PRIMARY KEY ("customer_list_id");

-- ----------------------------
-- Primary Key structure for table customers_list_favourites
-- ----------------------------
ALTER TABLE "customers_list_favourites" ADD CONSTRAINT "customers_list_favourites_pkey" PRIMARY KEY ("customer_list_favourite_id");

-- ----------------------------
-- Primary Key structure for table customers_list_members
-- ----------------------------
ALTER TABLE "customers_list_members" ADD CONSTRAINT "customers_list_members_pkey" PRIMARY KEY ("customer_list_member_id");

-- ----------------------------
-- Primary Key structure for table customers_list_participants
-- ----------------------------
ALTER TABLE "customers_list_participants" ADD CONSTRAINT "customers_list_participants_pkey" PRIMARY KEY ("customer_list_participant_id");

-- ----------------------------
-- Primary Key structure for table customers_list_search_conditions
-- ----------------------------
ALTER TABLE "customers_list_search_conditions" ADD CONSTRAINT "customers_list_search_conditions_pkey" PRIMARY KEY ("customer_list_search_condition_id");

-- ----------------------------
-- Primary Key structure for table masters_motivations
-- ----------------------------
ALTER TABLE "masters_motivations" ADD CONSTRAINT "masters_motivations_pkey" PRIMARY KEY ("master_motivation_id");

-- ----------------------------
-- Primary Key structure for table masters_scenarios
-- ----------------------------
ALTER TABLE "masters_scenarios" ADD CONSTRAINT "masters_scenarios_pkey" PRIMARY KEY ("scenario_id");

-- ----------------------------
-- Primary Key structure for table masters_scenarios_details
-- ----------------------------
ALTER TABLE "masters_scenarios_details" ADD CONSTRAINT "masters_scenarios_details_pkey" PRIMARY KEY ("scenario_detail_id");

-- ----------------------------
-- Primary Key structure for table masters_stands
-- ----------------------------
ALTER TABLE "masters_stands" ADD CONSTRAINT "masters_stands_pkey" PRIMARY KEY ("master_stand_id");

-- ----------------------------
-- Primary Key structure for table network_stands
-- ----------------------------
ALTER TABLE "network_stands" ADD CONSTRAINT "network_stands_pkey" PRIMARY KEY ("network_stand_id");
