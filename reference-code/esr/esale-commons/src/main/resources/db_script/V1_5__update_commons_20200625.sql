-- ----------------------------
-- Drop table date_formats
-- ----------------------------
DROP TABLE IF EXISTS "date_formats";

-- ----------------------------
-- Drop table import_histories
-- ----------------------------
DROP TABLE IF EXISTS "import_histories";

-- ----------------------------
-- Remove column is_available
-- ----------------------------
ALTER TABLE "services_info" DROP IF EXISTS "is_available";

-- ----------------------------
-- Remove column prefecture_name_kana
-- ----------------------------
ALTER TABLE "addresses" DROP IF EXISTS "prefecture_name_kana";

-- ----------------------------
-- Remove column city_name_kana
-- ----------------------------
ALTER TABLE "addresses" DROP IF EXISTS "city_name_kana";

-- ----------------------------
-- Remove column area_name_kana
-- ----------------------------
ALTER TABLE "addresses" DROP IF EXISTS "area_name_kana";


-- ----------------------------
-- Update data maser for services_info
-- ----------------------------
DELETE FROM "services_info" WHERE "service_id" = 1401;
DELETE FROM "services_info" WHERE "service_id" = 1501;
DELETE FROM "services_info" WHERE "service_id" = 1502;
INSERT INTO "services_info"("service_id", "service_name", "service_type", "service_order", "created_date", "created_user", "updated_date", "updated_user", "icon_path", "service_path") VALUES (3, '{"en_us": "Timeline", "ja_jp": "タイムライン", "zh_cn": "Timeline"}', 2, 3, now(), 1, now(), 1, '/Timeline.ico', '/Timeline') ON CONFLICT ("service_id") DO NOTHING;
INSERT INTO "services_info"("service_id", "service_name", "service_type", "service_order", "created_date", "created_user", "updated_date", "updated_user", "icon_path", "service_path") VALUES (4, '{"en_us": "Businesscard", "ja_jp": "名刺", "zh_cn": "名刺"}', 1, 4, now(), 1, now(), 1, '/BussinessCards.ico', '/BussinessCards') ON CONFLICT ("service_id") DO NOTHING;
INSERT INTO "services_info"("service_id", "service_name", "service_type", "service_order", "created_date", "created_user", "updated_date", "updated_user", "icon_path", "service_path") VALUES (6, '{"en_us": "Acitvity", "ja_jp": "活動", "zh_cn": "活動"}', 1, 6, now(), 1, now(), 1, '/Activity.ico', '/Activity') ON CONFLICT ("service_id") DO NOTHING;
INSERT INTO "services_info"("service_id", "service_name", "service_type", "service_order", "created_date", "created_user", "updated_date", "updated_user", "icon_path", "service_path") VALUES (10, '{"en_us": "analysis", "ja_jp": "分析", "zh_cn": "analysis"}', 2, 10, now(), 1, now(), 1, NULL, NULL) ON CONFLICT ("service_id") DO NOTHING;
INSERT INTO "services_info"("service_id", "service_name", "service_type", "service_order", "created_date", "created_user", "updated_date", "updated_user", "icon_path", "service_path") VALUES (16, '{"en_us": "Producttrading", "ja_jp": "取引商品管理", "zh_cn": "取引商品管理"}', 1, 16, now(), 1, now(), 1, NULL, NULL) ON CONFLICT ("service_id") DO NOTHING;
UPDATE "services_info" SET "service_name" = '{"en_us": "Schedule", "ja_jp": "スケジュール", "zh_cn": "Schedule"}', "service_type" = 1, "service_order" = 2, "updated_date" = now(), "updated_user" = 1, "icon_path" = '/Schedule.ico', "service_path" = '/Schedule' WHERE "service_id" = 2;
UPDATE "services_info" SET "service_name" = '{"en_us": "Customer", "ja_jp": "顧客", "zh_cn": "客户信息"}', "service_type" = 1, "service_order" = 5, "updated_date" = now(), "updated_user" = 1, "icon_path" = '/Customer.ico', "service_path" = '/Customer' WHERE "service_id" = 5;
UPDATE "services_info" SET "service_name" = '{"en_us": "Employee", "ja_jp": "社員", "zh_cn": "职员"}', "service_type" = 1, "service_order" = 8, "updated_date" = now(), "updated_user" = 1, "icon_path" = '/Employee.ico', "service_path" = '/Employee' WHERE "service_id" = 8;
UPDATE "services_info" SET "service_name" = '{"en_us": "Product", "ja_jp": "商品", "zh_cn": "商品"}', "service_type" = 1, "service_order" = 14, "updated_date" = now(), "updated_user" = 1, "icon_path" = '/Product.ico', "service_path" = '/Product' WHERE "service_id" = 14;
UPDATE "services_info" SET "service_name" = '{"en_us": "Task", "ja_jp": "タスク", "zh_cn": "Task"}', "service_type" = 1, "service_order" = 15, "updated_date" = now(), "updated_user" = 1, "icon_path" = '/Task.ico', "service_path" = '/Task' WHERE "service_id" = 15;