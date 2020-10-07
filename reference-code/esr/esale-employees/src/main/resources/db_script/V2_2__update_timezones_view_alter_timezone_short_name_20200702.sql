DROP FOREIGN TABLE IF EXISTS "timezones_view" CASCADE;
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