-- ----------------------------
-- Table structure for field_info_view
-- ----------------------------
DROP FOREIGN TABLE IF EXISTS "field_info_view";
CREATE FOREIGN TABLE "field_info_view" (
  "field_id" int8 NOT NULL,
  "created_date" timestamp(6) NOT NULL,
  "created_user" int8 NOT NULL,
  "updated_date" timestamp(6) NOT NULL,
  "updated_user" int8 NOT NULL,
  "config_value" varchar COLLATE "pg_catalog"."default",
  "decimal_place" int4,
  "default_value" varchar(1000) COLLATE "pg_catalog"."default",
  "field_belong" int4 NOT NULL,
  "field_name" varchar(60) COLLATE "pg_catalog"."default" NOT NULL,
  "field_order" int4,
  "field_type" int4,
  "is_double_column" bool,
  "is_linked_google_map" bool,
  "url_target" varchar(1000) COLLATE "pg_catalog"."default",
  "url_text" varchar(500) COLLATE "pg_catalog"."default",
  "field_group" int8,
  "field_label" jsonb NOT NULL,
  "modify_flag" int4,
  "available_flag" int4 NOT NULL,
  "link_target" int4,
  "currency_unit" varchar(50) COLLATE "pg_catalog"."default",
  "url_type" int4,
  "lookup_data" jsonb,
  "relation_data" jsonb,
  "is_default" bool,
  "max_length" int4,
  "type_unit" int4,
  "tab_data" jsonb,
  "lookup_field_id" int8,
  "iframe_height" int4,
  "difference_setting" jsonb,
  "select_organization_data" jsonb,
  "statistics_item_flag" int4 NOT NULL DEFAULT 1,
  "statistics_condition_flag" int4 NOT NULL DEFAULT 1
)
SERVER "commons_dbrmd"
OPTIONS ("table_name" 'field_info');