CREATE EXTENSION IF NOT EXISTS postgres_fdw;

-- Create server for commons database
CREATE SERVER IF NOT EXISTS commons_dbrmd FOREIGN DATA WRAPPER postgres_fdw OPTIONS (hostaddr '127.0.0.1', dbname 'commons');
CREATE USER MAPPING IF NOT EXISTS FOR postgres SERVER commons_dbrmd OPTIONS (user 'postgres', password '');

-- Create server for products database
CREATE SERVER IF NOT EXISTS products_dbrmd FOREIGN DATA WRAPPER postgres_fdw OPTIONS (hostaddr '127.0.0.1', dbname 'products');
CREATE USER MAPPING IF NOT EXISTS FOR postgres SERVER products_dbrmd OPTIONS (user 'postgres', password '');

DROP FOREIGN TABLE IF EXISTS "field_info_view";
CREATE FOREIGN TABLE "field_info_view" (
  "field_id" int8 NOT NULL,
  "created_date" timestamp(6) NOT NULL,
  "created_user" int8 NOT NULL,
  "updated_date" timestamp(6) NOT NULL,
  "updated_user" int8 NOT NULL,
  "config_value" varchar(4000) COLLATE "pg_catalog"."default",
  "decimal_place" int4,
  "default_value" varchar(1000) COLLATE "pg_catalog"."default",
  "field_belong" int4 NOT NULL,
  "field_name" varchar(60) COLLATE "pg_catalog"."default" NOT NULL,
  "field_order" int4,
  "field_type" int4,
  "is_double_column" bool,
  "is_linked_google_map" bool,
  "others_permission_level" int4,
  "own_permission_level" int4,
  "url_target" varchar(1000) COLLATE "pg_catalog"."default",
  "url_text" varchar(500) COLLATE "pg_catalog"."default",
  "field_group" int8,
  "field_label" jsonb NOT NULL,
  "modify_flag" int4,
  "available_flag" int4,
  "link_target" int4,
  "currency_unit" varchar(50) COLLATE "pg_catalog"."default",
  "url_type" int4,
  "lookup_data" jsonb,
  "select_organization_data" jsonb,
  "relation_data" jsonb,
  "is_default" bool,
  "max_length" int4,
  "type_unit" int4,
  "tab_data" jsonb,
  "lookup_field_id" int8,
  "looked_field_id" int8,
  "iframe_height" int4
)
SERVER "commons_dbrmd"
OPTIONS ("table_name" 'field_info')
;

DROP FOREIGN TABLE IF EXISTS "field_info_personal_view";
CREATE FOREIGN TABLE "field_info_personal_view" (
  "field_info_personal_id" int8 NOT NULL,
  "created_date" timestamp(6) NOT NULL,
  "created_user" int8 NOT NULL,
  "updated_date" timestamp(6) NOT NULL,
  "updated_user" int8 NOT NULL,
  "column_width" int4,
  "employee_id" int8 NOT NULL,
  "extension_belong" int4 NOT NULL,
  "field_id" int8 NOT NULL,
  "field_order" int4,
  "is_column_fixed" bool,
  "field_belong" int4 NOT NULL,
  "relation_field_id" int8
)
SERVER "commons_dbrmd"
OPTIONS ("table_name" 'field_info_personal')
;

DROP FOREIGN TABLE IF EXISTS "field_info_item_view";
CREATE FOREIGN TABLE "field_info_item_view" (
  "item_id" int8 NOT NULL,
  "created_date" timestamp(6) NOT NULL,
  "created_user" int8 NOT NULL,
  "updated_date" timestamp(6) NOT NULL,
  "updated_user" int8 NOT NULL,
  "field_id" int8 NOT NULL,
  "is_available" bool,
  "is_default" bool,
  "item_order" int4,
  "item_label" jsonb NOT NULL
)
SERVER "commons_dbrmd"
OPTIONS ("table_name" 'field_info_item')
;

DROP FOREIGN TABLE IF EXISTS "languages_view";
CREATE FOREIGN TABLE "languages_view" (
  "language_id" int8 NOT NULL,
  "created_date" timestamp(6) NOT NULL,
  "created_user" int8 NOT NULL,
  "updated_date" timestamp(6) NOT NULL,
  "updated_user" int8 NOT NULL,
  "display_order" int8,
  "language_code" varchar(5) COLLATE "pg_catalog"."default" NOT NULL,
  "language_name" varchar(50) COLLATE "pg_catalog"."default" NOT NULL
)
SERVER "commons_dbrmd"
OPTIONS ("table_name" 'languages')
;

DROP FOREIGN TABLE IF EXISTS "timezones_view";
CREATE FOREIGN TABLE "timezones_view" (
  "timezone_id" int8 NOT NULL,
  "created_date" timestamp(6) NOT NULL,
  "created_user" int8 NOT NULL,
  "updated_date" timestamp(6) NOT NULL,
  "updated_user" int8 NOT NULL,
  "display_order" int4,
  "timezone_name" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "timezone_short_name" varchar(20) COLLATE "pg_catalog"."default" NOT NULL
)
SERVER "commons_dbrmd"
OPTIONS ("table_name" 'timezones')
;

DROP FUNCTION IF EXISTS "calculator";
CREATE OR REPLACE FUNCTION "calculator"("formular" varchar, "target_table" varchar, "column_pk" varchar, "target_id" int8)
  RETURNS "pg_catalog"."float8" AS $BODY$
	DECLARE
		res float8;
BEGIN
	EXECUTE format('SELECT %s FROM %I WHERE %I = %s', formular, target_table, column_pk, target_id)
  INTO res;
	RETURN coalesce(res, 0);
EXCEPTION WHEN OTHERS THEN
  RETURN 0;
END
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;

CREATE OR REPLACE FUNCTION "get_relation_value_for_sort"("fname" varchar, "target_table" varchar, "column_data" varchar, "column_pk" varchar, "ids" jsonb, "langkey" varchar=''::character varying)
  RETURNS "pg_catalog"."text" AS $BODY$
	DECLARE
		relation_type_var int4 = 17;
		select_organization_type_var int4 = 18;
		org_data_var VARCHAR;
		res_var VARCHAR;
		sql_var VARCHAR;
		sql_join_var VARCHAR;
		field_name_var VARCHAR;
		field_type_var int4;
		field_belong_var int4;
		target_column_var VARCHAR;
BEGIN
	SELECT fir.field_name, fir.field_type, fir.field_belong INTO field_name_var, field_type_var, field_belong_var
			FROM field_info_view fi
			INNER JOIN field_info_view fir ON (fi.relation_data->'display_field_id')::int8 = fir.field_id
			WHERE fi.field_type = relation_type_var
			AND fi.field_name = $1
			AND fir.field_belong = (fi.relation_data->'field_belong')::int8;
			
	IF field_name_var IS NOT NULL AND jsonb_array_length(ids) = 1 THEN
		IF field_name_var LIKE 'pulldown_%'
					OR field_name_var LIKE 'radio_%' THEN 
				target_column_var = format('tbl.%s->%L', column_data, field_name_var);
				sql_join_var = format('INNER JOIN field_info_item_view fii ON fii.item_id = (%s)::int8', target_column_var);
				target_column_var = format('fii.item_label->>%L AS label', langKey);
		ELSE
			IF field_name_var LIKE 'multiple_pulldown_%'
					OR field_name_var LIKE 'checkbox_%' THEN 
				target_column_var = format('tbl.%s->%L', column_data, field_name_var);
				sql_join_var = format('LEFT JOIN LATERAL jsonb_array_elements(%s) t(_value) ON TRUE 
						INNER JOIN field_info_item_view fii ON fii.item_id = t._value::int8', target_column_var);
				target_column_var = format('STRING_AGG(fii.item_label->>%L, '''' ORDER BY fii.item_order) AS label', langKey);
			ELSE
				IF field_name_var LIKE 'numeric_%' 
						OR field_name_var LIKE 'date_%'
						OR field_name_var LIKE 'date_time_%'
						OR field_name_var LIKE 'time_%'
						OR field_name_var LIKE 'text_%'
						OR field_name_var LIKE 'textarea_%'
						OR field_name_var LIKE 'phone_number_%'
						OR field_name_var LIKE 'address_%'
						OR field_name_var LIKE 'email_%' THEN 
					target_column_var = format('tbl.%s->>%L', column_data, field_name_var);
				ELSE
					IF field_name_var LIKE 'calculation_%' THEN 
						EXECUTE format('SELECT fi.config_value FROM field_info_view fi WHERE fi.field_name = %L', field_name_var) 
						INTO target_column_var;
					ELSE
						IF field_name_var LIKE 'select_organization_%' OR field_type_var = select_organization_type_var THEN
							IF field_name_var LIKE 'select_organization_%' THEN
								sql_var = format('SELECT tbl.%s->%L FROM %I tbl WHERE %I = %s', column_data, field_name_var, target_table, column_pk, ids->>0);
								EXECUTE sql_var INTO org_data_var;
								res_var = get_select_organization_value_for_sort(field_name_var, org_data_var);
							ELSE
								sql_var = format('SELECT tbl.%s FROM %I tbl WHERE %I = %s', field_name_var, target_table, column_pk, ids->>0);
								EXECUTE sql_var INTO org_data_var;
								res_var = get_select_organization_value_for_sort(field_name_var, org_data_var);
							END IF;
						ELSE
							target_column_var = field_name_var;
						END IF;
					END IF;
				END IF;
			END IF;
		END IF;
		IF target_column_var IS NOT NULL THEN
			sql_var = format('SELECT %s FROM %I tbl %s WHERE %I = %s', target_column_var, target_table, sql_join_var, column_pk, ids->>0);
			EXECUTE sql_var INTO res_var;
		END IF;
	END IF;
	RETURN coalesce(res_var, 0);
EXCEPTION WHEN OTHERS THEN
  RETURN 0;
END$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;

CREATE OR REPLACE FUNCTION "get_select_organization_value_for_sort"("fname" varchar, "org_data" varchar)
  RETURNS "pg_catalog"."text" AS $BODY$
	DECLARE
		field_type_var int4 = 18;
		format_single_var int4 = 1;
		target_var varchar;
		my_sql VARCHAR;
		result VARCHAR;
BEGIN
	SELECT fi.select_organization_data->>'target' INTO target_var
			FROM field_info_view fi
			WHERE fi.field_type = field_type_var
			AND fi.field_name = $1
			AND (fi.select_organization_data->'format')::int4 = format_single_var;
	IF target_var = '100' THEN
		my_sql = format('SELECT emp.employee_name
			FROM employees emp
			WHERE emp.employee_id = ((%L)::jsonb->0->>''employee_id'')::int8', org_data);
	ELSE 
		IF target_var = '010' THEN
			my_sql = format('SELECT dep.department_name
				FROM departments dep
				WHERE dep.department_id = ((%L)::jsonb->0->>''department_id'')::int8', org_data);
		ELSE 
			IF target_var = '001' THEN
				my_sql = format('SELECT grp.group_name
					FROM employees_groups grp 
					WHERE grp.group_id = ((%L)::jsonb->0->>''group_id'')::int8', org_data);
			END IF;
		END IF;
	END IF;
	IF my_sql IS NOT NULL THEN
		EXECUTE my_sql INTO result;
	END IF;
	RETURN coalesce(result, 0);
EXCEPTION WHEN OTHERS THEN
  RETURN 0;
END$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
  
DROP FOREIGN TABLE IF EXISTS "products_view";
CREATE FOREIGN TABLE "products_view" (
  "product_id" int8 NOT NULL,
  "created_date" timestamp(6) NOT NULL,
  "created_user" int8 NOT NULL,
  "updated_date" timestamp(6) NOT NULL,
  "updated_user" int8 NOT NULL,
  "is_display" bool DEFAULT true,
  "is_set" bool DEFAULT false,
  "memo" varchar(500) COLLATE "pg_catalog"."default",
  "product_category_id" int8,
  "product_data" jsonb,
  "product_image_name" varchar(100) COLLATE "pg_catalog"."default",
  "product_image_path" varchar(255) COLLATE "pg_catalog"."default",
  "product_name" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "product_type_id" int8,
  "unit_price" int8
)
SERVER "products_dbrmd"
OPTIONS ("table_name" 'products')
;
