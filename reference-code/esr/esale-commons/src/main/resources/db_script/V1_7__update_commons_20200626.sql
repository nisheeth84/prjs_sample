-- ----------------------------
-- Sequence structure for import_histories_sequence_generator
-- ----------------------------
DROP TABLE IF EXISTS "import_histories";
DROP SEQUENCE IF EXISTS "import_histories_sequence_generator";
CREATE SEQUENCE "import_histories_sequence_generator" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Table structure for import_histories
-- ----------------------------
CREATE TABLE "import_histories" (
  "import_history_id" int8 NOT NULL DEFAULT nextval('import_histories_sequence_generator'::regclass),
  "import_belong" int NOT NULL,
  "import_file_name" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "import_file_path" varchar(255) COLLATE "pg_catalog"."default",
  "is_simulation_mode" bool NOT NULL,
  "import_action" int NOT NULL,
  "is_duplicate_allowed" bool NOT NULL,
  "mapping_item" JSONB,
  "matching_key" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "matching_relation" JSONB,
  "batch_activate_mode" int NOT NULL DEFAULT 1,
  "is_import_succeed" bool,
  "import_file_record_total" int8,
  "import_batch_start_time" timestamp(6),
  "import_batch_finish_time" timestamp(6),
  "error_count" int8,
  "inserted_count" int8,
  "updated_count" int8,
  "import_error_file_path" varchar(255) COLLATE "pg_catalog"."default",
  "notice_list" JSONB,
  "is_auto_post_timeline" bool,
  "list_id" int8,
  "created_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_user" int8 NOT NULL,
  "updated_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_user" int8 NOT NULL
)
;
-- ----------------------------
-- Primary Key structure for table import_histories
-- ----------------------------
ALTER TABLE "import_histories" ADD CONSTRAINT "import_histories_pkey" PRIMARY KEY ("import_history_id");


-- ----------------------------
-- Add column user_id
-- ----------------------------
ALTER TABLE "access_log" ADD COLUMN IF NOT EXISTS "user_id" int8;


-- ----------------------------
-- Add column user_name
-- ----------------------------
ALTER TABLE "access_log" ADD COLUMN IF NOT EXISTS "user_name" varchar(255) COLLATE "pg_catalog"."default";


-- ----------------------------
-- Add column using_date
-- ----------------------------
ALTER TABLE "access_log" ADD COLUMN IF NOT EXISTS "using_date" timestamp(6);


-- ----------------------------
-- Add column function_id
-- ----------------------------
ALTER TABLE "access_log" ADD COLUMN IF NOT EXISTS "function_id" varchar(16) COLLATE "pg_catalog"."default";


-- ----------------------------
-- Add column export_record_count
-- ----------------------------
ALTER TABLE "access_log" ADD COLUMN IF NOT EXISTS "export_record_count" int;


-- ----------------------------
-- Add column parameter
-- ----------------------------
ALTER TABLE "access_log" ADD COLUMN IF NOT EXISTS "parameter" text  COLLATE "pg_catalog"."default";


-- ----------------------------
-- Remove column content
-- ----------------------------
ALTER TABLE "access_log" DROP IF EXISTS "content";


-- ----------------------------
-- Add column parameter
-- ----------------------------
ALTER TABLE "field_info" ALTER COLUMN "config_value" TYPE VARCHAR  COLLATE "pg_catalog"."default";


-- ----------------------------
-- Renname table table "addresses" -> "address"
-- ----------------------------
ALTER TABLE IF EXISTS "addresses" RENAME TO "address";


-- ----------------------------
-- Add column select_organization_data
-- ----------------------------
ALTER TABLE "field_info" ADD COLUMN IF NOT EXISTS "select_organization_data" JSONB;


