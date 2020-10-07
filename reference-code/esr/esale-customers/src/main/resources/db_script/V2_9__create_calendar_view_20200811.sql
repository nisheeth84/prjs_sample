DROP FOREIGN TABLE IF EXISTS "calendars_view";
CREATE FOREIGN TABLE "calendars_view" (
  "calendar_id" int8 NOT NULL,
  "item_division" int2 NOT NULL,
  "start_date" timestamp(6),
  "finish_date" timestamp(6),
  "is_public" bool,
  "created_date" timestamp(6) NOT NULL,
  "created_user" int8 NOT NULL,
  "updated_date" timestamp(6) NOT NULL,
  "updated_user" int8 NOT NULL
)
SERVER "schedules_dbrmd"
OPTIONS ("table_name" 'calendars')
;

ALTER TABLE "customers" ALTER COLUMN "building" TYPE varchar(450);
ALTER TABLE "customers" ALTER COLUMN "address" TYPE varchar(450);