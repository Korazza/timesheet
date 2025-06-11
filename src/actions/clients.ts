"use server"

import { revalidateTag, unstable_cache } from "next/cache"
import { eq } from "drizzle-orm"

import db from "@/db"
import { Client, clientsTable } from "@/db/schema"

export const getClients = unstable_cache(
	async () => db.select().from(clientsTable),
	["clients"],
	{ tags: ["clients"] }
)

export const addClient = async (client: typeof clientsTable.$inferInsert) => {
	const createdClient = await db.insert(clientsTable).values(client).returning()
	revalidateTag("clients")
	return createdClient
}

export const updateClient = async (client: Client) => {
	await db
		.update(clientsTable)
		.set(client)
		.where(eq(clientsTable.id, client.id))
	revalidateTag("clients")
}

export const deleteClient = async (clientId: Client["id"]) => {
	await db.delete(clientsTable).where(eq(clientsTable.id, clientId))
	revalidateTag("clients")
}
