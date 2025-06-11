import { ClientsTable } from "@/components/tables/clients-table"

export default async function ClientPage() {
	return (
		<div className="p-4 w-full">
			<ClientsTable />
		</div>
	)
}
