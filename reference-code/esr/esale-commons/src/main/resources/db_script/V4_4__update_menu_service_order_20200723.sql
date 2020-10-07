-- ----------------------------
-- Table structure for menu_service_order
-- ----------------------------
DROP TABLE IF EXISTS "menu_service_order" CASCADE;
CREATE TABLE "menu_service_order" (
  "menu_service_order_id" int8 NOT NULL,
  "service_id" int8 NOT NULL,
  "employee_id" int8 NOT NULL,
  "service_name" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "service_order" int4 NOT NULL,
  "created_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_user" int8 NOT NULL,
  "updated_date" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_user" int8 NOT NULL,
  CONSTRAINT "menu_order_pkey" PRIMARY KEY ("menu_service_order_id"),
  CONSTRAINT "menu_order_unique_idx" UNIQUE ("service_id", "employee_id")
)
;

-- ----------------------------
-- Triggers structure for table menu_service_order
-- ----------------------------
CREATE TRIGGER "menu_service_order_created_date" BEFORE INSERT ON "menu_service_order"
FOR EACH ROW
EXECUTE PROCEDURE "created_date"();
CREATE TRIGGER "menu_service_order_updated_date" BEFORE INSERT OR UPDATE ON "menu_service_order"
FOR EACH ROW
EXECUTE PROCEDURE "updated_date"();

DROP SEQUENCE IF EXISTS "menu_service_order_sequence_generator" CASCADE;
CREATE SEQUENCE menu_service_order_sequence_generator
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;
