"use client"

import { useClients } from "@/hooks/use-clients"
import { ClientsTable } from "@/tables/clients-table"

export default function ClientPage() {
	const { clients } = useClients()

	return (
		<div className="flex h-full flex-col gap-4 py-4 md:p-4">
			<ClientsTable clients={clients} />
		</div>
	)
}
