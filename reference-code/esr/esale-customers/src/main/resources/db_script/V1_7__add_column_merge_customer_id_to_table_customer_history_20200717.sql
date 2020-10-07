-- ----------------------------
-- Add column merged_customer_id
-- ----------------------------
ALTER TABLE "customers_histories" ADD COLUMN IF NOT EXISTS "merged_customer_id" jsonb;