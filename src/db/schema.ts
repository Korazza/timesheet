import { relations } from "drizzle-orm";
import {
	index,
	pgEnum,
	pgTableCreator,
	real,
	text,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";

const pgTable = pgTableCreator((name) => `timesheet_${name}`);

export const roleEnum = pgEnum("role", ["EMPLOYEE", "ADMIN"]);
export type Role = (typeof roleEnum.enumValues)[number];

export const entryTypeEnum = pgEnum("entry_type", [
	"WORK",
	"HOLIDAY",
	"PERMIT",
	"SICK",
]);
export type EntryType = (typeof entryTypeEnum.enumValues)[number];

export const activityTypeEnum = pgEnum("activity_type", [
	"PROJECT",
	"TASK",
	"AMS",
]);
export type ActivityType = (typeof activityTypeEnum.enumValues)[number];

export const employeesTable = pgTable(
	"employees",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		userId: text("user_id").notNull(),
		firstName: varchar("first_name", { length: 255 }).notNull(),
		lastName: varchar("last_name", { length: 255 }).notNull(),
		email: varchar("email", { length: 255 }).notNull().unique(),
		role: roleEnum("role").notNull().default("EMPLOYEE"),
		createdAt: timestamp("created_at", { mode: "string", withTimezone: true })
			.defaultNow()
			.notNull(),
	},
	(
		table,
	) => [
		index("idx_employees_user_id").on(table.userId),
		index("idx_employees_email").on(table.email),
	],
);
export type Employee = typeof employeesTable.$inferSelect;
export type EmployeeWithAvatar = Employee & {
	avatarUrl?: string;
};

export const clientsTable = pgTable("clients", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: varchar("name", { length: 255 }).notNull(),
	description: text("description"),
});
export type Client = typeof clientsTable.$inferSelect;

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
		date: timestamp("date", { mode: "string", withTimezone: true }).notNull(),
		hours: real("hours").notNull(),
		overtimeHours: real("overtime_hours"),
		description: text("description"),
		createdAt: timestamp("created_at", { mode: "string", withTimezone: true })
			.defaultNow()
			.notNull(),
	},
	(table) => [index("idx_entries_employee_id").on(table.employeeId)],
);
export type Entry = typeof entriesTable.$inferSelect;
export type EntryWithClient = Entry & { client?: Client | null };

export const entriesRelations = relations(entriesTable, ({ one }) => ({
	employee: one(employeesTable, {
		fields: [entriesTable.clientId],
		references: [employeesTable.id],
	}),
	client: one(clientsTable, {
		fields: [entriesTable.clientId],
		references: [clientsTable.id],
	}),
}));
