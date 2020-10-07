-- ----------------------------
-- Add column is_display_first_screen
-- ----------------------------
ALTER TABLE "employees" ADD COLUMN IF NOT EXISTS "is_display_first_screen" bool;

-- ----------------------------
-- Sequence structure for positions
-- ----------------------------
DROP SEQUENCE IF EXISTS "positions_sequence_generator";
CREATE SEQUENCE "positions_sequence_generator"
INCREMENT 1
MINVALUE 1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Remove column display_order
-- ----------------------------
ALTER TABLE "positions" DROP IF EXISTS "display_order";