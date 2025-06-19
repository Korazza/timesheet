import { relations } from "drizzle-orm/relations"
import { clients, entries, employees } from "./schema"

export const entriesRelations = relations(entries, ({ one }) => ({
	client: one(clients, {
		fields: [entries.clientId],
		references: [clients.id],
	}),
	employee: one(employees, {
		fields: [entries.employeeId],
		references: [employees.id],
	}),
}))

export const clientsRelations = relations(clients, ({ many }) => ({
	entries: many(entries),
}))

export const employeesRelations = relations(employees, ({ many }) => ({
	entries: many(entries),
}))
