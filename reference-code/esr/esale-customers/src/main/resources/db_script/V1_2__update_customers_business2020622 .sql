-- ----------------------------
-- update column customers_business to Not null
-- ----------------------------
ALTER TABLE "customers_business" ALTER COLUMN "customer_business_parent" DROP NOT NULL;
UPDATE "customers_business" SET "customer_business_parent" = NULL WHERE "customer_business_parent" = 0