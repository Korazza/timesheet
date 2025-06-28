ALTER TABLE "timesheet_clients" ALTER COLUMN "updated_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "timesheet_employees" ALTER COLUMN "updated_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "timesheet_entries" ALTER COLUMN "updated_at" DROP DEFAULT;