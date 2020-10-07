DROP FUNCTION IF EXISTS "get_select_organization_value_for_sort" CASCADE;
CREATE OR REPLACE FUNCTION "get_select_organization_value_for_sort"("fname" varchar, "org_data" jsonb)
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
		my_sql = format('SELECT concat(emp.employee_surname, emp.employee_name)
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
	RETURN coalesce(result, '');
EXCEPTION WHEN OTHERS THEN
  RETURN '';
END$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;