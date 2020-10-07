DROP FUNCTION IF EXISTS "update_parent_tree" CASCADE;
CREATE OR REPLACE FUNCTION "update_parent_tree"()
  RETURNS "pg_catalog"."trigger" AS $BODY$
	DECLARE
		array_parent_tree_id jsonb;
		cheack_flg INTEGER;
		my_sql VARCHAR;
	BEGIN
	  -- check parent exist
		IF (NEW.parent_id IS NOT NULL) THEN
			my_sql = format('SELECT 1 FROM %s.customers WHERE customer_id = $1', TG_TABLE_SCHEMA);
			EXECUTE my_sql INTO cheack_flg USING NEW.parent_id;
			IF (cheack_flg IS NULL) THEN
				RAISE EXCEPTION '親部門は存在しません'; 
			END IF;
		END IF;
	  
	  -- for insert
	  IF (TG_OP = 'INSERT') THEN
  		-- set parent_tree for insert
		my_sql = format('SELECT %s.get_parent_customer($1, $2) || jsonb_build_array ($3)', TG_TABLE_SCHEMA);
		EXECUTE my_sql INTO array_parent_tree_id USING NEW.parent_id, TG_TABLE_SCHEMA::text, NEW.customer_id;
		NEW.parent_tree = array_parent_tree_id;
	  RETURN NEW;
	END IF;
	
	-- for update
	IF (TG_OP = 'UPDATE') THEN
		-- check parent customer appropriate
		my_sql = format('SELECT 1 FROM %s.customers WHERE customer_id =$1 AND $2 IN (SELECT jsonb_array_elements(parent_tree)::BIGINT)', TG_TABLE_SCHEMA);
		EXECUTE my_sql INTO cheack_flg USING NEW.parent_id, NEW.customer_id;
		IF (cheack_flg = 1 OR NEW.parent_id = NEW.customer_id) THEN
		    RAISE EXCEPTION '変更する部署と所属部署の階層関係が適当ではありません。'; 
	    END IF;

		my_sql = format(
			'UPDATE %s.customers 
			 SET parent_tree = %s.get_parent_customer(parent_id, $1) || jsonb_build_array (customer_id)
			 WHERE	$2 IN (SELECT jsonb_array_elements(parent_tree)::BIGINT)', TG_TABLE_SCHEMA, TG_TABLE_SCHEMA
		);
		EXECUTE my_sql USING TG_TABLE_SCHEMA::text, NEW.customer_id;
		RETURN NEW;
	END IF;
	
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;

---------------------------------------------
-- create trigger update parent_tree for create customer
---------------------------------------------
DROP TRIGGER IF	EXISTS "customers_create_parent_tree" ON "customers";
CREATE TRIGGER "customers_create_parent_tree" BEFORE INSERT ON "customers" FOR EACH ROW
EXECUTE PROCEDURE "update_parent_tree" ( );

---------------------------------------------
-- create trigger update parent_tree for update customer
---------------------------------------------
DROP TRIGGER IF	EXISTS "customers_update_parent_tree" ON "customers";
CREATE TRIGGER "customers_update_parent_tree" AFTER UPDATE ON "customers" FOR EACH ROW
WHEN (NEW.parent_id IS DISTINCT FROM OLD.parent_id)
EXECUTE PROCEDURE "update_parent_tree" ( );