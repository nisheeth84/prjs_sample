CREATE EXTENSION IF NOT EXISTS postgres_fdw;

-- Create server for commons database
CREATE SERVER IF NOT EXISTS commons_dbrmd FOREIGN DATA WRAPPER postgres_fdw OPTIONS (hostaddr '127.0.0.1', dbname 'commons');
CREATE USER MAPPING IF NOT EXISTS FOR postgres SERVER commons_dbrmd OPTIONS (user 'postgres', password '');

DROP FOREIGN TABLE IF EXISTS "field_info_view";
CREATE FOREIGN TABLE "field_info_view" (
  "field_id" int8 NOT NULL,
  "created_date" timestamp(6) NOT NULL,
  "created_user" int8 NOT NULL,
  "updated_date" timestamp(6) NOT NULL,
  "updated_user" int8 NOT NULL,
  "config_value" varchar(4000) COLLATE "pg_catalog"."default",
  "decimal_place" int4,
  "default_value" varchar(1000) COLLATE "pg_catalog"."default",
  "field_belong" int4 NOT NULL,
  "field_name" varchar(60) COLLATE "pg_catalog"."default" NOT NULL,
  "field_order" int4,
  "field_type" int4,
  "is_double_column" bool,
  "is_linked_google_map" bool,
  "others_permission_level" int4,
  "own_permission_level" int4,
  "url_target" varchar(1000) COLLATE "pg_catalog"."default",
  "url_text" varchar(500) COLLATE "pg_catalog"."default",
  "field_group" int8,
  "field_label" jsonb NOT NULL,
  "modify_flag" int4,
  "available_flag" int4,
  "link_target" int4,
  "currency_unit" varchar(50) COLLATE "pg_catalog"."default",
  "url_type" int4,
  "lookup_data" jsonb,
  "select_organization_data" jsonb,
  "relation_data" jsonb,
  "is_default" bool,
  "max_length" int4,
  "type_unit" int4,
  "tab_data" jsonb,
  "lookup_field_id" int8,
  "looked_field_id" int8,
  "iframe_height" int4
)
SERVER "commons_dbrmd"
OPTIONS ("table_name" 'field_info')
;

DROP FOREIGN TABLE IF EXISTS "field_info_personal_view";
CREATE FOREIGN TABLE "field_info_personal_view" (
  "field_info_personal_id" int8 NOT NULL,
  "created_date" timestamp(6) NOT NULL,
  "created_user" int8 NOT NULL,
  "updated_date" timestamp(6) NOT NULL,
  "updated_user" int8 NOT NULL,
  "column_width" int4,
  "employee_id" int8 NOT NULL,
  "extension_belong" int4 NOT NULL,
  "field_id" int8 NOT NULL,
  "field_order" int4,
  "is_column_fixed" bool,
  "field_belong" int4 NOT NULL,
  "relation_field_id" int8
)
SERVER "commons_dbrmd"
OPTIONS ("table_name" 'field_info_personal')
;

DROP FOREIGN TABLE IF EXISTS "field_info_item_view";
CREATE FOREIGN TABLE "field_info_item_view" (
  "item_id" int8 NOT NULL,
  "created_date" timestamp(6) NOT NULL,
  "created_user" int8 NOT NULL,
  "updated_date" timestamp(6) NOT NULL,
  "updated_user" int8 NOT NULL,
  "field_id" int8 NOT NULL,
  "is_available" bool,
  "is_default" bool,
  "item_order" int4,
  "item_label" jsonb NOT NULL
)
SERVER "commons_dbrmd"
OPTIONS ("table_name" 'field_info_item')
;

DROP FOREIGN TABLE IF EXISTS "languages_view";
CREATE FOREIGN TABLE "languages_view" (
  "language_id" int8 NOT NULL,
  "created_date" timestamp(6) NOT NULL,
  "created_user" int8 NOT NULL,
  "updated_date" timestamp(6) NOT NULL,
  "updated_user" int8 NOT NULL,
  "display_order" int8,
  "language_code" varchar(5) COLLATE "pg_catalog"."default" NOT NULL,
  "language_name" varchar(50) COLLATE "pg_catalog"."default" NOT NULL
)
SERVER "commons_dbrmd"
OPTIONS ("table_name" 'languages')
;

DROP FOREIGN TABLE IF EXISTS "timezones_view";
CREATE FOREIGN TABLE "timezones_view" (
  "timezone_id" int8 NOT NULL,
  "created_date" timestamp(6) NOT NULL,
  "created_user" int8 NOT NULL,
  "updated_date" timestamp(6) NOT NULL,
  "updated_user" int8 NOT NULL,
  "display_order" int4,
  "timezone_name" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "timezone_short_name" varchar(50) COLLATE "pg_catalog"."default" NOT NULL
)
SERVER "commons_dbrmd"
OPTIONS ("table_name" 'timezones')
;

-- Create server for schedules database
CREATE SERVER IF NOT EXISTS schedules_dbrmd FOREIGN DATA WRAPPER postgres_fdw OPTIONS (hostaddr '127.0.0.1', dbname 'schedules');
CREATE USER MAPPING IF NOT EXISTS FOR postgres SERVER schedules_dbrmd OPTIONS (user 'postgres', password '');


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

DROP FOREIGN TABLE IF EXISTS "tasks_view";
CREATE FOREIGN TABLE "tasks_view" (
  "task_id" int8 NOT NULL,
  "created_date" timestamp(6) NOT NULL,
  "created_user" int8 NOT NULL,
  "updated_date" timestamp(6) NOT NULL,
  "updated_user" int8 NOT NULL,
  "calendar_id" int8,
  "customer_id" int8,
  "memo" text COLLATE "pg_catalog"."default",
  "milestone_id" int8,
  "parent_id" int8,
  "status" int4,
  "task_data" jsonb,
  "task_name" varchar(255) COLLATE "pg_catalog"."default"
)
SERVER "schedules_dbrmd"
OPTIONS ("table_name" 'tasks')
;

-- Create server for employees database
CREATE SERVER IF NOT EXISTS employees_dbrmd FOREIGN DATA WRAPPER postgres_fdw OPTIONS (hostaddr '127.0.0.1', dbname 'employees');
CREATE USER MAPPING IF NOT EXISTS FOR postgres SERVER employees_dbrmd OPTIONS (user 'postgres', password '');

DROP FOREIGN TABLE IF EXISTS "employees_view";
CREATE FOREIGN TABLE "employees_view" (
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
  "photo_file_name" varchar(255) COLLATE "pg_catalog"."default",
  "photo_file_path" varchar(255) COLLATE "pg_catalog"."default",
  "telephone_number" varchar(20) COLLATE "pg_catalog"."default",
  "timezone_id" int8,
  "user_id" varchar(50) COLLATE "pg_catalog"."default",
  "is_admin" bool,
  "format_date_id" int4,
  "is_account_quicksight" bool,
  "is_display_first_screen" bool
)
SERVER "employees_dbrmd"
OPTIONS ("table_name" 'employees')
;