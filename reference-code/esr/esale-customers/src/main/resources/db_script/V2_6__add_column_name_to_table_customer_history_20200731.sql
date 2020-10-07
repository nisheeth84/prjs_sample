-- ----------------------------
-- Add column customer_name
-- ----------------------------
ALTER TABLE "customers_histories" ADD COLUMN IF NOT EXISTS "customer_name" varchar(100);