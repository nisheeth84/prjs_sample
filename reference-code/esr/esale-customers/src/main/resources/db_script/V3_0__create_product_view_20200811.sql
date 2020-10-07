-- Create server for products database
CREATE SERVER IF NOT EXISTS products_dbrmd FOREIGN DATA WRAPPER postgres_fdw OPTIONS (hostaddr '127.0.0.1', dbname 'products');
CREATE USER MAPPING IF NOT EXISTS FOR postgres SERVER products_dbrmd OPTIONS (user 'postgres', password '');

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