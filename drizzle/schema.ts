import { pgTable, unique, uuid, text, varchar, timestamp, foreignKey, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const entryType = pgEnum("entryType", ['WORK', 'HOLIDAY', 'SICK'])
export const role = pgEnum("role", ['EMPLOYEE', 'ADMIN'])


export const employees = pgTable("employees", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	firstName: varchar("first_name", { length: 255 }).notNull(),
	lastName: varchar("last_name", { length: 255 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	role: role().default('EMPLOYEE').notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("employees_email_unique").on(table.email),
]);

export const entries = pgTable("entries", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	employeeId: uuid("employee_id").notNull(),
	clientId: uuid("client_id"),
	type: entryType().default('WORK').notNull(),
	start: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	end: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	description: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.clientId],
			foreignColumns: [clients.id],
			name: "entries_client_id_clients_id_fk"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.employeeId],
			foreignColumns: [employees.id],
			name: "entries_employee_id_employees_id_fk"
		}).onDelete("cascade"),
]);

export const clients = pgTable("clients", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	description: text(),
	email: varchar({ length: 255 }).notNull(),
}, (table) => [
	unique("clients_email_unique").on(table.email),
]);
