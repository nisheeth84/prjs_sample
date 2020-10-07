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

DROP TRIGGER IF EXISTS "notification_email_created_date" ON "notification_email";
CREATE TRIGGER "notification_email_created_date" BEFORE INSERT ON "notification_email" FOR EACH ROW EXECUTE PROCEDURE "created_date"() ;
DROP TRIGGER IF EXISTS "notification_email_updated_date" ON "notification_email" ;
CREATE TRIGGER "notification_email_updated_date" BEFORE UPDATE ON "notification_email" FOR EACH ROW EXECUTE PROCEDURE "updated_date"();

DROP TRIGGER IF EXISTS "notification_information_created_date" ON "notification_information";
CREATE TRIGGER "notification_information_created_date" BEFORE INSERT ON "notification_information" FOR EACH ROW EXECUTE PROCEDURE "created_date"() ;
DROP TRIGGER IF EXISTS "notification_information_updated_date" ON "notification_information" ;
CREATE TRIGGER "notification_information_updated_date" BEFORE UPDATE ON "notification_information" FOR EACH ROW EXECUTE PROCEDURE "updated_date"();

DROP TRIGGER IF EXISTS "notification_setting_created_date" ON "notification_setting";
CREATE TRIGGER "notification_setting_created_date" BEFORE INSERT ON "notification_setting" FOR EACH ROW EXECUTE PROCEDURE "created_date"() ;
DROP TRIGGER IF EXISTS "notification_setting_updated_date" ON "notification_setting" ;
CREATE TRIGGER "notification_setting_updated_date" BEFORE UPDATE ON "notification_setting" FOR EACH ROW EXECUTE PROCEDURE "updated_date"();

DROP TRIGGER IF EXISTS "notification_type_setting_created_date" ON "notification_type_setting";
CREATE TRIGGER "notification_type_setting_created_date" BEFORE INSERT ON "notification_type_setting" FOR EACH ROW EXECUTE PROCEDURE "created_date"() ;
DROP TRIGGER IF EXISTS "notification_type_setting_updated_date" ON "notification_type_setting" ;
CREATE TRIGGER "notification_type_setting_updated_date" BEFORE UPDATE ON "notification_type_setting" FOR EACH ROW EXECUTE PROCEDURE "updated_date"();

DROP TRIGGER IF EXISTS "menu_service_order_created_date" ON "menu_service_order";
CREATE TRIGGER "menu_service_order_created_date" BEFORE INSERT ON "menu_service_order" FOR EACH ROW EXECUTE PROCEDURE "created_date"() ;
DROP TRIGGER IF EXISTS "menu_service_order_updated_date" ON "menu_service_order" ;
CREATE TRIGGER "menu_service_order_updated_date" BEFORE UPDATE ON "menu_service_order" FOR EACH ROW EXECUTE PROCEDURE "updated_date"();

DROP TRIGGER IF EXISTS "menu_favorite_created_date" ON "menu_favorite";
CREATE TRIGGER "menu_favorite_created_date" BEFORE INSERT ON "menu_favorite" FOR EACH ROW EXECUTE PROCEDURE "created_date"() ;
DROP TRIGGER IF EXISTS "menu_favorite_updated_date" ON "menu_favorite" ;
CREATE TRIGGER "menu_favorite_updated_date" BEFORE UPDATE ON "menu_favorite" FOR EACH ROW EXECUTE PROCEDURE "updated_date"();

DROP TRIGGER IF EXISTS "notification_addess_created_date" ON "notification_addess";
CREATE TRIGGER "notification_addess_created_date" BEFORE INSERT ON "notification_addess" FOR EACH ROW EXECUTE PROCEDURE "created_date"() ;
DROP TRIGGER IF EXISTS "notification_addess_updated_date" ON "notification_addess" ;
CREATE TRIGGER "notification_addess_updated_date" BEFORE UPDATE ON "notification_addess" FOR EACH ROW EXECUTE PROCEDURE "updated_date"();

DROP TRIGGER IF EXISTS "notification_detail_setting_created_date" ON "notification_detail_setting";
CREATE TRIGGER "notification_detail_setting_created_date" BEFORE INSERT ON "notification_detail_setting" FOR EACH ROW EXECUTE PROCEDURE "created_date"() ;
DROP TRIGGER IF EXISTS "notification_detail_setting_updated_date" ON "notification_detail_setting" ;
CREATE TRIGGER "notification_detail_setting_updated_date" BEFORE UPDATE ON "notification_detail_setting" FOR EACH ROW EXECUTE PROCEDURE "updated_date"();