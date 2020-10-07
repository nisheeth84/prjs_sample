UPDATE "customers_list_search_conditions" SET "search_value" = NULL;
ALTER TABLE "customers_list_search_conditions" ALTER COLUMN "search_value" TYPE jsonb USING ("search_value"::jsonb);

ALTER TABLE "customers_list_search_conditions" ADD COLUMN IF NOT EXISTS "field_order" int;