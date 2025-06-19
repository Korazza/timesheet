import {
	pgTable,
	unique,
	uuid,
	text,
	varchar,
	timestamp,
	foreignKey,
	real,
	pgEnum,
} from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const activityType = pgEnum("activity_type", ["PROJECT", "TASK", "AMS"])
export const entryType = pgEnum("entry_type", [
	"WORK",
	"HOLIDAY",
	"PERMIT",
	"SICK",
])
export const role = pgEnum("role", ["EMPLOYEE", "ADMIN"])

export const employees = pgTable(
	"employees",
	{
		id: uuid().defaultRandom().primaryKey().notNull(),
		userId: text("user_id").notNull(),
		firstName: varchar("first_name", { length: 255 }).notNull(),
		lastName: varchar("last_name", { length: 255 }).notNull(),
		email: varchar({ length: 255 }).notNull(),
		role: role().default("EMPLOYEE").notNull(),
		createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
			.defaultNow()
			.notNull(),
	},
	(table) => [unique("employees_email_unique").on(table.email)]
)

export const clients = pgTable("clients", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	description: text(),
})

export const entries = pgTable(
	"entries",
	{
		id: uuid().defaultRandom().primaryKey().notNull(),
		employeeId: uuid("employee_id").notNull(),
		clientId: uuid("client_id"),
		type: entryType().default("WORK").notNull(),
		activityType: activityType("activity_type"),
		date: timestamp({ withTimezone: true, mode: "string" }).notNull(),
		hours: real().notNull(),
		overtimeHours: real("overtime_hours"),
		description: text(),
		createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
			.defaultNow()
			.notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.clientId],
			foreignColumns: [clients.id],
			name: "entries_client_id_clients_id_fk",
		}).onDelete("set null"),
		foreignKey({
			columns: [table.employeeId],
			foreignColumns: [employees.id],
			name: "entries_employee_id_employees_id_fk",
		}).onDelete("cascade"),
	]
)
