import { PermitEntriesTable } from "@/components/tables/permit-entries-table"

export default async function PermitPage() {
	return (
		<div className="flex flex-col h-full p-4 gap-4">
			<PermitEntriesTable />
		</div>
	)
}
