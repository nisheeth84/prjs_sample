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

DROP TRIGGER IF EXISTS "network_stands_created_date" ON "network_stands";
CREATE TRIGGER "network_stands_created_date" BEFORE INSERT ON "network_stands" FOR EACH ROW EXECUTE PROCEDURE "created_date"() ;
DROP TRIGGER IF EXISTS "network_stands_updated_date" ON "network_stands" ;
CREATE TRIGGER "network_stands_updated_date" BEFORE UPDATE ON "network_stands" FOR EACH ROW EXECUTE PROCEDURE "updated_date"();

DROP TRIGGER IF EXISTS "customers_list_favourites_created_date" ON "customers_list_favourites";
CREATE TRIGGER "customers_list_favourites_created_date" BEFORE INSERT ON "customers_list_favourites" FOR EACH ROW EXECUTE PROCEDURE "created_date"() ;
DROP TRIGGER IF EXISTS "customers_list_favourites_updated_date" ON "customers_list_favourites" ;
CREATE TRIGGER "customers_list_favourites_updated_date" BEFORE UPDATE ON "customers_list_favourites" FOR EACH ROW EXECUTE PROCEDURE "updated_date"();

DROP TRIGGER IF EXISTS "customers_list_members_created_date" ON "customers_list_members";
CREATE TRIGGER "customers_list_members_created_date" BEFORE INSERT ON "customers_list_members" FOR EACH ROW EXECUTE PROCEDURE "created_date"() ;
DROP TRIGGER IF EXISTS "customers_list_members_updated_date" ON "customers_list_members" ;
CREATE TRIGGER "customers_list_members_updated_date" BEFORE UPDATE ON "customers_list_members" FOR EACH ROW EXECUTE PROCEDURE "updated_date"();

DROP TRIGGER IF EXISTS "customers_list_participants_created_date" ON "customers_list_participants";
CREATE TRIGGER "customers_list_participants_created_date" BEFORE INSERT ON "customers_list_participants" FOR EACH ROW EXECUTE PROCEDURE "created_date"() ;
DROP TRIGGER IF EXISTS "customers_list_participants_updated_date" ON "customers_list_participants" ;
CREATE TRIGGER "customers_list_participants_updated_date" BEFORE UPDATE ON "customers_list_participants" FOR EACH ROW EXECUTE PROCEDURE "updated_date"();

DROP TRIGGER IF EXISTS "customers_list_search_conditions_created_date" ON "customers_list_search_conditions";
CREATE TRIGGER "customers_list_search_conditions_created_date" BEFORE INSERT ON "customers_list_search_conditions" FOR EACH ROW EXECUTE PROCEDURE "created_date"() ;
DROP TRIGGER IF EXISTS "customers_list_search_conditions_updated_date" ON "customers_list_search_conditions" ;
CREATE TRIGGER "customers_list_search_conditions_updated_date" BEFORE UPDATE ON "customers_list_search_conditions" FOR EACH ROW EXECUTE PROCEDURE "updated_date"();

DROP TRIGGER IF EXISTS "masters_motivations_created_date" ON "masters_motivations";
CREATE TRIGGER "masters_motivations_created_date" BEFORE INSERT ON "masters_motivations" FOR EACH ROW EXECUTE PROCEDURE "created_date"() ;
DROP TRIGGER IF EXISTS "masters_motivations_updated_date" ON "masters_motivations" ;
CREATE TRIGGER "masters_motivations_updated_date" BEFORE UPDATE ON "masters_motivations" FOR EACH ROW EXECUTE PROCEDURE "updated_date"();

DROP TRIGGER IF EXISTS "masters_scenarios_created_date" ON "masters_scenarios";
CREATE TRIGGER "masters_scenarios_created_date" BEFORE INSERT ON "masters_scenarios" FOR EACH ROW EXECUTE PROCEDURE "created_date"() ;
DROP TRIGGER IF EXISTS "masters_scenarios_updated_date" ON "masters_scenarios" ;
CREATE TRIGGER "masters_scenarios_updated_date" BEFORE UPDATE ON "masters_scenarios" FOR EACH ROW EXECUTE PROCEDURE "updated_date"();

DROP TRIGGER IF EXISTS "masters_scenarios_details_created_date" ON "masters_scenarios_details";
CREATE TRIGGER "masters_scenarios_details_created_date" BEFORE INSERT ON "masters_scenarios_details" FOR EACH ROW EXECUTE PROCEDURE "created_date"() ;
DROP TRIGGER IF EXISTS "masters_scenarios_details_updated_date" ON "masters_scenarios_details" ;
CREATE TRIGGER "masters_scenarios_details_updated_date" BEFORE UPDATE ON "masters_scenarios_details" FOR EACH ROW EXECUTE PROCEDURE "updated_date"();

DROP TRIGGER IF EXISTS "masters_stands_created_date" ON "masters_stands";
CREATE TRIGGER "masters_stands_created_date" BEFORE INSERT ON "masters_stands" FOR EACH ROW EXECUTE PROCEDURE "created_date"() ;
DROP TRIGGER IF EXISTS "masters_stands_updated_date" ON "masters_stands" ;
CREATE TRIGGER "masters_stands_updated_date" BEFORE UPDATE ON "masters_stands" FOR EACH ROW EXECUTE PROCEDURE "updated_date"();

DROP TRIGGER IF EXISTS "customers_business_created_date" ON "customers_business";
CREATE TRIGGER "customers_business_created_date" BEFORE INSERT ON "customers_business" FOR EACH ROW EXECUTE PROCEDURE "created_date"() ;
DROP TRIGGER IF EXISTS "customers_business_updated_date" ON "customers_business" ;
CREATE TRIGGER "customers_business_updated_date" BEFORE UPDATE ON "customers_business" FOR EACH ROW EXECUTE PROCEDURE "updated_date"();

DROP TRIGGER IF EXISTS "customers_histories_created_date" ON "customers_histories";
CREATE TRIGGER "customers_histories_created_date" BEFORE INSERT ON "customers_histories" FOR EACH ROW EXECUTE PROCEDURE "created_date"() ;
DROP TRIGGER IF EXISTS "customers_histories_updated_date" ON "customers_histories" ;
CREATE TRIGGER "customers_histories_updated_date" BEFORE UPDATE ON "customers_histories" FOR EACH ROW EXECUTE PROCEDURE "updated_date"();

DROP TRIGGER IF EXISTS "customers_list_created_date" ON "customers_list";
CREATE TRIGGER "customers_list_created_date" BEFORE INSERT ON "customers_list" FOR EACH ROW EXECUTE PROCEDURE "created_date"() ;
DROP TRIGGER IF EXISTS "customers_list_updated_date" ON "customers_list" ;
CREATE TRIGGER "customers_list_updated_date" BEFORE UPDATE ON "customers_list" FOR EACH ROW EXECUTE PROCEDURE "updated_date"();

DROP TRIGGER IF EXISTS "customers_created_date" ON "customers";
CREATE TRIGGER "customers_created_date" BEFORE INSERT ON "customers" FOR EACH ROW EXECUTE PROCEDURE "created_date"() ;
DROP TRIGGER IF EXISTS "customers_updated_date" ON "customers" ;
CREATE TRIGGER "customers_updated_date" BEFORE UPDATE ON "customers" FOR EACH ROW EXECUTE PROCEDURE "updated_date"();