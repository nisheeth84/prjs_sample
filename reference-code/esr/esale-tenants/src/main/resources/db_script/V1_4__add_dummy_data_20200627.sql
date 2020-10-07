-- ----------------------------
-- Records of m_industries
-- ----------------------------
DELETE FROM "m_industries";
INSERT INTO "m_industries" VALUES (1, 'Soft', 'Soft', 'luvina_tenant', '2020-06-19 20:49:47', 1, '2020-06-19 20:49:49', 1);
INSERT INTO "m_industries" VALUES (2, 'Soft', 'Soft', 'longdd_m_commons_sales_msq1j1xjtgog', '2020-06-19 21:00:59', 1, '2020-06-19 21:01:01', 1);

-- ----------------------------
-- Records of m_packages
-- ----------------------------
DELETE FROM "m_packages";
INSERT INTO "m_packages" VALUES (1, 'CuongTM', 1, '2024-06-19 21:11:47', '2020-06-19 21:11:52', 1, '2020-06-19 21:11:55', 1);
INSERT INTO "m_packages" VALUES (2, 'Luvina', 1, '2023-06-22 18:54:52', '2020-06-22 18:54:57', 1, '2020-06-22 18:55:00', 1);

-- ----------------------------
-- Records of m_packages_services
-- ----------------------------
DELETE FROM "m_packages_services";
INSERT INTO "m_packages_services" VALUES (1, 1, 1, NULL, 't', '2020-06-19 21:11:10', 1, '2020-06-19 21:11:13', 1);
INSERT INTO "m_packages_services" VALUES (2, 1, 2, NULL, 't', '2020-06-19 21:11:31', 1, '2020-06-19 21:11:35', 1);

-- ----------------------------
-- Records of m_services
-- ----------------------------
DELETE FROM "m_services";
INSERT INTO "m_services" VALUES (1, 'Employees', 'cuongtm_1', 't', '2020-06-19 20:58:42', 1, '2020-06-19 20:58:44', 1);
INSERT INTO "m_services" VALUES (2, 'Products', 'cuongtm_2', 't', '2020-06-19 20:58:42', 1, '2020-06-19 20:58:44', 1);

DELETE FROM "tenants";
INSERT INTO "tenants" VALUES (2, 'common16', 'Luvina', 2, 1, 1, 't', '2', '2022-06-19', 'Luvina', '{"en":"Boss"}', 'Cuong', 'CuongTM', '123456789', '123456', 12, 'Soft', 'AAA', 1, 1, 1, '2022-06-19 20:48:53', '2022-06-25 20:48:42', 'cuongtm_test005@luvina.net', '2020-06-19 20:49:07', 1, '2020-06-19 20:49:11', 1);