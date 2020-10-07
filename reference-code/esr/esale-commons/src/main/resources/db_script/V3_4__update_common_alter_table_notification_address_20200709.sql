-- ----------------------------
-- Dropping the original primary key
-- ----------------------------
ALTER TABLE "notification_address" DROP CONSTRAINT "notification_addess_pkey";

-- ----------------------------
-- Primary Key structure for table notification_address
-- ----------------------------
ALTER TABLE "notification_address" ADD CONSTRAINT "notification_address_pkey" PRIMARY KEY ("employee_id", "notification_id");