CREATE EXTENSION IF NOT EXISTS postgres_fdw;

-- Create server for tenant database
CREATE SERVER IF NOT EXISTS tenant_dbrmd FOREIGN DATA WRAPPER postgres_fdw OPTIONS (hostaddr '127.0.0.1', dbname 'tenants');
CREATE USER MAPPING IF NOT EXISTS FOR postgres SERVER tenant_dbrmd OPTIONS (user 'postgres', password '');

DROP FOREIGN TABLE IF EXISTS "packages_view";
CREATE FOREIGN TABLE "packages_view" (
  "m_package_id" int8 NOT NULL,
  "package_name" varchar(255) NOT NULL,
  "type" int4 NOT NULL,
  "expiration_date" timestamp(6),
  "created_date" timestamp(6) NOT NULL,
  "created_user" int8 NOT NULL,
  "updated_date" timestamp(6) NOT NULL,
  "updated_user" int8 NOT NULL
)
SERVER "tenant_dbrmd"
OPTIONS ("table_name" 'm_packages')
;