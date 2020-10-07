DROP FUNCTION IF EXISTS "calculator" CASCADE;
CREATE OR REPLACE FUNCTION "calculator"("formular" varchar, "target_table" varchar, "column_pk" varchar, "target_id" int8)
  RETURNS "pg_catalog"."float8" AS $BODY$
	DECLARE
		res float8;
BEGIN
	EXECUTE format('SELECT %s FROM %I WHERE %I = %s', formular, target_table, column_pk, target_id)
  INTO res;
	RETURN res;
EXCEPTION WHEN OTHERS THEN
  RETURN NULL;
END
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
  
DROP FUNCTION IF EXISTS "calculator_for_sort" CASCADE;
CREATE OR REPLACE FUNCTION "calculator_for_sort"("formular" varchar, "target_table" varchar, "column_pk" varchar, "target_id" int8)
  RETURNS "pg_catalog"."varchar" AS $BODY$
	DECLARE
		res TEXT;
BEGIN
	EXECUTE format('SELECT %s FROM %I WHERE %I = %s', formular, target_table, column_pk, target_id)
  INTO res;
-- 	RETURN coalesce(res, 0);
RETURN COALESCE(LPAD( res, 30, '0'), '');
EXCEPTION WHEN OTHERS THEN
  RETURN '';
END
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100