import { ClientsTable } from "@/components/tables/clients-table"

export default async function ClientPage() {
	return (
		<div className="p-6 w-full space-y-4">
			<h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
				Clienti
			</h2>
			<ClientsTable />
		</div>
	)
}
