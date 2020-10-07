-- Create server for customers database
CREATE SERVER IF NOT EXISTS customers_dbrmd FOREIGN DATA WRAPPER postgres_fdw OPTIONS (hostaddr '127.0.0.1', dbname 'customers');
CREATE USER MAPPING IF NOT EXISTS FOR postgres SERVER customers_dbrmd OPTIONS (user 'postgres', password '');

-- ----------------------------
-- Table structure for customers
-- ----------------------------
DROP FOREIGN TABLE IF EXISTS "customers_view";
CREATE FOREIGN TABLE "customers_view" (
  "customer_id" int8 NOT NULL,
  "photo_file_name" varchar(255) COLLATE "pg_catalog"."default",
  "photo_file_path" text COLLATE "pg_catalog"."default",
  "parent_id" int8,
  "customer_name" varchar(100) COLLATE "pg_catalog"."default",
  "customer_alias_name" varchar(100) COLLATE "pg_catalog"."default",
  "phone_number" varchar(20) COLLATE "pg_catalog"."default",
  "zip_code" varchar(16) COLLATE "pg_catalog"."default",
  "building" varchar(450) COLLATE "pg_catalog"."default",
  "address" varchar(450) COLLATE "pg_catalog"."default",
  "business_main_id" int4,
  "business_sub_id" int4,
  "url" jsonb,
  "employee_id" int8,
  "department_id" int8,
  "group_id" int8,
  "scenario_id" int8,
  "memo" text COLLATE "pg_catalog"."default",
  "longitude" numeric(13),
  "latitude" numeric(13),
  "customer_data" jsonb,
  "created_date" timestamp(6) NOT NULL,
  "created_user" int8 NOT NULL,
  "updated_date" timestamp(6) NOT NULL,
  "updated_user" int8 NOT NULL,
  "parent_tree" jsonb
)
SERVER "customers_dbrmd"
OPTIONS ("table_name" 'customers')
;

-- Create server for activities database
CREATE SERVER IF NOT EXISTS activities_dbrmd FOREIGN DATA WRAPPER postgres_fdw OPTIONS (hostaddr '127.0.0.1', dbname 'activities');
CREATE USER MAPPING IF NOT EXISTS FOR postgres SERVER activities_dbrmd OPTIONS (user 'postgres', password '');

-- ----------------------------
-- Table structure for activities
-- ----------------------------
DROP FOREIGN TABLE IF EXISTS "activities_view";
CREATE FOREIGN TABLE "activities_view" (
  "activity_id" int8 NOT NULL,
  "activity_data" jsonb,
  "activity_duration" int4 NOT NULL,
  "activity_end_time" timestamp(6) NOT NULL,
  "activity_format_id" int8 NOT NULL,
  "activity_start_time" timestamp(6) NOT NULL,
  "contact_date" timestamp(6) NOT NULL,
  "customer_id" int8 NOT NULL,
  "employee_id" int8 NOT NULL,
  "memo" text COLLATE "pg_catalog"."default",
  "milestone_id" int8,
  "task_id" int8,
  "schedule_id" int8,
  "next_schedule_id" int8,
  "created_date" timestamp(6) NOT NULL,
  "created_user" int8 NOT NULL,
  "updated_date" timestamp(6) NOT NULL,
  "updated_user" int8 NOT NULL,
  "scenario_id" int8
)
SERVER "activities_dbrmd"
OPTIONS ("table_name" 'activities')
;

-- Create server for products database
CREATE SERVER IF NOT EXISTS products_dbrmd FOREIGN DATA WRAPPER postgres_fdw OPTIONS (hostaddr '127.0.0.1', dbname 'products');
CREATE USER MAPPING IF NOT EXISTS FOR postgres SERVER products_dbrmd OPTIONS (user 'postgres', password '');

-- ----------------------------
-- Table structure for products
-- ----------------------------
DROP FOREIGN TABLE IF EXISTS "products_view";
CREATE FOREIGN TABLE "products_view" (
  "product_id" int8 NOT NULL,
  "created_date" timestamp(6) NOT NULL,
  "created_user" int8 NOT NULL,
  "updated_date" timestamp(6) NOT NULL,
  "updated_user" int8 NOT NULL,
  "is_display" bool DEFAULT true,
  "is_set" bool DEFAULT false,
  "memo" varchar(500) COLLATE "pg_catalog"."default",
  "product_category_id" int8,
  "product_data" jsonb,
  "product_image_name" varchar(100) COLLATE "pg_catalog"."default",
  "product_image_path" varchar(255) COLLATE "pg_catalog"."default",
  "product_name" varchar(255) COLLATE "pg_catalog"."default",
  "product_type_id" int8,
  "unit_price" int8
)
SERVER "products_dbrmd"
OPTIONS ("table_name" 'products')
;

-- Create server for schedules database
CREATE SERVER IF NOT EXISTS schedules_dbrmd FOREIGN DATA WRAPPER postgres_fdw OPTIONS (hostaddr '127.0.0.1', dbname 'schedules');
CREATE USER MAPPING IF NOT EXISTS FOR postgres SERVER schedules_dbrmd OPTIONS (user 'postgres', password '');

-- ----------------------------
-- Table structure for schedules
-- ----------------------------
DROP FOREIGN TABLE IF EXISTS "schedules_view";
CREATE FOREIGN TABLE "schedules_view" (
  "schedule_id" int8 NOT NULL,
  "schedule_repeat_id" int8,
  "calendar_id" int8 NOT NULL,
  "schedule_type_id" int8 NOT NULL,
  "schedule_name" varchar(1000) COLLATE "pg_catalog"."default" NOT NULL,
  "is_full_day" bool,
  "is_repeated" bool,
  "is_all_attended" bool,
  "customer_id" int8,
  "zip_code" varchar(16) COLLATE "pg_catalog"."default",
  "address" varchar(1000) COLLATE "pg_catalog"."default",
  "building_name" varchar(1000) COLLATE "pg_catalog"."default",
  "note" text COLLATE "pg_catalog"."default",
  "can_modify" bool,
  "created_date" timestamp(6) NOT NULL,
  "created_user" int8 NOT NULL,
  "updated_date" timestamp(6) NOT NULL,
  "updated_user" int8 NOT NULL
)
SERVER "schedules_dbrmd"
OPTIONS ("table_name" 'schedules')
;

-- Create server for businesscards database
CREATE SERVER IF NOT EXISTS businesscards_dbrmd FOREIGN DATA WRAPPER postgres_fdw OPTIONS (hostaddr '127.0.0.1', dbname 'businesscards');
CREATE USER MAPPING IF NOT EXISTS FOR postgres SERVER businesscards_dbrmd OPTIONS (user 'postgres', password '');
-- ----------------------------
-- Table structure for business_cards
-- ----------------------------
DROP FOREIGN TABLE IF EXISTS "business_cards_view";
CREATE FOREIGN TABLE "business_cards_view" (
  "business_card_id" int8 NOT NULL,
  "customer_id" int8,
  "alternative_customer_name" varchar(100) COLLATE "pg_catalog"."default",
  "first_name" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "last_name" varchar(100) COLLATE "pg_catalog"."default",
  "first_name_kana" varchar(100) COLLATE "pg_catalog"."default",
  "last_name_kana" varchar(100) COLLATE "pg_catalog"."default",
  "business_card_image_path" varchar(500) COLLATE "pg_catalog"."default" NOT NULL,
  "business_card_image_name" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "position" varchar(100) COLLATE "pg_catalog"."default",
  "department_name" varchar(100) COLLATE "pg_catalog"."default",
  "zip_code" varchar(16) COLLATE "pg_catalog"."default",
  "building" varchar(255) COLLATE "pg_catalog"."default",
  "address" varchar(255) COLLATE "pg_catalog"."default",
  "email_address" varchar(255) COLLATE "pg_catalog"."default",
  "phone_number" varchar(20) COLLATE "pg_catalog"."default",
  "mobile_number" varchar(20) COLLATE "pg_catalog"."default",
  "last_contact_date" timestamp(6),
  "is_working" bool DEFAULT false,
  "memo" text COLLATE "pg_catalog"."default",
  "is_digitalize" bool DEFAULT false,
  "is_hand_mode" bool DEFAULT false,
  "fax" varchar(100) COLLATE "pg_catalog"."default",
  "url" varchar(100) COLLATE "pg_catalog"."default",
  "save_mode" int4,
  "is_auto_generated_image" bool,
  "business_card_data" jsonb,
  "created_date" timestamp(6) NOT NULL,
  "created_user" int8 NOT NULL,
  "updated_date" timestamp(6) NOT NULL,
  "updated_user" int8 NOT NULL
)
SERVER "businesscards_dbrmd"
OPTIONS ("table_name" 'business_cards')
;