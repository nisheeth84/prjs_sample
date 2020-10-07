-- ----------------------------
-- Add column is_admin
-- ----------------------------
ALTER TABLE "employees" ADD COLUMN IF NOT EXISTS "is_admin" bool;

-- ----------------------------
-- Add column format_date_id
-- ----------------------------
ALTER TABLE "employees" ADD COLUMN IF NOT EXISTS "format_date_id" int;

-- ----------------------------
-- Remove column user_id
-- ----------------------------
ALTER TABLE "employees" DROP IF EXISTS "password";

-- ----------------------------
-- Add column is_account_quicksight
-- ----------------------------
ALTER TABLE "employees" ADD COLUMN IF NOT EXISTS "is_account_quicksight" bool;

-- ----------------------------
-- Rename column employees_departments_id to employee_department_id
-- ----------------------------
ALTER TABLE "employees_departments" DROP CONSTRAINT IF EXISTS "employees_departments_pkey";
ALTER TABLE "employees_departments" DROP IF EXISTS "employees_departments_id";
ALTER TABLE "employees_departments" ADD COLUMN IF NOT EXISTS "employee_department_id" int8;
ALTER TABLE "employees_departments" ADD CONSTRAINT "employees_departments_pkey" PRIMARY KEY ("employee_department_id");

-- ----------------------------
-- Remove column in employees_histories
-- ----------------------------
ALTER TABLE "employees_histories" DROP IF EXISTS "cellphone_number";
ALTER TABLE "employees_histories" DROP IF EXISTS "email";
ALTER TABLE "employees_histories" DROP IF EXISTS "employee_data";
ALTER TABLE "employees_histories" DROP IF EXISTS "employee_name";
ALTER TABLE "employees_histories" DROP IF EXISTS "employee_name_kana";
ALTER TABLE "employees_histories" DROP IF EXISTS "employee_status";
ALTER TABLE "employees_histories" DROP IF EXISTS "employee_surname";
ALTER TABLE "employees_histories" DROP IF EXISTS "employee_surname_kana";
ALTER TABLE "employees_histories" DROP IF EXISTS "is_admin";
ALTER TABLE "employees_histories" DROP IF EXISTS "language_id";
ALTER TABLE "employees_histories" DROP IF EXISTS "manager_id";
ALTER TABLE "employees_histories" DROP IF EXISTS "photo_file_name";
ALTER TABLE "employees_histories" DROP IF EXISTS "photo_file_path";
ALTER TABLE "employees_histories" DROP IF EXISTS "reason_edit";
ALTER TABLE "employees_histories" DROP IF EXISTS "telephone_number";
ALTER TABLE "employees_histories" DROP IF EXISTS "timezone_id";
ALTER TABLE "employees_histories" DROP IF EXISTS "user_id";