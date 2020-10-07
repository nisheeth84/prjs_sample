UPDATE "customers_list_search_conditions" SET "search_value" = NULL;
ALTER TABLE "customers_list_search_conditions" ALTER COLUMN "search_value" TYPE text USING "search_value"::text;
ALTER TABLE "customers_list_search_conditions" ADD COLUMN IF NOT EXISTS "time_zone_offset" int4;