DELETE FROM "notification_type_setting" WHERE "notification_type_setting_id" IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11);
INSERT INTO "notification_type_setting"("employee_id", "notification_type", "notification_type_name", "created_date", "created_user", "updated_date", "updated_user", "notification_type_setting_id") VALUES (0, 1, NULL, '2020-07-30 19:35:05.396521', 1, '2020-07-30 19:35:05.396521', 1, 1);
INSERT INTO "notification_type_setting"("employee_id", "notification_type", "notification_type_name", "created_date", "created_user", "updated_date", "updated_user", "notification_type_setting_id") VALUES (0, 2, NULL, '2020-07-30 19:35:05.396521', 1, '2020-07-30 19:35:05.396521', 1, 2);
INSERT INTO "notification_type_setting"("employee_id", "notification_type", "notification_type_name", "created_date", "created_user", "updated_date", "updated_user", "notification_type_setting_id") VALUES (0, 3, NULL, '2020-07-30 19:35:05.396521', 1, '2020-07-30 19:35:05.396521', 1, 3);
INSERT INTO "notification_type_setting"("employee_id", "notification_type", "notification_type_name", "created_date", "created_user", "updated_date", "updated_user", "notification_type_setting_id") VALUES (0, 4, NULL, '2020-07-30 19:35:05.396521', 1, '2020-07-30 19:35:05.396521', 1, 4);
INSERT INTO "notification_type_setting"("employee_id", "notification_type", "notification_type_name", "created_date", "created_user", "updated_date", "updated_user", "notification_type_setting_id") VALUES (0, 5, NULL, '2020-07-30 19:35:05.396521', 1, '2020-07-30 19:35:05.396521', 1, 5);
INSERT INTO "notification_type_setting"("employee_id", "notification_type", "notification_type_name", "created_date", "created_user", "updated_date", "updated_user", "notification_type_setting_id") VALUES (0, 6, NULL, '2020-07-30 19:35:05.396521', 1, '2020-07-30 19:35:05.396521', 1, 6);
INSERT INTO "notification_type_setting"("employee_id", "notification_type", "notification_type_name", "created_date", "created_user", "updated_date", "updated_user", "notification_type_setting_id") VALUES (0, 7, NULL, '2020-07-30 19:35:05.396521', 1, '2020-07-30 19:35:05.396521', 1, 7);
INSERT INTO "notification_type_setting"("employee_id", "notification_type", "notification_type_name", "created_date", "created_user", "updated_date", "updated_user", "notification_type_setting_id") VALUES (0, 8, NULL, '2020-07-30 19:35:05.396521', 1, '2020-07-30 19:35:05.396521', 1, 8);
INSERT INTO "notification_type_setting"("employee_id", "notification_type", "notification_type_name", "created_date", "created_user", "updated_date", "updated_user", "notification_type_setting_id") VALUES (0, 9, NULL, '2020-07-30 19:35:05.396521', 1, '2020-07-30 19:35:05.396521', 1, 9);
INSERT INTO "notification_type_setting"("employee_id", "notification_type", "notification_type_name", "created_date", "created_user", "updated_date", "updated_user", "notification_type_setting_id") VALUES (0, 10, NULL, '2020-07-30 19:35:05.396521', 1, '2020-07-30 19:35:05.396521', 1, 10);
INSERT INTO "notification_type_setting"("employee_id", "notification_type", "notification_type_name", "created_date", "created_user", "updated_date", "updated_user", "notification_type_setting_id") VALUES (0, 11, NULL, '2020-07-30 19:35:05.396521', 1, '2020-07-30 19:35:05.396521', 1, 11);


DELETE FROM "notification_detail_setting" WHERE "notification_detail_setting_id" IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ,17, 18, 19, 20);
INSERT INTO "notification_detail_setting"("employee_id", "notification_type", "notification_subtype", "notification_subtype_name", "is_notification", "setting_notification_date", "created_date", "created_user", "updated_date", "updated_user", "notification_detail_setting_id") VALUES (0, 1, 1, '投稿・コメントの宛先に指定された場合', 'f', '0001-01-01 00:00:00', '2020-07-30 19:35:33.070001', 1, '2020-07-30 19:35:33.070001', 1, 1);
INSERT INTO "notification_detail_setting"("employee_id", "notification_type", "notification_subtype", "notification_subtype_name", "is_notification", "setting_notification_date", "created_date", "created_user", "updated_date", "updated_user", "notification_detail_setting_id") VALUES (0, 1, 2, '自分の投稿に対してリアクションがついた場合', 'f', '0001-01-01 00:00:00', '2020-07-30 19:35:33.070001', 1, '2020-07-30 19:35:33.070001', 1, 2);
INSERT INTO "notification_detail_setting"("employee_id", "notification_type", "notification_subtype", "notification_subtype_name", "is_notification", "setting_notification_date", "created_date", "created_user", "updated_date", "updated_user", "notification_detail_setting_id") VALUES (0, 1, 3, '自分の投稿に対してコメントされた場合', 'f', '0001-01-01 00:00:00', '2020-07-30 19:35:33.070001', 1, '2020-07-30 19:35:33.070001', 1, 3);
INSERT INTO "notification_detail_setting"("employee_id", "notification_type", "notification_subtype", "notification_subtype_name", "is_notification", "setting_notification_date", "created_date", "created_user", "updated_date", "updated_user", "notification_detail_setting_id") VALUES (0, 1, 4, '自分がコメントした投稿に、追加でコメントがあった場合', 'f', '0001-01-01 00:00:00', '2020-07-30 19:35:33.070001', 1, '2020-07-30 19:35:33.070001', 1, 4);
INSERT INTO "notification_detail_setting"("employee_id", "notification_type", "notification_subtype", "notification_subtype_name", "is_notification", "setting_notification_date", "created_date", "created_user", "updated_date", "updated_user", "notification_detail_setting_id") VALUES (0, 2, 1, NULL, 't', '0001-01-01 00:00:00', '2020-07-30 19:35:33.070001', 1, '2020-07-30 19:35:33.070001', 1, 5);
INSERT INTO "notification_detail_setting"("employee_id", "notification_type", "notification_subtype", "notification_subtype_name", "is_notification", "setting_notification_date", "created_date", "created_user", "updated_date", "updated_user", "notification_detail_setting_id") VALUES (0, 3, 1, NULL, 't', '0001-01-01 00:00:00', '2020-07-30 19:35:33.070001', 1, '2020-07-30 19:35:33.070001', 1, 6);
INSERT INTO "notification_detail_setting"("employee_id", "notification_type", "notification_subtype", "notification_subtype_name", "is_notification", "setting_notification_date", "created_date", "created_user", "updated_date", "updated_user", "notification_detail_setting_id") VALUES (0, 4, 1, NULL, 't', '0001-01-01 00:00:00', '2020-07-30 19:35:33.070001', 1, '2020-07-30 19:35:33.070001', 1, 7);
INSERT INTO "notification_detail_setting"("employee_id", "notification_type", "notification_subtype", "notification_subtype_name", "is_notification", "setting_notification_date", "created_date", "created_user", "updated_date", "updated_user", "notification_detail_setting_id") VALUES (0, 4, 2, NULL, 't', '0001-01-01 00:00:00', '2020-07-30 19:35:33.070001', 1, '2020-07-30 19:35:33.070001', 1, 8);
INSERT INTO "notification_detail_setting"("employee_id", "notification_type", "notification_subtype", "notification_subtype_name", "is_notification", "setting_notification_date", "created_date", "created_user", "updated_date", "updated_user", "notification_detail_setting_id") VALUES (0, 4, 3, NULL, 't', '0001-01-01 00:00:00', '2020-07-30 19:35:33.070001', 1, '2020-07-30 19:35:33.070001', 1, 9);
INSERT INTO "notification_detail_setting"("employee_id", "notification_type", "notification_subtype", "notification_subtype_name", "is_notification", "setting_notification_date", "created_date", "created_user", "updated_date", "updated_user", "notification_detail_setting_id") VALUES (0, 5, 1, NULL, 't', '0001-01-01 00:00:00', '2020-07-30 19:35:33.070001', 1, '2020-07-30 19:35:33.070001', 1, 10);
INSERT INTO "notification_detail_setting"("employee_id", "notification_type", "notification_subtype", "notification_subtype_name", "is_notification", "setting_notification_date", "created_date", "created_user", "updated_date", "updated_user", "notification_detail_setting_id") VALUES (0, 5, 2, NULL, 't', '0001-01-01 00:00:00', '2020-07-30 19:35:33.070001', 1, '2020-07-30 19:35:33.070001', 1, 11);
INSERT INTO "notification_detail_setting"("employee_id", "notification_type", "notification_subtype", "notification_subtype_name", "is_notification", "setting_notification_date", "created_date", "created_user", "updated_date", "updated_user", "notification_detail_setting_id") VALUES (0, 6, 1, '自分が参加者に設定されたスケジュールが登録・更新された場合', 'f', '0001-01-01 00:00:00', '2020-07-30 19:35:33.070001', 1, '2020-07-30 19:35:33.070001', 1, 12);
INSERT INTO "notification_detail_setting"("employee_id", "notification_type", "notification_subtype", "notification_subtype_name", "is_notification", "setting_notification_date", "created_date", "created_user", "updated_date", "updated_user", "notification_detail_setting_id") VALUES (0, 7, 1, '自分が担当者に設定されたタスクが登録・更新された投稿があった場合', 'f', '0001-01-01 00:00:00', '2020-07-30 19:35:33.070001', 1, '2020-07-30 19:35:33.070001', 1, 13);
INSERT INTO "notification_detail_setting"("employee_id", "notification_type", "notification_subtype", "notification_subtype_name", "is_notification", "setting_notification_date", "created_date", "created_user", "updated_date", "updated_user", "notification_detail_setting_id") VALUES (0, 8, 1, NULL, 't', '0001-01-01 00:00:00', '2020-07-30 19:35:33.070001', 1, '2020-07-30 19:35:33.070001', 1, 14);
INSERT INTO "notification_detail_setting"("employee_id", "notification_type", "notification_subtype", "notification_subtype_name", "is_notification", "setting_notification_date", "created_date", "created_user", "updated_date", "updated_user", "notification_detail_setting_id") VALUES (0, 9, 1, 'スケジュール', 'f', '0001-01-01 00:00:00', '2020-07-30 19:35:33.070001', 1, '2020-07-30 19:35:33.070001', 1, 15);
INSERT INTO "notification_detail_setting"("employee_id", "notification_type", "notification_subtype", "notification_subtype_name", "is_notification", "setting_notification_date", "created_date", "created_user", "updated_date", "updated_user", "notification_detail_setting_id") VALUES (0, 9, 2, 'マイルストーン', 'f', '0001-01-01 00:00:00', '2020-07-30 19:35:33.070001', 1, '2020-07-30 19:35:33.070001', 1, 16);
INSERT INTO "notification_detail_setting"("employee_id", "notification_type", "notification_subtype", "notification_subtype_name", "is_notification", "setting_notification_date", "created_date", "created_user", "updated_date", "updated_user", "notification_detail_setting_id") VALUES (0, 9, 3, 'タスク', 'f', '0001-01-01 00:00:00', '2020-07-30 19:35:33.070001', 1, '2020-07-30 19:35:33.070001', 1, 17);
INSERT INTO "notification_detail_setting"("employee_id", "notification_type", "notification_subtype", "notification_subtype_name", "is_notification", "setting_notification_date", "created_date", "created_user", "updated_date", "updated_user", "notification_detail_setting_id") VALUES (0, 11, 1, 'シミュレーション/インポート完了による投稿があった場合', 'f', '0001-01-01 00:00:00', '2020-07-30 19:35:33.070001', 1, '2020-07-30 19:35:33.070001', 1, 18);
INSERT INTO "notification_detail_setting"("employee_id", "notification_type", "notification_subtype", "notification_subtype_name", "is_notification", "setting_notification_date", "created_date", "created_user", "updated_date", "updated_user", "notification_detail_setting_id") VALUES (0, 11, 2, 'シミュレーション/インポート完了による投稿があった場合', 'f', '0001-01-01 00:00:00', '2020-07-30 19:35:33.070001', 1, '2020-07-30 19:35:33.070001', 1, 19);
