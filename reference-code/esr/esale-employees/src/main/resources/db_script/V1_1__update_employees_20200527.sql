----------------------
------ employees -----
----------------------

-- ----------------------------
-- Table structure for employees_packages
-- ----------------------------
DROP TABLE IF EXISTS "employees_packages";
CREATE TABLE "employees_packages" (
  "employee_package_id" int8 NOT NULL,
  "created_date" timestamp(6) NOT NULL,
  "created_user" int8 NOT NULL,
  "updated_date" timestamp(6) NOT NULL,
  "updated_user" int8 NOT NULL,
  "employee_id" int8 NOT NULL,
  "package_id" int8 NOT NULL
)
;

-- ----------------------------
-- DROP table  employees_options
-- ----------------------------
DROP TABLE IF EXISTS "employees_options";

-- ----------------------------
-- DROP table  employees_options
-- ----------------------------
DROP TABLE IF EXISTS "employees_subscriptions";

-- ----------------------------
-- DROP employees_options_sequence_generator
-- ----------------------------
DROP SEQUENCE IF EXISTS "employees_options_sequence_generator";

-- ----------------------------
-- DROP employees_subscriptions_sequence_generator
-- ----------------------------
DROP SEQUENCE IF EXISTS "employees_subscriptions_sequence_generator";


-- ----------------------------
-- Sequence structure for employees_packages_sequence_generator
-- ----------------------------
DROP SEQUENCE IF EXISTS "employees_packages_sequence_generator";
CREATE SEQUENCE "employees_packages_sequence_generator" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence for table employees_packages
-- ----------------------------
ALTER TABLE ONLY "employees_packages" ALTER COLUMN "employee_package_id" SET DEFAULT nextval('employees_packages_sequence_generator'::regclass);
-- ----------------------------
-- Primary Key structure for table employees_packages
-- ----------------------------
ALTER TABLE "employees_packages" ADD CONSTRAINT "employees_packages_pkey" PRIMARY KEY ("employee_package_id");

