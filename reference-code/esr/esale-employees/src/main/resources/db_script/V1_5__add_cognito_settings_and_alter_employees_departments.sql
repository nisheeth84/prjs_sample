-- tao tam 2 table de co the login duoc. khi nao xong login thi se chuyen sang database tenants sau
DROP SEQUENCE IF EXISTS "cognito_settings_sequence_generator";
CREATE SEQUENCE "cognito_settings_sequence_generator" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

DROP TABLE IF EXISTS "cognito_settings";
CREATE TABLE "cognito_settings" (		
  "cognito_settings_id" int4 NOT NULL,		
  "client_id" varchar(30) COLLATE "pg_catalog"."default" NOT NULL,		
  "user_pool_id" varchar(30) COLLATE "pg_catalog"."default" NOT NULL,		
  "created_date" timestamp(6) NOT NULL,		
  "created_user" int8 NOT NULL,		
  "updated_date" timestamp(6) NOT NULL,		
  "updated_user" int8 NOT NULL,		
  "is_pc" bool DEFAULT false,		
  "is_app" bool DEFAULT false,		
  "provider_name" varchar(50) COLLATE "pg_catalog"."default",		
  CONSTRAINT "cognito_settings_pkey" PRIMARY KEY ("cognito_settings_id")		
);

INSERT INTO "cognito_settings" VALUES (1, '1s5b8hh4g54tia9asjrg8j4be1', 'ap-northeast-1_s1lYDywAG', '2020-06-15 15:12:39.212663', 1, '2020-06-15 15:12:39.212663', 1, 'f', 'f');

DROP SEQUENCE IF EXISTS "ip_address_sequence_generator";
CREATE SEQUENCE "ip_address_sequence_generator" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

DROP TABLE IF EXISTS "ip_address";
CREATE TABLE "ip_address" (
  "ip_address_id" int8 NOT NULL,
  "ip_address" varchar(255),
  "created_date" timestamp(6) NOT NULL,
  "created_user" int8 NOT NULL,
  "updated_date" timestamp(6) NOT NULL,	
  "updated_user" int8 NOT NULL,
  CONSTRAINT "ip_address_pkey" PRIMARY KEY ("ip_address_id")
);

ALTER TABLE "employees_departments" RENAME COLUMN "employee_department_id" TO "employees_departments_id";
ALTER TABLE "employees_departments"
  DROP CONSTRAINT "employees_departments_pkey",
  ADD CONSTRAINT "employees_departments_pkey" PRIMARY KEY ("employees_departments_id");