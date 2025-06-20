"use server"

import { cache } from "react"
import { eq } from "drizzle-orm"

import db from "@/db"
import { clientsTable } from "@/db/schema"
import { Client } from "@/types"

export const getClients = cache(async () => db.select().from(clientsTable))

export const addClient = async (client: typeof clientsTable.$inferInsert) => {
	return db.insert(clientsTable).values(client).returning()
}

export const updateClient = async (client: Client) => {
	await db
		.update(clientsTable)
		.set(client)
		.where(eq(clientsTable.id, client.id))
}

export const deleteClient = async (clientId: Client["id"]) => {
	await db.delete(clientsTable).where(eq(clientsTable.id, clientId))
}
