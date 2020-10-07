UPDATE "services_info" SET "icon_path" = '/content/images/ic-sidebar-timeline.svg', "service_path" = '/timeline/list' WHERE "service_id" = 3;
UPDATE "services_info" SET "icon_path" = '/content/images/ic-sidebar-business-card.svg', "service_path" = '/bussinesscard/list' WHERE "service_id" = 4;
UPDATE "services_info" SET "icon_path" = '/content/images/ic-sidebar-activity.svg', "service_path" = '/activity/list' WHERE "service_id" = 6;
UPDATE "services_info" SET "icon_path" = '/content/images/ic-sidebar-employee.svg', "service_path" = '/employee/list' WHERE "service_id" = 8;
UPDATE "services_info" SET "icon_path" = '/content/images/ic-sidebar-product.svg', "service_path" = '/product/list' WHERE "service_id" = 14;
UPDATE "services_info" SET "icon_path" = '/content/images/task/ic-menu-task.svg', "service_path" = '/task/list' WHERE "service_id" = 15;
UPDATE "services_info" SET "icon_path" = '/content/images/ic-sidebar-analysis.svg', "service_path" = '/analysis/list' WHERE "service_id" = 10;

UPDATE "field_info" SET "modify_flag" = 3 WHERE "field_belong" = 8 AND "field_name" = 'email';

-- update task: change extension_belong --> field_belong
UPDATE "field_info" SET "relation_data" = '{"format": 1, "field_id": "187", "display_field_id": "162", "field_belong": 1501}' WHERE "field_id" = 141;
UPDATE "field_info" SET "relation_data" = '{"format": 1, "field_id": "187", "display_field_id": "187", "field_belong": 1501}' WHERE "field_id" = 189;
UPDATE "field_info" SET "relation_data" = '{"format": 1, "field_id": "50", "display_field_id": "50", "field_belong": 5}' WHERE "field_id" = 185;
UPDATE "field_info" SET "relation_data" = '{"format": 1, "field_id": "52", "display_field_id": "52", "field_belong": 5}' WHERE "field_id" = 137;
UPDATE "field_info" SET "relation_data" = '{"format": 2, "field_id": "119", "display_tab": 2, "display_fields": ["119"], "display_field_id": "119", "field_belong": 14}' WHERE "field_id" = 140;
UPDATE "field_info" SET "relation_data" = '{"format": 2, "field_id": "170", "display_tab": 2, "display_fields": ["170"], "display_field_id": "170", "field_belong": 16}' WHERE "field_id" = 186;

INSERT INTO "field_info_item"("item_id", "created_date", "created_user", "updated_date", "updated_user", "field_id", "is_available", "is_default", "item_order", "item_label") VALUES (1, '2020-05-20 07:23:26.46848', 1, '2020-05-20 07:23:26.313042', 1, 143, 't', 't', 1, '{"en_us": "", "ja_jp": "未着手", "zh_cn": ""}');
INSERT INTO "field_info_item"("item_id", "created_date", "created_user", "updated_date", "updated_user", "field_id", "is_available", "is_default", "item_order", "item_label") VALUES (2, '2020-05-20 07:23:26.46848', 1, '2020-05-20 07:23:26.46848', 1, 143, 't', 't', 2, '{"en_us": "", "ja_jp": "着手中", "zh_cn": ""}');
INSERT INTO "field_info_item"("item_id", "created_date", "created_user", "updated_date", "updated_user", "field_id", "is_available", "is_default", "item_order", "item_label") VALUES (3, '2020-05-20 07:23:26.624009', 1, '2020-05-20 07:23:26.624009', 1, 143, 't', 't', 3, '{"en_us": "", "ja_jp": "完了", "zh_cn": ""}');
