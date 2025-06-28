import { relations } from "drizzle-orm"
import {
	index,
	pgEnum,
	pgTableCreator,
	real,
	text,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core"
import { timestamps } from "./helpers"

const pgTable = pgTableCreator((name) => `timesheet_${name}`)

export const roleEnum = pgEnum("role", ["EMPLOYEE", "ADMIN"])

export const entryTypeEnum = pgEnum("entry_type", [
	"WORK",
	"HOLIDAY",
	"PERMIT",
	"SICK",
])

export const activityTypeEnum = pgEnum("activity_type", [
	"PROJECT",
	"TASK",
	"AMS",
])

export const employeesTable = pgTable(
	"employees",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		userId: text("user_id").notNull(),
		firstName: varchar("first_name", { length: 255 }).notNull(),
		lastName: varchar("last_name", { length: 255 }).notNull(),
		email: varchar("email", { length: 255 }).notNull().unique(),
		role: roleEnum("role").notNull().default("EMPLOYEE"),
		...timestamps,
	},
	(table) => [
		index("idx_employees_user_id").on(table.userId),
		index("idx_employees_email").on(table.email),
	]
).enableRLS()

export const clientsTable = pgTable("clients", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: varchar("name", { length: 255 }).notNull(),
	description: text("description"),
	...timestamps,
}).enableRLS()

export const entriesTable = pgTable(
	"entries",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		employeeId: uuid("employee_id")
			.references(() => employeesTable.id, {
				onDelete: "cascade",
			})
			.notNull(),
		clientId: uuid("client_id").references(() => clientsTable.id, {
			onDelete: "set null",
		}),
		type: entryTypeEnum("type").notNull().default("WORK"),
		activityType: activityTypeEnum("activity_type"),
		date: timestamp("date", { withTimezone: true }).notNull(),
		hours: real("hours").notNull(),
		overtimeHours: real("overtime_hours"),
		description: text("description"),
		...timestamps,
	},
	(table) => [index("idx_entries_employee_id").on(table.employeeId)]
).enableRLS()

export const entriesRelations = relations(entriesTable, ({ one }) => ({
	employee: one(employeesTable, {
		fields: [entriesTable.clientId],
		references: [employeesTable.id],
	}),
	client: one(clientsTable, {
		fields: [entriesTable.clientId],
		references: [clientsTable.id],
	}),
}))
