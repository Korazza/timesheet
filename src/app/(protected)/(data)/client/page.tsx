import { ClientsTable } from "@/components/tables/clients-table"

export default async function ClientPage() {
	return (
		<div className="flex flex-col h-full py-4 md:p-4 gap-4">
			<ClientsTable />
		</div>
	)
}
