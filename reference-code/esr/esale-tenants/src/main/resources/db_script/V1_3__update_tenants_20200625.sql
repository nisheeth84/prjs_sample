-- ----------------------------
-- Function structure for updated_date
-- ----------------------------
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

DROP TRIGGER IF EXISTS "license_packages_created_date" ON "license_packages";
CREATE TRIGGER "license_packages_created_date" BEFORE INSERT ON "license_packages" FOR EACH ROW EXECUTE PROCEDURE "created_date"();
DROP TRIGGER IF EXISTS "license_packages_updated_date" ON "license_packages";
CREATE TRIGGER "license_packages_updated_date" BEFORE INSERT OR UPDATE ON "license_packages" FOR EACH ROW EXECUTE PROCEDURE "updated_date"();

DROP TRIGGER IF EXISTS "m_industries_created_date" ON "m_industries";
CREATE TRIGGER "m_industries_created_date" BEFORE INSERT ON "m_industries" FOR EACH ROW EXECUTE PROCEDURE "created_date"();
DROP TRIGGER IF EXISTS "m_industries_updated_date" ON "m_industries";
CREATE TRIGGER "m_industries_updated_date" BEFORE INSERT OR UPDATE ON "m_industries" FOR EACH ROW EXECUTE PROCEDURE "updated_date"();


DROP TRIGGER IF EXISTS "m_packages_created_date" ON "m_packages";
CREATE TRIGGER "m_packages_created_date" BEFORE INSERT ON "m_packages" FOR EACH ROW EXECUTE PROCEDURE "created_date"();
DROP TRIGGER IF EXISTS "m_packages_updated_date" ON "m_packages";
CREATE TRIGGER "m_packages_updated_date" BEFORE INSERT OR UPDATE ON "m_packages" FOR EACH ROW EXECUTE PROCEDURE "updated_date"();


DROP TRIGGER IF EXISTS "m_packages_services_created_date" ON "m_packages_services";
CREATE TRIGGER "m_packages_services_created_date" BEFORE INSERT ON "m_packages_services" FOR EACH ROW EXECUTE PROCEDURE "created_date"();
DROP TRIGGER IF EXISTS "m_packages_services_updated_date" ON "m_packages_services";
CREATE TRIGGER "m_packages_services_updated_date" BEFORE INSERT OR UPDATE ON "m_packages_services" FOR EACH ROW EXECUTE PROCEDURE "updated_date"();

DROP TRIGGER IF EXISTS "m_services_created_date" ON "m_services";
CREATE TRIGGER "m_services_created_date" BEFORE INSERT ON "m_services" FOR EACH ROW EXECUTE PROCEDURE "created_date"();
DROP TRIGGER IF EXISTS "m_services_updated_date" ON "m_services";
CREATE TRIGGER "m_services_updated_date" BEFORE INSERT OR UPDATE ON "m_services" FOR EACH ROW EXECUTE PROCEDURE "updated_date"();

DROP TRIGGER IF EXISTS "m_templates_created_date" ON "m_templates";
CREATE TRIGGER "m_templates_created_date" BEFORE INSERT ON "m_templates" FOR EACH ROW EXECUTE PROCEDURE "created_date"();
DROP TRIGGER IF EXISTS "m_templates_updated_date" ON "m_templates";
CREATE TRIGGER "m_templates_updated_date" BEFORE INSERT OR UPDATE ON "m_templates" FOR EACH ROW EXECUTE PROCEDURE "updated_date"();


DROP TRIGGER IF EXISTS "payments_management_created_date" ON "payments_management";
CREATE TRIGGER "payments_management_created_date" BEFORE INSERT ON "payments_management" FOR EACH ROW EXECUTE PROCEDURE "created_date"();
DROP TRIGGER IF EXISTS "payments_management_updated_date" ON "payments_management";
CREATE TRIGGER "payments_management_updated_date" BEFORE INSERT OR UPDATE ON "payments_management" FOR EACH ROW EXECUTE PROCEDURE "updated_date"();


DROP TRIGGER IF EXISTS "quicksight_settings_created_date" ON "quicksight_settings";
CREATE TRIGGER "quicksight_settings_created_date" BEFORE INSERT ON "quicksight_settings" FOR EACH ROW EXECUTE PROCEDURE "created_date"();
DROP TRIGGER IF EXISTS "quicksight_settings_updated_date" ON "quicksight_settings";
CREATE TRIGGER "quicksight_settings_updated_date" BEFORE INSERT OR UPDATE ON "quicksight_settings" FOR EACH ROW EXECUTE PROCEDURE "updated_date"();


DROP TRIGGER IF EXISTS "storages_management_created_date" ON "storages_management";
CREATE TRIGGER "storages_management_created_date" BEFORE INSERT ON "storages_management" FOR EACH ROW EXECUTE PROCEDURE "created_date"();
DROP TRIGGER IF EXISTS "storages_management_updated_date" ON "storages_management";
CREATE TRIGGER "storages_management_updated_date" BEFORE INSERT OR UPDATE ON "storages_management" FOR EACH ROW EXECUTE PROCEDURE "updated_date"();


DROP TRIGGER IF EXISTS "tenants_created_date" ON "tenants";
CREATE TRIGGER "tenants_created_date" BEFORE INSERT ON "tenants" FOR EACH ROW EXECUTE PROCEDURE "created_date"();
DROP TRIGGER IF EXISTS "tenants_updated_date" ON "tenants";
CREATE TRIGGER "tenants_updated_date" BEFORE INSERT OR UPDATE ON "tenants" FOR EACH ROW EXECUTE PROCEDURE "updated_date"();
-- ----------------------------
-- DROP DEFAULT m_package_id
-- ----------------------------
ALTER TABLE IF EXISTS "m_packages" ALTER COLUMN "m_package_id" DROP DEFAULT;

-- ----------------------------
-- DROP DEFAULT m_service_id
-- ----------------------------
ALTER TABLE IF EXISTS "m_services" ALTER COLUMN "m_service_id" DROP DEFAULT;

-- ----------------------------
-- DROP DEFAULT m_package_service_id
-- ----------------------------
ALTER TABLE IF EXISTS "m_packages_services" ALTER COLUMN "m_package_service_id" DROP DEFAULT;

-- ----------------------------
-- Sequence structure for m_packages_sequence_generator
-- ----------------------------
DROP SEQUENCE IF EXISTS "m_packages_sequence_generator";

-- ----------------------------
-- Sequence structure for m_services_sequence_generator
-- ----------------------------
DROP SEQUENCE IF EXISTS "m_services_sequence_generator";

-- ----------------------------
-- Sequence structure for m_packages_services_sequence_generator
-- ----------------------------
DROP SEQUENCE IF EXISTS "m_packages_services_sequence_generator";