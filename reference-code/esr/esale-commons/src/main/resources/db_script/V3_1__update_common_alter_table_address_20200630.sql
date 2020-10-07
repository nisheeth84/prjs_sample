-- ----------------------------
-- Table structure for addresses
-- ----------------------------
DROP TABLE IF EXISTS "address";
CREATE TABLE "address" (
  "address_id" int8 NOT NULL,
  "zip_code" varchar(8) COLLATE "pg_catalog"."default" NOT NULL,
  "prefecture_name" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "city_name" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "area_name" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "created_date" timestamp(6) NOT NULL,
  "created_user" int8 NOT NULL,
  "updated_date" timestamp(6) NOT NULL,
  "updated_user" int8 NOT NULL
)
;

-- ----------------------------
-- Primary Key structure for table address
-- ----------------------------
ALTER TABLE "address" ADD CONSTRAINT "address_pkey" PRIMARY KEY ("address_id");

DROP TRIGGER IF EXISTS "address_created_date" ON "address";
CREATE TRIGGER "address_created_date" BEFORE INSERT ON "address" FOR EACH ROW EXECUTE PROCEDURE "created_date"() ;
DROP TRIGGER IF EXISTS "address_updated_date" ON "address" ;
CREATE TRIGGER "address_updated_date" BEFORE UPDATE ON "address" FOR EACH ROW EXECUTE PROCEDURE "updated_date"();


INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (14, '064-0823', '北海道', '札幌市中央区', '北三条西（２０～３０丁目）', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (15, '060-0034', '北海道', '札幌市中央区', '北四条東（１～８丁目）', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (16, '060-0004', '北海道', '札幌市中央区', '北四条西（１～１９丁目）', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (17, '064-0824', '北海道', '札幌市中央区', '北四条西（２０～３０丁目）', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (18, '060-0035', '北海道', '札幌市中央区', '北五条東', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (19, '060-0005', '北海道', '札幌市中央区', '北五条西（１～２４丁目）', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (20, '064-0825', '北海道', '札幌市中央区', '北五条西（２５～２９丁目）', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (21, '060-0006', '北海道', '札幌市中央区', '北六条西（１０～２５丁目）', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (22, '064-0826', '北海道', '札幌市中央区', '北六条西（２６～２８丁目）', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (23, '060-0007', '北海道', '札幌市中央区', '北七条西', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (24, '060-0008', '北海道', '札幌市中央区', '北八条西', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (25, '060-0009', '北海道', '札幌市中央区', '北九条西', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (26, '060-0010', '北海道', '札幌市中央区', '北十条西', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (27, '060-0011', '北海道', '札幌市中央区', '北十一条西', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (28, '060-0012', '北海道', '札幌市中央区', '北十二条西', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (29, '060-0013', '北海道', '札幌市中央区', '北十三条西', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (30, '060-0014', '北海道', '札幌市中央区', '北十四条西', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (31, '060-0015', '北海道', '札幌市中央区', '北十五条西', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (32, '060-0016', '北海道', '札幌市中央区', '北十六条西', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (33, '060-0017', '北海道', '札幌市中央区', '北十七条西', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (34, '060-0018', '北海道', '札幌市中央区', '北十八条西', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (35, '060-0020', '北海道', '札幌市中央区', '北二十条西', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (36, '060-0021', '北海道', '札幌市中央区', '北二十一条西', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (37, '060-0022', '北海道', '札幌市中央区', '北二十二条西', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (38, '064-0943', '北海道', '札幌市中央区', '界川', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (39, '064-0931', '北海道', '札幌市中央区', '中島公園', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (40, '064-0945', '北海道', '札幌市中央区', '盤渓', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (41, '064-0942', '北海道', '札幌市中央区', '伏見', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (42, '064-0946', '北海道', '札幌市中央区', '双子山', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (43, '064-0944', '北海道', '札幌市中央区', '円山西町', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (44, '060-0051', '北海道', '札幌市中央区', '南一条東', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (45, '060-0061', '北海道', '札幌市中央区', '南一条西（１～１９丁目）', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (46, '064-0801', '北海道', '札幌市中央区', '南一条西（２０～２８丁目）', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (47, '060-0052', '北海道', '札幌市中央区', '南二条東', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (48, '060-0062', '北海道', '札幌市中央区', '南二条西（１～１９丁目）', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (49, '064-0802', '北海道', '札幌市中央区', '南二条西（２０～２８丁目）', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (50, '060-0053', '北海道', '札幌市中央区', '南三条東', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (51, '060-0063', '北海道', '札幌市中央区', '南三条西（１～１８丁目）', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (52, '064-0803', '北海道', '札幌市中央区', '南三条西（２０～２８丁目）', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (53, '060-0054', '北海道', '札幌市中央区', '南四条東', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (54, '064-0804', '北海道', '札幌市中央区', '南四条西', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (55, '060-0055', '北海道', '札幌市中央区', '南五条東', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (56, '064-0805', '北海道', '札幌市中央区', '南五条西', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (57, '060-0056', '北海道', '札幌市中央区', '南六条東', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (58, '064-0806', '北海道', '札幌市中央区', '南六条西', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (59, '060-0057', '北海道', '札幌市中央区', '南七条東', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (60, '064-0807', '北海道', '札幌市中央区', '南七条西', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (61, '064-0808', '北海道', '札幌市中央区', '南八条西', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (62, '064-0809', '北海道', '札幌市中央区', '南九条西', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (63, '064-0810', '北海道', '札幌市中央区', '南十条西', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (64, '064-0811', '北海道', '札幌市中央区', '南十一条西', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (65, '064-0912', '北海道', '札幌市中央区', '南十二条西', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (66, '064-0913', '北海道', '札幌市中央区', '南十三条西', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (67, '064-0914', '北海道', '札幌市中央区', '南十四条西', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (68, '064-0915', '北海道', '札幌市中央区', '南十五条西', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (69, '064-0916', '北海道', '札幌市中央区', '南十六条西', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (70, '064-0917', '北海道', '札幌市中央区', '南十七条西', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (71, '064-0918', '北海道', '札幌市中央区', '南十八条西', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (72, '064-0919', '北海道', '札幌市中央区', '南十九条西', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (73, '064-0920', '北海道', '札幌市中央区', '南二十条西', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (74, '064-0921', '北海道', '札幌市中央区', '南二十一条西', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (75, '064-0922', '北海道', '札幌市中央区', '南二十二条西', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (76, '064-0923', '北海道', '札幌市中央区', '南二十三条西', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (77, '064-0924', '北海道', '札幌市中央区', '南二十四条西', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (78, '064-0925', '北海道', '札幌市中央区', '南二十五条西', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (79, '064-0926', '北海道', '札幌市中央区', '南二十六条西', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (80, '064-0927', '北海道', '札幌市中央区', '南二十七条西', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (81, '064-0928', '北海道', '札幌市中央区', '南二十八条西', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (82, '064-0929', '北海道', '札幌市中央区', '南二十九条西', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (83, '064-0930', '北海道', '札幌市中央区', '南三十条西（９～１１丁目）', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (84, '064-0959', '北海道', '札幌市中央区', '宮ケ丘', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (85, '064-0958', '北海道', '札幌市中央区', '宮の森', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (86, '064-0951', '北海道', '札幌市中央区', '宮の森一条', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (87, '064-0952', '北海道', '札幌市中央区', '宮の森二条', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (88, '064-0953', '北海道', '札幌市中央区', '宮の森三条', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (89, '064-0954', '北海道', '札幌市中央区', '宮の森四条', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (90, '001-0000', '北海道', '札幌市北区', '以下に掲載がない場合', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (91, '002-8071', '北海道', '札幌市北区', 'あいの里一条', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (92, '002-8072', '北海道', '札幌市北区', 'あいの里二条', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (93, '002-8073', '北海道', '札幌市北区', 'あいの里三条', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (94, '002-8074', '北海道', '札幌市北区', 'あいの里四条', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (95, '002-8075', '北海道', '札幌市北区', 'あいの里五条', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (96, '001-0045', '北海道', '札幌市北区', '麻生町', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (97, '060-0806', '北海道', '札幌市北区', '北六条西', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (98, '060-0807', '北海道', '札幌市北区', '北七条西', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (99, '060-0808', '北海道', '札幌市北区', '北八条西', now(), 1, now(), 1);
INSERT INTO "address"("address_id", "zip_code", "prefecture_name", "city_name", "area_name", "created_date", "created_user", "updated_date", "updated_user") VALUES (100, '060-0809', '北海道', '札幌市北区', '北九条西', now(), 1, now(), 1);
