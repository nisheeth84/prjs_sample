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

DROP TRIGGER IF EXISTS "address_created_date" ON "address";
CREATE TRIGGER "address_created_date" BEFORE INSERT ON "address" FOR EACH ROW EXECUTE PROCEDURE "created_date"();
DROP TRIGGER IF EXISTS "address_updated_date" ON "address";
CREATE TRIGGER "address_updated_date" BEFORE INSERT OR UPDATE ON "address" FOR EACH ROW EXECUTE PROCEDURE "updated_date"();

DROP TRIGGER IF EXISTS "access_log_created_date" ON "access_log";
CREATE TRIGGER "access_log_created_date" BEFORE INSERT ON "access_log" FOR EACH ROW EXECUTE PROCEDURE "created_date"();
DROP TRIGGER IF EXISTS "access_log_updated_date" ON "access_log";
CREATE TRIGGER "access_log_updated_date" BEFORE INSERT OR UPDATE ON "access_log" FOR EACH ROW EXECUTE PROCEDURE "updated_date"();

DROP TRIGGER IF EXISTS "field_info_created_date" ON "field_info";
CREATE TRIGGER "field_info_created_date" BEFORE INSERT ON "field_info" FOR EACH ROW EXECUTE PROCEDURE "created_date"();
DROP TRIGGER IF EXISTS "field_info_updated_date" ON "field_info";
CREATE TRIGGER "field_info_updated_date" BEFORE INSERT OR UPDATE ON "field_info" FOR EACH ROW EXECUTE PROCEDURE "updated_date"();

DROP TRIGGER IF EXISTS "field_info_item_created_date" ON "field_info_item";
CREATE TRIGGER "field_info_item_created_date" BEFORE INSERT ON "field_info_item" FOR EACH ROW EXECUTE PROCEDURE "created_date"();
DROP TRIGGER IF EXISTS "field_info_item_updated_date" ON "field_info_item";
CREATE TRIGGER "field_info_item_updated_date" BEFORE INSERT OR UPDATE ON "field_info_item" FOR EACH ROW EXECUTE PROCEDURE "updated_date"();

DROP TRIGGER IF EXISTS "field_info_personal_created_date" ON "field_info_personal";
CREATE TRIGGER "field_info_personal_created_date" BEFORE INSERT ON "field_info_personal" FOR EACH ROW EXECUTE PROCEDURE "created_date"();
DROP TRIGGER IF EXISTS "field_info_personal_updated_date" ON "field_info_personal";
CREATE TRIGGER "field_info_personal_updated_date" BEFORE INSERT OR UPDATE ON "field_info_personal" FOR EACH ROW EXECUTE PROCEDURE "updated_date"();

DROP TRIGGER IF EXISTS "field_info_tab_created_date" ON "field_info_tab";
CREATE TRIGGER "field_info_tab_created_date" BEFORE INSERT ON "field_info_tab" FOR EACH ROW EXECUTE PROCEDURE "created_date"();
DROP TRIGGER IF EXISTS "field_info_tab_updated_date" ON "field_info_tab";
CREATE TRIGGER "field_info_tab_updated_date" BEFORE INSERT OR UPDATE ON "field_info_tab" FOR EACH ROW EXECUTE PROCEDURE "updated_date"();

DROP TRIGGER IF EXISTS "field_info_tab_personal_created_date" ON "field_info_tab_personal";
CREATE TRIGGER "field_info_tab_personal_created_date" BEFORE INSERT ON "field_info_tab_personal" FOR EACH ROW EXECUTE PROCEDURE "created_date"();
DROP TRIGGER IF EXISTS "field_info_tab_personal_updated_date" ON "field_info_tab_personal";
CREATE TRIGGER "field_info_tab_personal_updated_date" BEFORE INSERT OR UPDATE ON "field_info_tab_personal" FOR EACH ROW EXECUTE PROCEDURE "updated_date"();

DROP TRIGGER IF EXISTS "general_setting_created_date" ON "general_setting";
CREATE TRIGGER "general_setting_created_date" BEFORE INSERT ON "general_setting" FOR EACH ROW EXECUTE PROCEDURE "created_date"();
DROP TRIGGER IF EXISTS "general_setting_updated_date" ON "general_setting";
CREATE TRIGGER "general_setting_updated_date" BEFORE INSERT OR UPDATE ON "general_setting" FOR EACH ROW EXECUTE PROCEDURE "updated_date"();

DROP TRIGGER IF EXISTS "import_histories_created_date" ON "import_histories";
CREATE TRIGGER "import_histories_created_date" BEFORE INSERT ON "import_histories" FOR EACH ROW EXECUTE PROCEDURE "created_date"();
DROP TRIGGER IF EXISTS "import_histories_updated_date" ON "import_histories";
CREATE TRIGGER "import_histories_updated_date" BEFORE INSERT OR UPDATE ON "import_histories" FOR EACH ROW EXECUTE PROCEDURE "updated_date"();

DROP TRIGGER IF EXISTS "languages_created_date" ON "languages";
CREATE TRIGGER "languages_created_date" BEFORE INSERT ON "languages" FOR EACH ROW EXECUTE PROCEDURE "created_date"();
DROP TRIGGER IF EXISTS "languages_updated_date" ON "languages";
CREATE TRIGGER "languages_updated_date" BEFORE INSERT OR UPDATE ON "languages" FOR EACH ROW EXECUTE PROCEDURE "updated_date"();

DROP TRIGGER IF EXISTS "list_view_settings_created_date" ON "list_view_settings";
CREATE TRIGGER "list_view_settings_created_date" BEFORE INSERT ON "list_view_settings" FOR EACH ROW EXECUTE PROCEDURE "created_date"();
DROP TRIGGER IF EXISTS "list_view_settings_updated_date" ON "list_view_settings";
CREATE TRIGGER "list_view_settings_updated_date" BEFORE INSERT OR UPDATE ON "list_view_settings" FOR EACH ROW EXECUTE PROCEDURE "updated_date"();

DROP TRIGGER IF EXISTS "list_view_settings_filters_created_date" ON "list_view_settings_filters";
CREATE TRIGGER "list_view_settings_filters_created_date" BEFORE INSERT ON "list_view_settings_filters" FOR EACH ROW EXECUTE PROCEDURE "created_date"();
DROP TRIGGER IF EXISTS "list_view_settings_filters_updated_date" ON "list_view_settings_filters";
CREATE TRIGGER "list_view_settings_filters_updated_date" BEFORE INSERT OR UPDATE ON "list_view_settings_filters" FOR EACH ROW EXECUTE PROCEDURE "updated_date"();

DROP TRIGGER IF EXISTS "services_info_created_date" ON "services_info";
CREATE TRIGGER "services_info_created_date" BEFORE INSERT ON "services_info" FOR EACH ROW EXECUTE PROCEDURE "created_date"();
DROP TRIGGER IF EXISTS "services_info_updated_date" ON "services_info";
CREATE TRIGGER "services_info_updated_date" BEFORE INSERT OR UPDATE ON "services_info" FOR EACH ROW EXECUTE PROCEDURE "updated_date"();

DROP TRIGGER IF EXISTS "suggestions_choice_created_date" ON "suggestions_choice";
CREATE TRIGGER "suggestions_choice_created_date" BEFORE INSERT ON "suggestions_choice" FOR EACH ROW EXECUTE PROCEDURE "created_date"();
DROP TRIGGER IF EXISTS "suggestions_choice_updated_date" ON "suggestions_choice";
CREATE TRIGGER "suggestions_choice_updated_date" BEFORE INSERT OR UPDATE ON "suggestions_choice" FOR EACH ROW EXECUTE PROCEDURE "updated_date"();

DROP TRIGGER IF EXISTS "tab_info_created_date" ON "tab_info";
CREATE TRIGGER "tab_info_created_date" BEFORE INSERT ON "tab_info" FOR EACH ROW EXECUTE PROCEDURE "created_date"();
DROP TRIGGER IF EXISTS "tab_info_updated_date" ON "tab_info";
CREATE TRIGGER "tab_info_updated_date" BEFORE INSERT OR UPDATE ON "tab_info" FOR EACH ROW EXECUTE PROCEDURE "updated_date"();

DROP TRIGGER IF EXISTS "timezones_created_date" ON "timezones";
CREATE TRIGGER "timezones_created_date" BEFORE INSERT ON "timezones" FOR EACH ROW EXECUTE PROCEDURE "created_date"();
DROP TRIGGER IF EXISTS "timezones_updated_date" ON "timezones";
CREATE TRIGGER "timezones_updated_date" BEFORE INSERT OR UPDATE ON "timezones" FOR EACH ROW EXECUTE PROCEDURE "updated_date"();
