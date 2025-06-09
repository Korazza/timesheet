ALTER TABLE "entries" ADD COLUMN "date" date NOT NULL;--> statement-breakpoint
ALTER TABLE "entries" ADD COLUMN "hours" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "entries" DROP COLUMN "start";--> statement-breakpoint
ALTER TABLE "entries" DROP COLUMN "end";