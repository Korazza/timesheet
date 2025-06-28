import { relations } from "drizzle-orm/relations";
import { timesheetClients, timesheetEntries, timesheetEmployees } from "./schema";

export const timesheetEntriesRelations = relations(timesheetEntries, ({one}) => ({
	timesheetClient: one(timesheetClients, {
		fields: [timesheetEntries.clientId],
		references: [timesheetClients.id]
	}),
	timesheetEmployee: one(timesheetEmployees, {
		fields: [timesheetEntries.employeeId],
		references: [timesheetEmployees.id]
	}),
}));

export const timesheetClientsRelations = relations(timesheetClients, ({many}) => ({
	timesheetEntries: many(timesheetEntries),
}));

export const timesheetEmployeesRelations = relations(timesheetEmployees, ({many}) => ({
	timesheetEntries: many(timesheetEntries),
}));