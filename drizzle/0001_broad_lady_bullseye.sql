DROP INDEX "idx_employees_email";--> statement-breakpoint
DROP INDEX "idx_employees_user_id";--> statement-breakpoint
DROP INDEX "idx_entries_employee_id";--> statement-breakpoint
CREATE INDEX "idx_employees_email" ON "timesheet_employees" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_employees_user_id" ON "timesheet_employees" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_entries_employee_id" ON "timesheet_entries" USING btree ("employee_id");