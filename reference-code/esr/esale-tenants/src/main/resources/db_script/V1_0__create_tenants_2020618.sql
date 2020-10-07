/*
 Version: 1.6
*/


-- ----------------------------
-- Sequence structure for license_packages_sequence_generator
-- ----------------------------
DROP SEQUENCE IF EXISTS "license_packages_sequence_generator";
CREATE SEQUENCE "license_packages_sequence_generator" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for m_industries_sequence_generator
-- ----------------------------
DROP SEQUENCE IF EXISTS "m_industries_sequence_generator";
CREATE SEQUENCE "m_industries_sequence_generator" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for m_packages_sequence_generator
-- ----------------------------
DROP SEQUENCE IF EXISTS "m_packages_sequence_generator";
CREATE SEQUENCE "m_packages_sequence_generator" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for m_packages_services_sequence_generator
-- ----------------------------
DROP SEQUENCE IF EXISTS "m_packages_services_sequence_generator";
CREATE SEQUENCE "m_packages_services_sequence_generator" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for m_services_sequence_generator
-- ----------------------------
DROP SEQUENCE IF EXISTS "m_services_sequence_generator";
CREATE SEQUENCE "m_services_sequence_generator" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for m_templates_sequence_generator
-- ----------------------------
DROP SEQUENCE IF EXISTS "m_templates_sequence_generator";
CREATE SEQUENCE "m_templates_sequence_generator" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for payments_management_sequence_generator
-- ----------------------------
DROP SEQUENCE IF EXISTS "payments_management_sequence_generator";
CREATE SEQUENCE "payments_management_sequence_generator" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for quicksight_settings_sequence_generator
-- ----------------------------
DROP SEQUENCE IF EXISTS "quicksight_settings_sequence_generator";
CREATE SEQUENCE "quicksight_settings_sequence_generator" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for storages_management_sequence_generator
-- ----------------------------
DROP SEQUENCE IF EXISTS "storages_management_sequence_generator";
CREATE SEQUENCE "storages_management_sequence_generator" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for tenants_sequence_generator
-- ----------------------------
DROP SEQUENCE IF EXISTS "tenants_sequence_generator";
CREATE SEQUENCE "tenants_sequence_generator" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Table structure for license_packages
-- ----------------------------
DROP TABLE IF EXISTS "license_packages";
CREATE TABLE "license_packages" (
  "license_id" int8 NOT NULL DEFAULT nextval('license_packages_sequence_generator'::regclass),
  "m_package_id" int8 NOT NULL,
  "tenant_id" int8 NOT NULL,
  "available_license_number" int4 NOT NULL,
  "created_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_user" int8 NOT NULL,
  "updated_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_user" int8 NOT NULL
)
;

-- ----------------------------
-- Table structure for m_industries
-- ----------------------------
DROP TABLE IF EXISTS "m_industries";
CREATE TABLE "m_industries" (
  "m_industry_id" int8 NOT NULL DEFAULT nextval('m_industries_sequence_generator'::regclass),
  "industry_type_name" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "industry_type_name_jp" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "schema_name" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "created_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_user" int8 NOT NULL,
  "updated_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_user" int8 NOT NULL
)
;

-- ----------------------------
-- Table structure for m_packages
-- ----------------------------
DROP TABLE IF EXISTS "m_packages";
CREATE TABLE "m_packages" (
  "m_package_id" int8 NOT NULL DEFAULT nextval('m_packages_sequence_generator'::regclass),
  "package_name" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "type" int4 NOT NULL,
  "expiration_date" timestamp(6),
  "created_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_user" int8 NOT NULL,
  "updated_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_user" int8 NOT NULL
)
;

-- ----------------------------
-- Table structure for m_packages_services
-- ----------------------------
DROP TABLE IF EXISTS "m_packages_services";
CREATE TABLE "m_packages_services" (
  "m_package_service_id" int8 NOT NULL DEFAULT nextval('m_packages_services_sequence_generator'::regclass),
  "m_package_id" int8 NOT NULL,
  "m_service_id" int8,
  "child_id" int8,
  "is_active" bool NOT NULL DEFAULT true,
  "created_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_user" int8 NOT NULL,
  "updated_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_user" int8 NOT NULL
)
;

-- ----------------------------
-- Table structure for m_services
-- ----------------------------
DROP TABLE IF EXISTS "m_services";
CREATE TABLE "m_services" (
  "m_service_id" int8 NOT NULL DEFAULT nextval('m_services_sequence_generator'::regclass),
  "service_name" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "micro_service_name" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "is_active" bool NOT NULL DEFAULT true,
  "created_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_user" int8 NOT NULL,
  "updated_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_user" int8 NOT NULL
)
;

-- ----------------------------
-- Table structure for m_templates
-- ----------------------------
DROP TABLE IF EXISTS "m_templates";
CREATE TABLE "m_templates" (
  "m_template_id" int8 NOT NULL DEFAULT nextval('m_templates_sequence_generator'::regclass),
  "m_service_id" int8 NOT NULL,
  "m_industry_id" int8 NOT NULL,
  "file_name" text COLLATE "pg_catalog"."default",
  "created_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_user" int8 NOT NULL,
  "updated_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_user" int8 NOT NULL
)
;

-- ----------------------------
-- Table structure for payments_management
-- ----------------------------
DROP TABLE IF EXISTS "payments_management";
CREATE TABLE "payments_management" (
  "payment_management_id" int8 NOT NULL DEFAULT nextval('payments_management_sequence_generator'::regclass),
  "tenant_id" int8 NOT NULL,
  "payment_type" int4 NOT NULL,
  "year_month" varchar(6) COLLATE "pg_catalog"."default" NOT NULL,
  "used_number" int4 NOT NULL,
  "created_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_user" int8 NOT NULL,
  "updated_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_user" int8 NOT NULL
)
;

-- ----------------------------
-- Table structure for quicksight_settings
-- ----------------------------
DROP TABLE IF EXISTS "quicksight_settings";
CREATE TABLE "quicksight_settings" (
  "quicksight_settings_id" int8 NOT NULL DEFAULT nextval('quicksight_settings_sequence_generator'::regclass),
  "tenant_id" int8 NOT NULL,
  "postgresql_account" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "postgresql_password" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "namespace" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "group_name" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "datasource_arn" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "created_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_user" int8 NOT NULL,
  "updated_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_user" int8 NOT NULL
)
;

-- ----------------------------
-- Table structure for storages_management
-- ----------------------------
DROP TABLE IF EXISTS "storages_management";
CREATE TABLE "storages_management" (
  "storage_management_id" int8 NOT NULL DEFAULT nextval('storages_management_sequence_generator'::regclass),
  "tenant_id" int8 NOT NULL,
  "m_service_id" int8 NOT NULL,
  "used_storage_s3" int8,
  "used_storage_elasticsearch" int8,
  "used_storage_database" int8,
  "created_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_user" int8 NOT NULL,
  "updated_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_user" int8 NOT NULL
)
;

-- ----------------------------
-- Table structure for tenants
-- ----------------------------
DROP TABLE IF EXISTS "tenants";
CREATE TABLE "tenants" (
  "tenant_id" int8 NOT NULL DEFAULT nextval('tenants_sequence_generator'::regclass),
  "tenant_name" varchar(255) COLLATE "pg_catalog"."default",
  "company_name" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "m_industry_id" int8 NOT NULL,
  "creation_status" int4 NOT NULL,
  "contract_status" int4,
  "is_active" bool NOT NULL DEFAULT true,
  "contract_id" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "trial_end_date" date,
  "department_name" varchar(50) COLLATE "pg_catalog"."default",
  "position_name" varchar(255) COLLATE "pg_catalog"."default",
  "employee_surname" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "employee_name" varchar(100) COLLATE "pg_catalog"."default",
  "telephone_number" varchar(20) COLLATE "pg_catalog"."default",
  "password" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "account_closing_month" int4,
  "product_name" varchar(255) COLLATE "pg_catalog"."default",
  "customer_name" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "calendar_day" int4,
  "business_main_id" int8 NOT NULL,
  "business_sub_id" int8 NOT NULL,
  "stop_date" timestamp(6),
  "deleted_date" timestamp(6),
  "email" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "created_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_user" int8 NOT NULL,
  "updated_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_user" int8 NOT NULL
)
;

-- ----------------------------
-- Primary Key structure for table license_packages
-- ----------------------------
ALTER TABLE "license_packages" ADD CONSTRAINT "license_packages_pkey" PRIMARY KEY ("license_id");

-- ----------------------------
-- Primary Key structure for table m_industries
-- ----------------------------
ALTER TABLE "m_industries" ADD CONSTRAINT "m_industries_pkey" PRIMARY KEY ("m_industry_id");

-- ----------------------------
-- Primary Key structure for table m_packages
-- ----------------------------
ALTER TABLE "m_packages" ADD CONSTRAINT "m_packages_pkey" PRIMARY KEY ("m_package_id");

-- ----------------------------
-- Primary Key structure for table m_packages_services
-- ----------------------------
ALTER TABLE "m_packages_services" ADD CONSTRAINT "m_packages_services_pkey" PRIMARY KEY ("m_package_service_id");

-- ----------------------------
-- Primary Key structure for table m_services
-- ----------------------------
ALTER TABLE "m_services" ADD CONSTRAINT "m_services_pkey" PRIMARY KEY ("m_service_id");

-- ----------------------------
-- Primary Key structure for table m_templates
-- ----------------------------
ALTER TABLE "m_templates" ADD CONSTRAINT "m_templates_pkey" PRIMARY KEY ("m_template_id");

-- ----------------------------
-- Primary Key structure for table payments_management
-- ----------------------------
ALTER TABLE "payments_management" ADD CONSTRAINT "payments_management_pkey" PRIMARY KEY ("payment_management_id");

-- ----------------------------
-- Primary Key structure for table quicksight_settings
-- ----------------------------
ALTER TABLE "quicksight_settings" ADD CONSTRAINT "quicksight_settings_pkey" PRIMARY KEY ("quicksight_settings_id");

-- ----------------------------
-- Primary Key structure for table storages_management
-- ----------------------------
ALTER TABLE "storages_management" ADD CONSTRAINT "storages_management_pkey" PRIMARY KEY ("storage_management_id");

-- ----------------------------
-- Primary Key structure for table tenants
-- ----------------------------
ALTER TABLE "tenants" ADD CONSTRAINT "tenants_pkey" PRIMARY KEY ("tenant_id");
