"use server"

import { cache } from "react"
import { desc, eq } from "drizzle-orm"

import db from "@/db"
import { entriesTable } from "@/db/schema"
import { Entry } from "@/types"
import { getEmployee } from "./employees"

export const getEntries = cache(async (employeeId?: Entry["employeeId"]) => {
	const user = await getEmployee()

	if (!user) {
		throw new Error("Unauthorized")
	}

	const effectiveEmployeeId =
		user.role === "ADMIN" && employeeId ? employeeId : user.id

	return db.query.entriesTable.findMany({
		where: eq(entriesTable.employeeId, effectiveEmployeeId),
		orderBy: desc(entriesTable.date),
		with: { client: true },
	})
})

export const addEntry = async (entry: typeof entriesTable.$inferInsert) => {
	const createdEntry = await db.insert(entriesTable).values(entry).returning()
	return createdEntry
}

export const updateEntry = async (entry: Entry) => {
	return (
		await db
			.update(entriesTable)
			.set({ ...entry, updatedAt: new Date() })
			.where(eq(entriesTable.id, entry.id))
			.returning()
	)[0]
}

export const deleteEntry = async (entryId: Entry["id"]) => {
	const entry = await db.query.entriesTable.findFirst({
		where: eq(entriesTable.id, entryId),
		columns: {
			employeeId: true,
		},
	})

	if (entry) {
		await db.delete(entriesTable).where(eq(entriesTable.id, entryId))
	}
}
