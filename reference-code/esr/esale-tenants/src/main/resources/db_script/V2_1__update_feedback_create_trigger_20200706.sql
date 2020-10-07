DROP TRIGGER IF EXISTS "feedback_created_date" ON "feedback";
CREATE TRIGGER "feedback_created_date" BEFORE INSERT ON "feedback" FOR EACH ROW EXECUTE PROCEDURE "created_date"() ;
DROP TRIGGER IF EXISTS "feedback_updated_date" ON "feedback" ;
CREATE TRIGGER "feedback_updated_date" BEFORE UPDATE ON "feedback" FOR EACH ROW EXECUTE PROCEDURE "updated_date"();

DROP TRIGGER IF EXISTS "feedback_status_open_created_date" ON "feedback_status_open";
CREATE TRIGGER "feedback_status_open_created_date" BEFORE INSERT ON "feedback_status_open" FOR EACH ROW EXECUTE PROCEDURE "created_date"() ;
DROP TRIGGER IF EXISTS "feedback_status_open_updated_date" ON "feedback_status_open" ;
CREATE TRIGGER "feedback_status_open_updated_date" BEFORE UPDATE ON "feedback_status_open" FOR EACH ROW EXECUTE PROCEDURE "updated_date"();