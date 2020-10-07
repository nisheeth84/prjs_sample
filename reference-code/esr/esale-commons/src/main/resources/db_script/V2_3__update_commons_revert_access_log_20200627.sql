-- ----------------------------
-- Sequence structure for access_log_sequence_generator
-- ----------------------------
DROP TABLE IF EXISTS "access_log";
DROP SEQUENCE IF EXISTS "access_log_sequence_generator";
CREATE SEQUENCE "access_log_sequence_generator" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Table structure for access_log
-- ----------------------------
CREATE TABLE "access_log" (
  "access_log_id" int8 NOT NULL DEFAULT nextval('access_log_sequence_generator'::regclass),
  "content" jsonb NOT NULL
)
;