CREATE OR REPLACE FUNCTION "get_relation_value_for_sort"("fname" varchar, "target_table" varchar, "column_data" varchar, "column_pk" varchar, "ids" jsonb, "langkey" varchar=''::character varying)
  RETURNS relation_sort_value AS $BODY$
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
		calculation_data_var VARCHAR;
		return_value relation_sort_value;
BEGIN
	SELECT fir.field_name, fir.field_type, fir.field_belong INTO field_name_var, field_type_var, field_belong_var
			FROM field_info_view fi
			INNER JOIN field_info_view fir ON TO_NUMBER((fi.relation_data->'display_field_id')::TEXT, '9999999999999999999') = fir.field_id
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
						INTO calculation_data_var;
						calculation_data_var = REPLACE(calculation_data_var, '''''', '''');
						BEGIN
							sql_var = format('SELECT %s FROM %I WHERE %I = %s', calculation_data_var, target_table, column_pk, ids->>0);
							EXECUTE sql_var INTO res_var;
						EXCEPTION WHEN OTHERS THEN
							sql_var = format('SELECT %s FROM %I_view WHERE %I = %s', calculation_data_var, target_table, column_pk, ids->>0);
							EXECUTE sql_var INTO res_var;
						END;
					ELSE
						IF field_name_var LIKE 'select_organization_%' OR field_type_var = select_organization_type_var THEN
							IF field_name_var LIKE 'select_organization_%' THEN
							BEGIN
								EXECUTE format('SELECT tbl.%s->%L FROM %I_view tbl WHERE %I = %s', column_data, field_name_var, target_table, column_pk, ids->>0) INTO org_data_var;
							EXCEPTION WHEN OTHERS THEN
								EXECUTE format('SELECT tbl.%s->%L FROM %I tbl WHERE %I = %s', column_data, field_name_var, target_table, column_pk, ids->>0) INTO org_data_var;
							END;
								res_var = get_select_organization_value_for_sort(field_name_var, org_data_var::JSONB);
							ELSE
							BEGIN
								sql_var = format('SELECT tbl.%s FROM %I_view tbl WHERE %I = %s', field_name_var, target_table, column_pk, ids->>0);
							  EXECUTE sql_var INTO org_data_var;
							EXCEPTION WHEN OTHERS THEN
								sql_var = format('SELECT tbl.%s FROM %I tbl WHERE %I = %s', field_name_var, target_table, column_pk, ids->>0);
							  EXECUTE sql_var INTO org_data_var;
							END;
								res_var = get_select_organization_value_for_sort(field_name_var, org_data_var::JSONB);
							END IF;
						ELSE
							target_column_var = field_name_var;
						END IF;
					END IF;
				END IF;
			END IF;
		END IF;
		IF target_column_var IS NOT NULL THEN
			BEGIN
				sql_var = format('SELECT %s FROM %I tbl %s WHERE %I = %s', target_column_var, target_table, sql_join_var, column_pk, ids->>0);
				EXECUTE sql_var INTO res_var;
			EXCEPTION WHEN OTHERS THEN
				sql_var = format('SELECT %s FROM %I_view tbl %s WHERE %I = %s', target_column_var, target_table, sql_join_var, column_pk, ids->>0);
				EXECUTE sql_var INTO res_var;
			END;
		END IF;
	END IF;
	IF field_name_var LIKE 'numeric_%'
		 OR field_name_var LIKE 'calculation_%' THEN
		 return_value.number_value = COALESCE(res_var::DECIMAL, -999999999999999999999999999999);
		 RETURN return_value;
	END IF;
	return_value.string_value = coalesce(res_var, '');
	RETURN return_value;
EXCEPTION WHEN OTHERS THEN
	IF field_name_var LIKE 'numeric_%'
		 OR field_name_var LIKE 'calculation_%' THEN
		 return_value.number_value = COALESCE(res_var::DECIMAL, -999999999999999999999999999999);
		 RETURN return_value;
	ELSE 
	return_value.string_value = '';
	RETURN return_value;
	END IF;
END$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100