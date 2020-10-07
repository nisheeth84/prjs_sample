CREATE 
	OR REPLACE FUNCTION "created_date" ( ) RETURNS "pg_catalog"."trigger" AS $BODY$ BEGIN
		NEW.created_date := NOW( );
	    NEW.updated_date := NOW( );
	RETURN NEW;
END;
$BODY$ LANGUAGE plpgsql VOLATILE COST 100;


CREATE 
	OR REPLACE FUNCTION "updated_date" ( ) RETURNS "pg_catalog"."trigger" AS $BODY$ BEGIN
		NEW.updated_date := NOW( );
	RETURN NEW;
	
END;
$BODY$ LANGUAGE plpgsql VOLATILE COST 100;

DROP TRIGGER IF EXISTS "employees_group_search_conditions_created_date" ON "employees_group_search_conditions";
CREATE TRIGGER "employees_group_search_conditions_created_date" BEFORE INSERT ON "employees_group_search_conditions" FOR EACH ROW EXECUTE PROCEDURE "created_date"() ;
DROP TRIGGER IF EXISTS "employees_group_search_conditions_updated_date" ON "employees_group_search_conditions" ;
CREATE TRIGGER "employees_group_search_conditions_updated_date" BEFORE UPDATE ON "employees_group_search_conditions" FOR EACH ROW EXECUTE PROCEDURE "updated_date"();

DROP TRIGGER IF EXISTS "employees_histories_created_date" ON "employees_histories";
CREATE TRIGGER "employees_histories_created_date" BEFORE INSERT ON "employees_histories" FOR EACH ROW EXECUTE PROCEDURE "created_date"() ;
DROP TRIGGER IF EXISTS "employees_histories_updated_date" ON "employees_histories" ;
CREATE TRIGGER "employees_histories_updated_date" BEFORE UPDATE ON "employees_histories" FOR EACH ROW EXECUTE PROCEDURE "updated_date"();

DROP TRIGGER IF EXISTS "positions_created_date" ON "positions";
CREATE TRIGGER "positions_created_date" BEFORE INSERT ON "positions" FOR EACH ROW EXECUTE PROCEDURE "created_date"() ;
DROP TRIGGER IF EXISTS "positions_updated_date" ON "positions" ;
CREATE TRIGGER "positions_updated_date" BEFORE UPDATE ON "positions" FOR EACH ROW EXECUTE PROCEDURE "updated_date"();

DROP TRIGGER IF EXISTS "employees_packages_created_date" ON "employees_packages";
CREATE TRIGGER "employees_packages_created_date" BEFORE INSERT ON "employees_packages" FOR EACH ROW EXECUTE PROCEDURE "created_date"() ;
DROP TRIGGER IF EXISTS "employees_packages_updated_date" ON "employees_packages" ;
CREATE TRIGGER "employees_packages_updated_date" BEFORE UPDATE ON "employees_packages" FOR EACH ROW EXECUTE PROCEDURE "updated_date"();

DROP TRIGGER IF EXISTS "departments_created_date" ON "departments";
CREATE TRIGGER "departments_created_date" BEFORE INSERT ON "departments" FOR EACH ROW EXECUTE PROCEDURE "created_date"() ;
DROP TRIGGER IF EXISTS "departments_updated_date" ON "departments" ;
CREATE TRIGGER "departments_updated_date" BEFORE UPDATE ON "departments" FOR EACH ROW EXECUTE PROCEDURE "updated_date"();

DROP TRIGGER IF EXISTS "employees_departments_created_date" ON "employees_departments";
CREATE TRIGGER "employees_departments_created_date" BEFORE INSERT ON "employees_departments" FOR EACH ROW EXECUTE PROCEDURE "created_date"() ;
DROP TRIGGER IF EXISTS "employees_departments_updated_date" ON "employees_departments" ;
CREATE TRIGGER "employees_departments_updated_date" BEFORE UPDATE ON "employees_departments" FOR EACH ROW EXECUTE PROCEDURE "updated_date"();

DROP TRIGGER IF EXISTS "employees_created_date" ON "employees";
CREATE TRIGGER "employees_created_date" BEFORE INSERT ON "employees" FOR EACH ROW EXECUTE PROCEDURE "created_date"() ;
DROP TRIGGER IF EXISTS "employees_updated_date" ON "employees" ;
CREATE TRIGGER "employees_updated_date" BEFORE UPDATE ON "employees" FOR EACH ROW EXECUTE PROCEDURE "updated_date"();

DROP TRIGGER IF EXISTS "employees_groups_created_date" ON "employees_groups";
CREATE TRIGGER "employees_groups_created_date" BEFORE INSERT ON "employees_groups" FOR EACH ROW EXECUTE PROCEDURE "created_date"() ;
DROP TRIGGER IF EXISTS "employees_groups_updated_date" ON "employees_groups" ;
CREATE TRIGGER "employees_groups_updated_date" BEFORE UPDATE ON "employees_groups" FOR EACH ROW EXECUTE PROCEDURE "updated_date"();

DROP TRIGGER IF EXISTS "emp_detail_created_date" ON "emp_detail";
CREATE TRIGGER "emp_detail_created_date" BEFORE INSERT ON "emp_detail" FOR EACH ROW EXECUTE PROCEDURE "created_date"() ;
DROP TRIGGER IF EXISTS "emp_detail_updated_date" ON "emp_detail" ;
CREATE TRIGGER "emp_detail_updated_date" BEFORE UPDATE ON "emp_detail" FOR EACH ROW EXECUTE PROCEDURE "updated_date"();

DROP TRIGGER IF EXISTS "employees_group_members_created_date" ON "employees_group_members";
CREATE TRIGGER "employees_group_members_created_date" BEFORE INSERT ON "employees_group_members" FOR EACH ROW EXECUTE PROCEDURE "created_date"() ;
DROP TRIGGER IF EXISTS "employees_group_members_updated_date" ON "employees_group_members" ;
CREATE TRIGGER "employees_group_members_updated_date" BEFORE UPDATE ON "employees_group_members" FOR EACH ROW EXECUTE PROCEDURE "updated_date"();

DROP TRIGGER IF EXISTS "employees_group_participants_created_date" ON "employees_group_participants";
CREATE TRIGGER "employees_group_participants_created_date" BEFORE INSERT ON "employees_group_participants" FOR EACH ROW EXECUTE PROCEDURE "created_date"() ;
DROP TRIGGER IF EXISTS "employees_group_participants_updated_date" ON "employees_group_participants" ;
CREATE TRIGGER "employees_group_participants_updated_date" BEFORE UPDATE ON "employees_group_participants" FOR EACH ROW EXECUTE PROCEDURE "updated_date"();