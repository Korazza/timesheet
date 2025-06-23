import { ClientsTable } from "@/tables/clients-table"

export default async function ClientPage() {
	return (
		<div className="flex h-full flex-col gap-4 py-4 md:p-4">
			<ClientsTable />
		</div>
	)
}
