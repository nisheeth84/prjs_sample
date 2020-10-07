UPDATE "field_info" SET "updated_date" = now(), "updated_user" = 1, "available_flag" = 3 WHERE "available_flag" is null;
ALTER TABLE "field_info" ALTER COLUMN "available_flag" SET NOT NULL;