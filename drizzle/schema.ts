import { pgTable, uuid, varchar, text, timestamp, index, unique, foreignKey, real, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const activityType = pgEnum("activity_type", ['PROJECT', 'TASK', 'AMS'])
export const entryType = pgEnum("entry_type", ['WORK', 'HOLIDAY', 'PERMIT', 'SICK'])
export const role = pgEnum("role", ['EMPLOYEE', 'ADMIN'])


export const timesheetClients = pgTable("timesheet_clients", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	description: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const timesheetEmployees = pgTable("timesheet_employees", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	firstName: varchar("first_name", { length: 255 }).notNull(),
	lastName: varchar("last_name", { length: 255 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	role: role().default('EMPLOYEE').notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_employees_email").using("btree", table.email.asc().nullsLast().op("text_ops")),
	index("idx_employees_user_id").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	unique("timesheet_employees_email_unique").on(table.email),
]);

export const timesheetEntries = pgTable("timesheet_entries", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	employeeId: uuid("employee_id").notNull(),
	clientId: uuid("client_id"),
	type: entryType().default('WORK').notNull(),
	activityType: activityType("activity_type"),
	date: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	hours: real().notNull(),
	overtimeHours: real("overtime_hours"),
	description: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_entries_employee_id").using("btree", table.employeeId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.clientId],
			foreignColumns: [timesheetClients.id],
			name: "timesheet_entries_client_id_timesheet_clients_id_fk"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.employeeId],
			foreignColumns: [timesheetEmployees.id],
			name: "timesheet_entries_employee_id_timesheet_employees_id_fk"
		}).onDelete("cascade"),
]);
