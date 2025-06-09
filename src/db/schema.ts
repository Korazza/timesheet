import {
  date,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["EMPLOYEE", "ADMIN"]);
export type Role = typeof roleEnum.enumValues[number];

export const entryTypeEnum = pgEnum("entryType", ["WORK", "HOLIDAY", "SICK"]);
export type EntryType = typeof entryTypeEnum.enumValues[number];

export const employeesTable = pgTable("employees", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  role: roleEnum("role").notNull().default("EMPLOYEE"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow()
    .notNull(),
});
export type Employee = typeof employeesTable.$inferSelect;

export const clientsTable = pgTable("clients", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
});
export type Client = typeof clientsTable.$inferSelect;

export const entriesTable = pgTable("entries", {
  id: uuid("id").defaultRandom().primaryKey(),
  employeeId: uuid("employee_id").references(
    () => employeesTable.id,
    {
      onDelete: "cascade",
    },
  ).notNull(),
  clientId: uuid("client_id").references(() => clientsTable.id, {
    onDelete: "set null",
  }),
  type: entryTypeEnum("type").notNull().default("WORK"),
  date: timestamp("date").notNull(),
  hours: integer("hours").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow()
    .notNull(),
});
export type Entry = typeof entriesTable.$inferSelect;
